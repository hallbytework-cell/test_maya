import { useState } from "react";
import { Search, Package, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, standard in shadcn

export default function TrackingSearchCard({ onTrack }) {
  const [activeTab, setActiveTab] = useState("order_id"); // 'order_id' | 'awb'
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!inputValue.trim()) {
      setError("Please enter a valid number");
      return;
    }

    setIsLoading(true);

    try {
      await onTrack({ type: activeTab, value: inputValue });
    } catch (err) {
      setError("Failed to track order. Please try again." `${err.message || ""}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white border-gray-200 shadow-sm overflow-hidden">
      {/* Custom Tabs Header */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab("order_id"); setError(""); }}
          className={cn(
            "flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all",
            activeTab === "order_id"
              ? "text-emerald-700 bg-emerald-50/50 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          )}
        >
          <Package className="w-4 h-4" />
          Order ID
        </button>
        <button
          onClick={() => { setActiveTab("awb"); setError(""); }}
          className={cn(
            "flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-all",
            activeTab === "awb"
              ? "text-emerald-700 bg-emerald-50/50 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          )}
        >
          <FileText className="w-4 h-4" />
          AWB Number
        </button>
      </div>

      {/* Input Section */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {activeTab === "order_id" ? "Enter Order ID" : "Enter AWB Number"}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder={activeTab === "order_id" ? "e.g. 999012" : "e.g. DEL123456789"}
                // --- THIS IS THE FIX ---
                // Increased padding from pl-11 to pl-14 to create a large gap
                className="relative left-3 pl-14 h-12 border-gray-200 focus-visible:ring-emerald-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-red-500 animate-pulse">{error}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Tracking...
              </>
            ) : (
              "Track Order"
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}