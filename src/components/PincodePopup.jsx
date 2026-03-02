import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Gift,
  Navigation,
  Loader2,
  X,
  ChevronRight
} from "lucide-react";
import { extractPincodeFromCoordinates } from "@/lib/pincodeExtraction";

export default function PincodePopup() {
  const [show, setShow] = useState(false);
  const [pincode, setPincode] = useState("");
  const [hasPincode, setHasPincode] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedPincode = localStorage.getItem("userPincode");
    const dismissedDate = localStorage.getItem("pincode_dismissed_date");
    const today = new Date().toDateString(); 

    if (savedPincode) {
      setHasPincode(true);
      return;
    }

    if (dismissedDate === today) {
      return; 
    }

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.postal) {
          setPincode(data.postal);
          if (data.city) {
            setAreaName(data.city);
          }
          localStorage.setItem("location", JSON.stringify(data));
        }
      })
      .catch(() => console.log("Geolocation failed"));

    const timer = setTimeout(() => {
      setShow(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAutoDetect = useCallback(async () => {
    setIsDetecting(true);
    setDetectionError(false);

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      const detectedPincode = await extractPincodeFromCoordinates(latitude, longitude);
      
      if (detectedPincode && detectedPincode.length === 6) {
        setPincode(detectedPincode);
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          { headers: { 'User-Agent': 'PlantEcommerce-LocationFinder' } }
        );
        const data = await response.json();
        if (data.address) {
          setAreaName(data.address.city || data.address.town || data.address.suburb || "");
        }
      }
    } catch (error) {
      console.error("Auto-detect failed:", error);
      setDetectionError(true);
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setIsValidating(true);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      localStorage.setItem("userPincode", pincode);
      if (areaName) {
        localStorage.setItem("userArea", areaName);
      }
      
      localStorage.removeItem("pincode_dismissed_date");

      setIsValidating(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setHasPincode(true);
        setShow(false);
      }, 1500);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("pincode_dismissed_date", new Date().toDateString());
    setShow(false);
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(value);
    setAreaName("");
  };

  if (hasPincode || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-white w-full max-w-[340px] rounded-3xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {showSuccess ? (
            <div className="p-8 flex flex-col items-center justify-center text-center h-[320px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600"
              >
                <CheckCircle2 className="w-8 h-8" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900">Address Saved!</h3>
              <p className="text-gray-500 mt-2 text-sm">
                Delivery available to <br/>
                <span className="font-semibold text-gray-800">{areaName || pincode}</span>
              </p>
            </div>
          ) : (
            // FORM STATE
            <div className="p-6 pt-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shadow-sm border border-amber-100">
                  <Gift className="w-7 h-7 text-amber-500" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Unlock Delivery Offers</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Enter pincode to check availability & free gifts
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    value={pincode}
                    onChange={handlePincodeChange}
                    placeholder="000 000"
                    className="w-full h-14 bg-gray-50 text-center text-2xl font-bold tracking-widest text-gray-800 rounded-xl border-2 border-gray-100 focus:border-amber-400 focus:bg-white outline-none transition-all placeholder:text-gray-300"
                  />
                  {pincode.length === 6 && !isValidating && (
                     <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                     </div>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={pincode.length !== 6 || isValidating}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    pincode.length === 6
                      ? "bg-gray-900 text-white hover:bg-black shadow-gray-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isValidating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Check Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Or</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleAutoDetect}
                disabled={isDetecting}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                {isDetecting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Navigation className="w-3 h-3" />
                )}
                <span>Use My Current Location</span>
              </button>

              {detectionError && (
                <p className="text-xs text-red-500 text-center mt-2">
                  Location detection failed. Please enter manually.
                </p>
              )}
              
              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <Truck className="w-3 h-3" />
                <span>Fast delivery directly to your farm/home</span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}