import React, { useState } from 'react'
import ModalLayout from './ModalLayout'
import { ArrowRight, Check, Copy, Gift, Star, Zap } from 'lucide-react';

export default function NewUserOfferModal() {
    const [isOpen, setIsOpen] = useState(true);
    const [copied, setCopied] = useState(false);

    function closeModal(){
        setIsOpen(prev=>!prev)
    }

    return (
        <ModalLayout isOpen={isOpen} onClose={closeModal}>
            {/* Soft Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-60 translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-1/4 left-1/4 animate-bounce opacity-20" style={{ animationDuration: '4s' }}>
                    <Star className="text-emerald-500 w-4 h-4 fill-emerald-500" />
                </div>
            </div>

            <div className="relative z-10 p-8 sm:p-10 flex flex-col items-center">
                {/* Badge */}
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full mb-6 border border-emerald-100">
                    <Gift size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Welcome Reward</span>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-stone-900 tracking-tight leading-none mb-3">
                        HELLO <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-500">BEAUTIFUL</span>
                    </h2>
                    <p className="text-stone-500 text-sm font-medium leading-relaxed max-w-[260px] mx-auto">
                        Start your sustainable journey with a special gift on your first purchase.
                    </p>
                </div>

                {/* Main Offer Card */}
                <div className="w-full relative group mb-8">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[2rem] blur opacity-20 transition duration-1000 group-hover:opacity-40" />
                    <div className="relative bg-white border border-stone-100 rounded-[1.5rem] p-5 shadow-sm overflow-hidden">
                        {/* Diagonal Shine Effect */}
                        <div className="absolute -left-[100%] top-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-[35deg] transition-all duration-700 group-hover:left-[100%]" />

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-1">First Order</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-stone-900 tracking-tighter">20</span>
                                    <span className="text-2xl font-black text-emerald-600">%</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="bg-amber-400 p-2 rounded-xl rotate-12 group-hover:rotate-0 transition-transform">
                                    <Zap className="text-white fill-white w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-amber-500 uppercase mt-2">Extra Gift</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Area */}
                <div className="w-full space-y-4">
                    <div className="relative group/copy">
                        <button
                            onClick={() => { }}
                            className="flex items-center justify-between w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl transition-all hover:bg-stone-100 active:scale-[0.98]"
                        >
                            <div className="flex flex-col items-start">
                                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Copy Promo Code</span>
                                <span className="text-xl font-mono font-black text-stone-800 tracking-widest leading-none">WELCOME100</span>
                            </div>
                            <div className={`p-2 rounded-xl transition-all shadow-sm ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-stone-400'}`}>
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </div>
                        </button>
                    </div>

                    <button className="group relative w-full overflow-hidden bg-stone-900 text-white font-bold py-5 rounded-2xl shadow-xl shadow-stone-200 transition-all hover:bg-stone-800 active:scale-[0.98]">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            CLAIM MY WELCOME GIFT
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </button>
                </div>

                <button
                    onClick={closeModal}
                    className="mt-6 text-[10px] font-bold tracking-widest text-stone-400 hover:text-stone-900 transition-colors uppercase"
                >
                    Explore collection first
                </button>
            </div>

            {/* Subtle Decorative Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
        </ModalLayout>
    )
}
