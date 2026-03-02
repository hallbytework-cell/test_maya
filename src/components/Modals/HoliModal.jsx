import React, { useState, useEffect } from 'react' // Added useEffect
import ModalLayout from './ModalLayout'
import { Check, Copy, Sparkles, ShoppingBagIcon } from 'lucide-react';
import { shouldRunByInterval } from '@/utils/seoUtils';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SplashEffect = ({ className, color }) => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path
            fill={color}
            d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C86.9,14.6,81.2,29.1,72.3,41.9C63.4,54.7,51.3,65.8,37.5,72.7C23.7,79.6,8.2,82.3,-7.4,81.2C-23,80.1,-38.7,75.2,-52.1,65.8C-65.5,56.4,-76.7,42.5,-82.4,26.9C-88.1,11.3,-88.3,-6,-83.4,-21.8C-78.5,-37.6,-68.5,-51.9,-55.5,-59.7C-42.5,-67.5,-26.5,-68.9,-11.5,-73.4C3.5,-77.9,18.5,-85.5,33.1,-83.6C47.7,-81.7,44.7,-76.4,44.7,-76.4Z"
            transform="translate(100 100)"
        />
    </svg>
);

export default function HoliModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    const modalInterval = 10;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (shouldRunByInterval("holi", modalInterval)) {
                setIsOpen(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText("HOLI2026");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Promo code copied successfully")
        setIsOpen(false)
    };

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <ModalLayout isOpen={isOpen} onClose={closeModal}>
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <SplashEffect color="#FF0080" className="absolute -top-12 -left-12 w-48 h-48 animate-pulse" />
                <SplashEffect color="#FFD700" className="absolute -bottom-20 -right-20 w-64 h-64 animate-bounce" style={{ animationDuration: '5s' }} />
            </div>

            <div className="relative z-10 p-8 flex flex-col items-center">
                <div className="p-2.5 bg-pink-100 rounded-xl mb-4">
                    <Sparkles className="text-pink-600 w-5 h-5" />
                </div>

                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600 mb-1">Limited Festive Offer</h3>
                <h2 className="text-3xl font-black text-stone-900 mb-2">MAYA <span className="text-pink-600">HOLI</span></h2>
                <p className="text-sm text-stone-500 text-center font-medium mb-6">Grow a splash of color this festive season.</p>

                <div className="w-full bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-center justify-between mb-4">
                    <div className="text-left">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Limited Offer</span>
                        <span className="text-l font-black text-stone-900 italic tracking-tight">SPECIAL DISCOUNT</span>
                    </div>
                    <div className="px-3 py-1 bg-pink-50 text-pink-600 rounded-lg text-xs font-bold animate-pulse">Reveal at Checkout</div>
                </div>

                {/* New Instruction Text */}
                <p className="text-[11px] text-stone-400 font-medium mb-2 text-center">
                    Use this promocode at checkout to avail the special offer
                </p>

                <div className="w-full space-y-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center justify-between w-full px-5 py-3.5 bg-white border-2 border-dashed border-stone-200 rounded-xl group transition-all hover:border-pink-300"
                    >
                        <span className="text-lg font-mono font-black text-stone-800 tracking-wider uppercase">HOLI2026</span>
                        <div className={`p-1.5 rounded-lg transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-stone-100 text-stone-400 group-hover:bg-pink-50 group-hover:text-pink-600'}`}>
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </div>
                    </button>

                    <button
                        className="w-full bg-stone-900 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
                        onClick={() => navigate('/category/plants')}
                    >
                        Shop Festive Sale <ShoppingBagIcon size={18} />
                    </button>
                </div>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400" />
        </ModalLayout>
    )
}