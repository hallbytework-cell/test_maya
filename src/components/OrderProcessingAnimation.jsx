import { useEffect, useState } from "react";
import { CheckCircle2, Leaf, ShoppingCart, Eye, Lock, FileText, Truck, Sparkles, Package } from "lucide-react";

/**
 * OrderProcessingAnimation - Premium UI Redesign
 * Fixes "Double Status" bug by deriving UI from index rather than array state.
 * Uses a Violet/Indigo premium color palette.
 */

const ORDER_MESSAGES = [
  {
    icon: FileText,
    text: "Order request received",
    subtext: "Initiating secure protocol...",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200"
  },
  {
    icon: ShoppingCart,
    text: "Verifying items in cart",
    subtext: "Checking inventory status...",
    color: "text-violet-600",
    bg: "bg-violet-100",
    border: "border-violet-200"
  },
  {
    icon: Eye,
    text: "Checking stock availability",
    subtext: "Reserving your plants...",
    color: "text-fuchsia-600",
    bg: "bg-fuchsia-100",
    border: "border-fuchsia-200"
  },
  {
    icon: Lock,
    text: "Securing your order",
    subtext: "Encrypting payment details...",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    border: "border-indigo-200"
  },
  {
    icon: FileText,
    text: "Preparing invoice",
    subtext: "Generating order summary...",
    color: "text-cyan-600",
    bg: "bg-cyan-100",
    border: "border-cyan-200"
  },
  {
    icon: Truck,
    text: "Setting up delivery",
    subtext: "Connecting with courier...",
    color: "text-orange-600",
    bg: "bg-orange-100",
    border: "border-orange-200"
  },
  {
    icon: Leaf,
    text: "Finalizing your green package",
    subtext: "Almost there...",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    border: "border-emerald-200"
  }
];

export function OrderProcessingAnimation({ isProcessing, onComplete }) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  // We track delay internally to speed up if processing finishes early
  const [delay, setDelay] = useState(1000); 

  useEffect(() => {
    // If backend finishes early, speed up the remaining animations
    // so the user sees a satisfying "completion" rather than a cut-off.
    if (!isProcessing) {
      setDelay(150); // Fast forward
    }
  }, [isProcessing]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        // If we reached the end
        if (prev >= ORDER_MESSAGES.length - 1) {
          if (!isProcessing) {
            clearInterval(interval);
            setTimeout(onComplete, 500); // Small pause at 100% before closing
          }
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => clearInterval(interval);
  }, [isProcessing, onComplete, delay]);

  // Calculate Progress
  const progress = Math.min(
    Math.round(((currentMessageIndex + 1) / ORDER_MESSAGES.length) * 100),
    100
  );

  const activeMessage = ORDER_MESSAGES[currentMessageIndex];
  const ActiveIcon = activeMessage.icon;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
      
      {/* Main Card - Premium Glass/White Look */}
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative border border-white/40">
        
        {/* Decorative Background Blurs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>

        {/* --- HEADER SECTION --- */}
        <div className="relative px-8 pt-10 pb-6 text-center flex flex-col items-center">
          
          {/* Hero Icon with Ripple Effect */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 rounded-full ${activeMessage.bg} animate-ping opacity-30 duration-1000`}></div>
            <div className={`relative w-20 h-20 rounded-full ${activeMessage.bg} flex items-center justify-center shadow-sm transition-colors duration-500 border-4 border-white`}>
              <ActiveIcon 
                className={`w-9 h-9 ${activeMessage.color} transition-all duration-300 scale-100`} 
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Dynamic Title */}
          <div className="space-y-1 mb-8 min-h-[4rem]">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight animate-in slide-in-from-bottom-2 fade-in duration-300 key={currentMessageIndex}">
              {activeMessage.text}
            </h2>
            <p className="text-slate-500 font-medium text-sm animate-pulse">
              {activeMessage.subtext}
            </p>
          </div>

          {/* Sleek Progress Bar */}
          <div className="w-full space-y-2 mb-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Processing</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-600 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* --- LIST SECTION (History) --- */}
        <div className="bg-slate-50/80 border-t border-slate-100 px-6 py-5 h-[220px] overflow-hidden relative">
            {/* Fade out mask at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10"></div>

            <div className="space-y-3">
              {/* We slice to show history, but map efficiently to avoid duplication */}
              {ORDER_MESSAGES.map((msg, idx) => {
                // Only show current and previous items to keep list clean
                if (idx > currentMessageIndex) return null;
                
                const isCompleted = idx < currentMessageIndex;
                const isActive = idx === currentMessageIndex;
                const MsgIcon = msg.icon;

                // Only show last 3 items so list doesn't scroll infinitely
                if (idx < currentMessageIndex - 2) return null;

                return (
                  <div 
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 animate-in slide-in-from-bottom-4 ${
                      isActive 
                        ? "bg-white shadow-md border-slate-100 scale-100 opacity-100 translate-y-0" 
                        : "bg-transparent border-transparent scale-95 opacity-60 grayscale"
                    }`}
                  >
                    <div className={`p-1.5 rounded-full ${isCompleted ? 'bg-emerald-100 text-emerald-600' : isActive ? msg.bg : 'bg-slate-200 text-slate-400'}`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <MsgIcon className={`w-4 h-4 ${isActive ? msg.color : ''}`} />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
        </div>

      </div>
    </div>
  );
}