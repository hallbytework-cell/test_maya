import React, { useState, useEffect, useRef } from "react";
import { X, Star, Loader2, Upload, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MAX_IMAGES = 5;
const MAX_SIZE_PER_FILE = 5 * 1024 * 1024; // 5MB
const MAX_TOTAL_SIZE = 10 * 1024 * 1024;   // 10MB

const ReviewModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  productName, 
  isSubmitting,
  initialData = null,
  isEditing = false  
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    review: "",
    rating: 0,
    images: [], 
  });
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initialData) {
        setFormData({
          title: initialData.title || "",
          review: initialData.review || "",
          rating: initialData.rating || 0,
          images: initialData.images || [], 
        });
      } else {
        setFormData({ title: "", review: "", rating: 0, images: [] });
      }
      setHoverRating(0);
      setError("");
    }
  }, [isOpen, isEditing, initialData]);

  const handleRatingClick = (rating) => {
    if (isSubmitting) return;
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    setError("");
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (formData.images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    let currentTotalSize = formData.images.reduce((acc, img) => acc + (img.size || 0), 0);
    const newImagesPromises = [];

    for (const file of files) {
      if (file.size > MAX_SIZE_PER_FILE) {
        setError(`File "${file.name}" exceeds the 5MB limit.`);
        return;
      }
      currentTotalSize += file.size;
      if (currentTotalSize > MAX_TOTAL_SIZE) {
        setError(`Total upload size exceeds the 10MB limit.`);
        return;
      }

      const promise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ 
            file: file, 
            url: reader.result, 
            size: file.size 
          });
        };
        reader.readAsDataURL(file);
      });
      newImagesPromises.push(promise);
    }

    const newImages = await Promise.all(newImagesPromises);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    setError(""); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert("Please select a star rating to submit your review.");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <h3 className="text-white font-bold text-lg">
            {isEditing ? "Update Review" : "Write Review"} for {productName}
          </h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-emerald-100 hover:text-white transition-colors disabled:opacity-50">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 md:p-8">
          <form id="review-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-2 mb-4">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-wide">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    type="button" 
                    key={star} 
                    disabled={isSubmitting} 
                    onMouseEnter={() => !isSubmitting && setHoverRating(star)} 
                    onMouseLeave={() => !isSubmitting && setHoverRating(0)} 
                    onClick={() => handleRatingClick(star)} 
                    className="focus:outline-none transition-transform hover:scale-110 disabled:hover:scale-100"
                  >
                    <Star className={`w-8 h-8 ${star <= (hoverRating || formData.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Review Title</label>
                <input disabled={isSubmitting} type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 outline-none transition-all font-medium" placeholder="Summary of your experience" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Review</label>
                <textarea disabled={isSubmitting} name="review" value={formData.review} onChange={handleInputChange} rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 outline-none transition-all font-medium resize-none" placeholder="Tell us what you liked or didn't like..." />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-xs font-bold text-gray-700 uppercase">Add Photos</label>
                    <span className="text-[10px] text-gray-400 font-medium">{formData.images.length}/{MAX_IMAGES}</span>
                </div>
                <div className="space-y-3">
                    {error && <div className="flex items-center gap-2 text-red-500 text-xs font-medium bg-red-50 p-3 rounded-xl border border-red-100"><AlertCircle className="w-4 h-4" />{error}</div>}
                    {formData.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 mb-3">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                                    <img src={img.url} alt="upload" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => handleRemoveImage(index)} disabled={isSubmitting} className="absolute top-1 right-1 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors">
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {formData.images.length < MAX_IMAGES && (
                        <div onClick={() => !isSubmitting && fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                            <Upload className="w-5 h-5 text-gray-400 mb-2" />
                            <span className="text-xs font-bold text-gray-400 text-center">Click to upload images</span>
                        </div>
                    )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple className="hidden" disabled={isSubmitting} />
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 bg-white">
          <Button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl py-6 font-bold">Cancel</Button>
          <Button type="submit" form="review-form" disabled={isSubmitting} className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl py-6 font-bold">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : (isEditing ? "Update Review" : "Submit Review")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;