import React, { useState, useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom";
import { Star, StarHalf, CheckCircle, Loader2, Filter, X, Image as ImageIcon, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OptimizedImageResponsive from "@/components/OptimizedImageResponsive";
import { createReview, getPlantReviews, getPlantReviewMedia, updateReview } from "@/api/customer/reviews";
import { useAuth } from "@/context/AuthContext";
import { Edit3 } from "lucide-react";
import toast from "react-hot-toast";

// Lazy-load ReviewModal (only shown when user wants to write a review)
const ReviewModal = lazy(() => import("@/components/ReviewModal"));

const ReviewsSection = ({ productName, variantId, plantId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [userContext, setUserContext] = useState(null);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [editingReview, setEditingReview] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState("latest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [galleryImages, setGalleryImages] = useState([]);
  const [totalGalleryCount, setTotalGalleryCount] = useState(0);

  const [modalImages, setModalImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isAllPhotosModalOpen, setIsAllPhotosModalOpen] = useState(false);
  const [wasGalleryOpen, setWasGalleryOpen] = useState(false);

  const fetchReviews = async (pageNum, sortOption, isReset = false) => {
    try {
      if (!plantId) return;
      if (isReset) setIsLoadingInitial(true);
      else setIsLoadingMore(true);

      const limit = 5;
      const response = await getPlantReviews(plantId, pageNum, limit, sortOption);
      const responseData = response?.data || {};

      setTotalReviewsCount(response.pagination?.total || 0);
      if (responseData.summary) setStats(responseData.summary);
      if (responseData.userContext) setUserContext(responseData.userContext);

      if (isReset) setReviews(responseData.reviews || []);
      else setReviews((prev) => [...prev, ...(responseData.reviews || [])]);

      setHasMore((pageNum * limit) < (response.pagination?.total || 0));
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setIsLoadingInitial(false);
      setIsLoadingMore(false);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      if (!plantId) return;
      const response = await getPlantReviewMedia(plantId, 1, 20, 'image');
      if (response && response.success) {
        setGalleryImages((response.data || []).map(item => ({
          ...item,
          url: item.mediaUrl || item.url
        })));
        setTotalGalleryCount(response.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch gallery images", error);
    }
  };

  useEffect(() => {
    if (plantId) {
      setPage(1);
      fetchReviews(1, sortBy, true);
      fetchGalleryImages();
    }
  }, [plantId, sortBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReviews(nextPage, sortBy, false);
  };

  const handleReviewSubmit = async (modalData) => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('rating', modalData.rating);
      data.append('title', modalData.title || '');
      data.append('message', modalData.review || '');
      if (modalData.images?.length) {
        modalData.images.forEach(img => data.append('media', img.file));
      }

      if (userContext?.hasReviewed && userContext?.reviewId) {
        await updateReview(userContext.reviewId, data);
        toast.success("Review updated successfully!");
      } else {
        await createReview(variantId, data);
        toast.success("Review posted successfully!");
      }

      setPage(1);
      setSortBy("latest");
      fetchReviews(1, "latest", true);
      fetchGalleryImages();
      setIsModalOpen(false);
      setEditingReview(null);
    } catch (error) {
      console.error("Failed to submit", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview({
      rating: review.rating,
      title: review.title,
      review: review.message,
      images: review.media?.map(m => ({ url: m.url || m.mediaUrl, id: m.id })) || []
    });
    setIsModalOpen(true);
  };

  const openGalleryImage = (img) => {
    setModalImages(galleryImages);
    if (isAllPhotosModalOpen) {
      setWasGalleryOpen(true);
      setIsAllPhotosModalOpen(false);
    }
    setTimeout(() => setSelectedImage(img), 50);
  };

  const openReviewImage = (img, reviewMediaList) => {
    setModalImages(reviewMediaList);
    setWasGalleryOpen(false);
    setSelectedImage(img);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setModalImages([]);
    if (wasGalleryOpen) {
      setTimeout(() => {
        setIsAllPhotosModalOpen(true);
        setWasGalleryOpen(false);
      }, 50);
    }
  };

  const ImageModal = () => {
    if (!selectedImage) return null;

    const activeList = modalImages.length > 0 ? modalImages : [selectedImage];
    const currentIndex = activeList.findIndex(
      img => (img.id && img.id === selectedImage.id) || (img.url === selectedImage.url)
    );
    const hasNext = currentIndex !== -1 && currentIndex < activeList.length - 1;
    const hasPrev = currentIndex > 0;

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
      setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe && hasNext) {
        setSelectedImage(activeList[currentIndex + 1]);
      }
      if (isRightSwipe && hasPrev) {
        setSelectedImage(activeList[currentIndex - 1]);
      }
    };

    const handleNext = (e) => {
      e.preventDefault(); e.stopPropagation();
      if (hasNext) setSelectedImage(activeList[currentIndex + 1]);
    };

    const handlePrev = (e) => {
      e.preventDefault(); e.stopPropagation();
      if (hasPrev) setSelectedImage(activeList[currentIndex - 1]);
    };

    const handleClose = (e) => {
      e.preventDefault(); e.stopPropagation();
      closeImageModal();
    };

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === "ArrowRight" && hasNext) setSelectedImage(activeList[currentIndex + 1]);
        if (e.key === "ArrowLeft" && hasPrev) setSelectedImage(activeList[currentIndex - 1]);
        if (e.key === "Escape") closeImageModal();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, hasNext, hasPrev, activeList]);

    return ReactDOM.createPortal(
      <div
        // FIX: touch-none prevents browser scrolling/zooming while swiping
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-200 touch-none"
        onClick={handleClose}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 md:top-8 md:right-8 z-[10001] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer">
          <X className="w-8 h-8" />
        </button>

        {hasPrev && (
          <button onClick={handlePrev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-[10001] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer hidden md:block">
            <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        )}

        {hasNext && (
          <button onClick={handleNext} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-[10001] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer hidden md:block">
            <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        )}

        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-12 pointer-events-none">
          <OptimizedImageResponsive
            src={selectedImage.url}
            alt="Review"
            width={800}
            height={600}
            loading="lazy"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none pointer-events-auto"
            style={{ pointerEvents: "auto" }}
            onDragStart={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-8 text-white/90 text-sm font-bold bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">
            {currentIndex + 1} / {activeList.length}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
      ))}
    </div>
  );

  return (
    <div className="bg-white py-8 md:py-16 relative">
      {/* Lazy-load ReviewModal (only rendered when user opens it) */}
      <Suspense fallback={null}>
        {isModalOpen && (
          <ReviewModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingReview(null);
            }}
            onSubmit={handleReviewSubmit}
            productName={productName}
            isSubmitting={isSubmitting}
            initialData={editingReview}
            isEditing={!!editingReview}
          />
        )}
      </Suspense>

      <ImageModal />

      <Dialog open={isAllPhotosModalOpen} onOpenChange={setIsAllPhotosModalOpen}>
        <DialogContent className="z-[100] max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col p-0 bg-white rounded-3xl border-0 shadow-2xl">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <DialogHeader className="p-0">
              <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                Customer Photos
                <span className="text-gray-400 font-normal text-base ml-1">({totalGalleryCount})</span>
              </DialogTitle>
            </DialogHeader>
            <button onClick={() => setIsAllPhotosModalOpen(false)} className="p-2 bg-gray-100 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6 overflow-y-auto bg-gray-50/50">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryImages.map((img, index) => (
                <div
                  key={img.id || index}
                  onClick={() => openGalleryImage(img)}
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-gray-200 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <OptimizedImageResponsive 
                    src={img.url} 
                    alt="Gallery" 
                    width={200}
                    height={200}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 md:mb-12 tracking-tight">Customer Reviews</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-emerald-50/50 p-6 md:p-8 rounded-3xl border border-emerald-100/50 sticky top-24">
              <div className="text-center mb-8">
                <div className="text-6xl font-black text-emerald-900 mb-2">{stats ? stats.averageRating : "0.0"}</div>
                <div className="flex justify-center mb-3">{renderStars(Number(stats?.averageRating || 0))}</div>
                <p className="text-sm font-bold text-emerald-700 uppercase">Based on {totalReviewsCount} reviews</p>
              </div>
              <div className="space-y-3 mb-8">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-500 w-12">{star} Star</span>
                    <div className="flex-1 bg-white rounded-full h-2.5 overflow-hidden border border-emerald-100">
                      <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${stats?.stars?.[star]?.percentage || 0}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 w-8 text-right">{stats?.stars?.[star]?.percentage || 0}%</span>
                  </div>
                ))}
              </div>
              {isAuthenticated && (
                userContext?.hasReviewed ? (
                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm">
                    <p className="text-xs font-bold text-emerald-800 mb-3 uppercase tracking-wider">You have reviewed this product</p>
                    <Button
                      onClick={() => {
                        const userReview = reviews.find(r => r.id === userContext.reviewId);
                        if (userReview) handleEditClick(userReview);
                      }}
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-5 rounded-xl flex gap-2"
                    >
                      <Edit3 className="w-4 h-4" /> Edit Your Review
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsModalOpen(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl">Write a Review</Button>
                )
              )}
            </div>
          </div>


          <div className="lg:col-span-8">

            {galleryImages.length > 0 && (
              <div className="mb-10 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                    Customer Photos <span className="text-gray-400 font-normal text-sm">({totalGalleryCount})</span>
                  </h3>
                  {totalGalleryCount > 5 && (
                    <button onClick={() => setIsAllPhotosModalOpen(true)} className="text-sm font-bold text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory touch-pan-x w-full">
                  {galleryImages.slice(0, 5).map((img, index) => {
                    if (index === 4 && totalGalleryCount > 5) {
                      return (
                        <div key={img.id || index} className="relative min-w-[6rem] w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden cursor-pointer group shadow-sm border border-gray-100 snap-start">
                          <OptimizedImageResponsive 
                            src={img.url} 
                            alt="Gallery" 
                            width={128}
                            height={128}
                            loading="lazy"
                            className="w-full h-full object-cover" 
                          />
                          <button onClick={() => setIsAllPhotosModalOpen(true)} className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white font-bold text-sm backdrop-blur-[2px]">
                            <span className="text-lg mb-0.5">+{totalGalleryCount - 5}</span>
                            <span className="text-[10px] uppercase">More</span>
                          </button>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={img.id || index}
                        onClick={() => openGalleryImage(img)}
                        className="relative min-w-[6rem] w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden cursor-pointer border border-gray-100 shadow-sm snap-start"
                      >
                        <OptimizedImageResponsive 
                          src={img.url} 
                          alt="Gallery" 
                          width={128}
                          height={128}
                          loading="lazy"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Verified Feedback <span className="bg-gray-100 px-2 rounded-full text-xs">{totalReviewsCount}</span></h3>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase">Sort</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer">
                  <option value="latest">Newest</option>
                  <option value="oldest">Oldest</option>
                  {/* <option value="highest">Highest</option>
                  <option value="lowest">Lowest</option> */}
                </select>
              </div>
            </div>

            {isLoadingInitial ? (
              <div className="flex flex-col items-center py-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" /><p className="text-sm text-gray-400">Loading reviews...</p></div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <Star className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                <p className="font-bold text-gray-900">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => {
                  const isUserReview = userContext?.hasReviewed && userContext?.reviewId === review.id;

                  return (
                    <div
                      key={review.id}
                      className={`p-4 md:p-6 rounded-2xl transition-all ${isUserReview
                        ? 'bg-emerald-50/40 border border-emerald-100 shadow-sm'
                        : 'bg-white border-b border-gray-100'
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Avatar - Hidden on very small screens to save space or kept small */}
                        <div className="flex items-center gap-3 sm:block">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                            {review.customerName?.charAt(0)}
                          </div>
                          {/* Mobile-only name display next to avatar */}
                          <div className="sm:hidden flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-gray-900 text-sm">{review.customerName}</h4>
                              {isUserReview && <span className="text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.5 rounded uppercase">You</span>}
                            </div>
                            <span className="text-[10px] text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            {/* Desktop/Tablet Name & Meta */}
                            <div className="hidden sm:block">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900">{review.customerName}</h4>
                                {isUserReview && (
                                  <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded uppercase tracking-tighter">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {renderStars(review.rating)}
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Mobile Star Rating - Shown under avatar line on mobile */}
                            <div className="sm:hidden">
                              {renderStars(review.rating)}
                            </div>

                            {/* Actions Area */}
                            <div className="flex flex-col items-end gap-2 shrink-0">
                              {review.isVerified && (
                                <span className="text-emerald-700 text-[9px] md:text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                              )}
                              {isUserReview && (
                                <button
                                  onClick={() => handleEditClick(review)}
                                  className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1.5 p-1.5 bg-white sm:bg-transparent rounded-lg border sm:border-0 border-emerald-100 shadow-sm sm:shadow-none"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Review</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <h5 className="font-bold text-gray-800 text-sm md:text-base mb-1.5">{review.title}</h5>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.message}</p>

                          {review.media?.length > 0 && (
                            <div className="flex flex-wrap gap-2 md:gap-3">
                              {review.media.map(media => {
                                const mediaItem = { ...media, url: media.url || media.mediaUrl };
                                return (
                                  <div
                                    key={mediaItem.id || Math.random()}
                                    onClick={() => openReviewImage(mediaItem, review.media.map(m => ({ ...m, url: m.url || m.mediaUrl })))}
                                    className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-emerald-400 transition-all shadow-sm active:scale-95"
                                  >
                                    <OptimizedImageResponsive 
                                      src={mediaItem.url} 
                                      alt="Review media" 
                                      width={96}
                                      height={96}
                                      loading="lazy"
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoadingInitial && hasMore && (
              <div className="text-center mt-10 pt-6 border-t border-gray-100">
                <button onClick={handleLoadMore} disabled={isLoadingMore} className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm hover:text-emerald-600 hover:border-emerald-600 flex items-center gap-2 mx-auto">
                  {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />} {isLoadingMore ? "Loading..." : "Show More Reviews"}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;