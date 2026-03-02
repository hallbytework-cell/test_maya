import React, { useState, useEffect } from "react";
import { Star, X, Loader2, MapPin, User } from "lucide-react";

const PlatformFeedbackModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    review: "",
    rating: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ review: "", rating: 0 });
      setHoverRating(0);
    }
  }, [isOpen]);

  const handleRatingClick = (rating) => {
    if (isSubmitting) return;
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert("Please select a star rating");
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold text-lg">Rate Your Experience</h3>
            <p className="text-emerald-100 text-xs">Help us improve our platform</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-emerald-100 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              How was your experience?
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
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || formData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {/* <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                 <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                 <input
                    required
                    disabled={isSubmitting}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Your Name"
                 />
              </div>
              <div className="relative">
                 <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                 <input
                    disabled={isSubmitting}
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="City (Optional)"
                 />
              </div>
            </div> */}

            <textarea
              required
              disabled={isSubmitting}
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-medium resize-none disabled:opacity-60 disabled:cursor-not-allowed"
              placeholder="Tell us what you loved about shopping with us..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Send Feedback"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PlatformFeedbackModal;