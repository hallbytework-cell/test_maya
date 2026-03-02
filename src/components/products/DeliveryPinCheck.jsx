import { useState } from "react";
import { CheckCircle2, MapPin, Loader2, Truck, Navigation } from "lucide-react";
import { extractPincodeFromCoordinates } from "@/lib/pincodeExtraction";

export default function DeliveryPinCheck() {
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const handleCheck = () => {
    if (!pincode.trim()) {
      setError("Please enter a PIN code");
      return;
    }
    if (pincode.length !== 6) {
      setError("PIN code must be 6 digits");
      return;
    }

    setError("");
    setIsChecking(true);
    setTimeout(() => {
      const date = new Date();
      date.setDate(date.getDate() + 5);
      const options = {
        day: "numeric",
        month: "short",
        weekday: "long"
      };
      const estimateDate = date.toLocaleDateString("en-GB", options);

      setIsChecking(false);
      setDeliveryInfo({
        date: estimateDate,
        pincode: pincode
      });
    }, 1500);
  };

  const handleClear = () => {
    setDeliveryInfo(null);
    setPincode("");
    setError("");
  };

  const handleRequestLocation = async () => {
    setIsRequestingLocation(true);
    setError("");

    try {
      // Request browser location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      // Extract pincode from coordinates
      try {
        const extractedPincode = await extractPincodeFromCoordinates(latitude, longitude);
        setPincode(extractedPincode);
        console.log('✅ Pincode populated:', extractedPincode);
      } catch (pinError) {
        console.warn('⚠️ Could not extract pincode:', pinError.message);
        setError('Could not extract pincode. Please enter manually.');
      }
    } catch (locError) {
      setError('Could not get your location. Please enter pincode manually.');
    } finally {
      setIsRequestingLocation(false);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-4 transition-all duration-300 hover:border-slate-300 group">

      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-100 group-hover:border-indigo-100 transition-colors">
          <Truck className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Estimated Delivery</h3>
      </div>

      {/* Input State */}
      {!deliveryInfo ? (
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  setError("");
                }}
                className="w-full pl-9 pr-3 py-2.5 text-sm font-medium text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                disabled={isChecking || isRequestingLocation}
              />
            </div>

            {/* Location Button */}
            {/* <button
              onClick={handleRequestLocation}
              disabled={isChecking || isRequestingLocation}
              title="Use my current location"
              className="p-2.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer disabled:border-slate-200 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 flex justify-center items-center"
              data-testid="button-use-location"
            >
              {isRequestingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button> */}

            {/* Check Button */}
            <button
              onClick={handleCheck}
              disabled={isChecking || pincode.length !== 6 || isRequestingLocation}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 min-w-[80px] flex justify-center items-center"
              data-testid="button-check-pin"
            >
              {isChecking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Check"
              )}
            </button>
          </div>

          {/* Error or Helper text */}
          {error ? (
            <p className="text-[11px] text-red-500 mt-2 ml-1 font-medium animate-in slide-in-from-top-1">
              {error}
            </p>
          ) : (
            <p className="text-[11px] text-slate-500 mt-2 ml-1">
              Enter your pincode to check availability.
            </p>
          )}
        </div>
      ) : (
        /* Success State */
        <div className="bg-white border border-emerald-100 rounded-lg p-3.5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                  Delivery by {deliveryInfo.date}
                  {/* <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase tracking-wider">Free</span> */}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Delivering to <span className="font-mono font-medium text-slate-700">{deliveryInfo.pincode}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
            >
              Change
            </button>
          </div>
        </div>
      )}
    </div>
  );
}