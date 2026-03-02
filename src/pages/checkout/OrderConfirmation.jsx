import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, Copy, Volume2, VolumeX, RotateCcw, MapPin, Sparkles, ChevronDown, ChevronUp, Truck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;

    const [showConfetti, setShowConfetti] = useState(true);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!orderData) {
            navigate("/", { replace: true });
        }
    }, [orderData, navigate]);

    // --- Data Parsing ---
    const orderId = orderData?.orderId || "N/A";
    const invoiceNo = orderData?.invoiceNumber || "INV-PENDING";
    const totalAmount = orderData?.finalPayableAmount || "0";
    const orderDateRaw = orderData?.orderDate || new Date().toISOString();

    const shipping = orderData?.shippingAddress || {};
    const addressDetails = shipping?.address || {};
    const recipientName = shipping?.addresseeName || "Valued Customer";
    const recipientPhone = shipping?.addresseePhoneNumber || "";

    const street = addressDetails.STREET_ADDRESS || "";
    const cityState = [addressDetails.CITY, addressDetails.STATE].filter(Boolean).join(", ");
    const zipCountry = [addressDetails.PIN_CODE, addressDetails.COUNTRY].filter(Boolean).join(", ");

    // --- Formatters ---
    const formattedDate = new Date(orderDateRaw).toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric",
    });

    const deliveryDate = new Date(orderDateRaw);
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
        weekday: 'short', month: 'short', day: 'numeric'
    });

    const VIDEO_URL = "https://res.cloudinary.com/dwdu18hzs/video/upload/v1764053959/Thank_you_message_btnsq3.mp4";

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 8000);
        return () => clearTimeout(timer);
    }, []);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    };

    const handleReplay = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsVideoEnded(false);
        }
    };

    return (
        <div className="bg-[#F2F4F7] flex items-center justify-center p-3 md:p-6 font-sans text-slate-900">


            {/* Main Container - Compact Layout */}
            <div className="w-full max-w-5xl grid grid-cols-1 gap-4 animate-in fade-in zoom-in duration-500">

                <div className="lg:col-span-8 space-y-4">

                    <Card className="border-0 shadow-lg rounded-2xl bg-[#0F172A] overflow-hidden relative text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="p-5 md:p-6 relative z-10">
                            {/* Top Row: Price vs Tag */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Paid</p>
                                    <div className="flex items-start gap-0.5">
                                        <span className="text-xl text-emerald-400 font-light mt-1">₹</span>
                                        <span className="text-5xl font-serif tracking-tight text-white">{totalAmount}</span>
                                    </div>
                                </div>

                                {/* RED TAG - Compact & Positioned Top Right */}
                                <div className="relative transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="w-16 h-20 bg-red-600 rounded-md shadow-lg border border-white/10 flex flex-col items-center justify-center relative">
                                        <div className="w-2.5 h-2.5 bg-[#0F172A] rounded-full absolute top-2 shadow-inner"></div>
                                        <p className="font-handwriting text-white text-center text-[10px] leading-tight mt-2 font-bold drop-shadow-sm">
                                            Thank<br />You<br />For<br />Order!
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Message */}
                            <div>
                                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Order Successful</span>
                                </div>
                                <h1 className="text-xl md:text-2xl font-serif leading-snug text-slate-100 max-w-md">
                                    Congratulations on being our new Parent, <span className="italic text-emerald-400">{recipientName.split(' ')[0]}</span>
                                </h1>
                            </div>
                        </div>
                    </Card>
            
                    <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden p-5">
                        <div className="flex flex-col md:flex-row gap-5">

                            {/* Compact Video */}
                            {/* <div className="w-full md:w-5/12 shrink-0">
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner bg-black group">
                             <div className="absolute top-2 right-2 z-20 flex gap-1.5">
                                {isVideoEnded && (
                                    <button onClick={handleReplay} className="bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white">
                                        <RotateCcw className="w-3 h-3" />
                                    </button>
                                )}
                                <button onClick={() => setIsMuted(!isMuted)} className="bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white">
                                    {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                </button>
                            </div>
                            <video 
                                ref={videoRef}
                                className="w-full h-full object-cover object-[center_35%]"
                                autoPlay muted={isMuted} playsInline
                                src={VIDEO_URL}
                                onEnded={() => setIsVideoEnded(true)}
                            />
                        </div>
                    </div> */}

                            {/* Tight Data Grid */}
                            <div className="w-full space-y-4">
                                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 grid grid-cols-2 gap-y-4 gap-x-2">
                                    <div className="col-span-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order No.</p>
                                        <div className="flex items-center gap-2" onClick={() => copyToClipboard(orderId, "Order ID")}>
                                            <span className="font-mono text-sm font-bold text-slate-900 truncate">{orderId}</span>
                                            <Copy className="w-3 h-3 text-slate-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                                        <p className="text-xs font-semibold text-slate-800">{formattedDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Invoice</p>
                                        <p className="text-xs font-semibold text-slate-800 truncate" title={invoiceNo}>{invoiceNo}</p>
                                    </div>
                                </div>

                                <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase text-slate-600 hover:text-white hover:bg-slate-800 transition-all border border-slate-200 px-3 py-3 rounded-lg">
                                    <Printer className="w-3.5 h-3.5" /> Download Receipt
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 pt-5 border-t border-slate-100 flex gap-3 items-start">
                            <MapPin className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                            <div className="text-xs text-slate-600 leading-relaxed">
                                <span className="font-bold text-slate-900 block mb-0.5">Shipping to {recipientName}</span>
                                {street}, {cityState}, {zipCountry}
                            </div>
                        </div>
                    </Card>
                    
                    <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">

                        {/* 3. EXPANDABLE TRACKING HEADER */}
                        <div
                            onClick={() => setIsTrackingOpen(!isTrackingOpen)}
                            className="p-5 cursor-pointer hover:bg-slate-50 transition-colors flex justify-between items-center group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
                                    <p className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Order Placed</p>
                                </div>
                            </div>
                            {isTrackingOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                        </div>

                        {/* EXPANDABLE CONTENT */}
                        <div className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${isTrackingOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                            <div className="p-5 pt-0 bg-slate-50/50">
                                <div className="relative border-l-2 border-slate-200 ml-4 pl-6 py-4 space-y-8">
                                    {/* Step 1 */}
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm"></div>
                                        <p className="text-xs font-bold text-slate-900">Order Confirmed</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{formattedDate}</p>
                                    </div>
                                    {/* Step 2 */}
                                    <div className="relative opacity-50">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                                        <p className="text-xs font-bold text-slate-900">Shipped</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">Estimated soon</p>
                                    </div>
                                    {/* Step 3 */}
                                    <div className="relative opacity-50">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white"></div>
                                        <p className="text-xs font-bold text-slate-900">Out for Delivery</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{formattedDelivery}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Static Progress Bar (Shown when collapsed) */}
                        {!isTrackingOpen && (
                            <div className="px-5 pb-5">
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                                    <div className="w-[15%] h-full bg-emerald-500 rounded-full"></div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2 text-center">Tap to view detailed timeline</p>
                            </div>
                        )}

                        {/* UPDATED ACTIONS SECTION */}
                        <div className="p-5 border-t border-slate-100 bg-white">
                            <Button
                                onClick={() => navigate("/")}
                                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
}