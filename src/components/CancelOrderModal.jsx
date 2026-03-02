import React, { useState } from 'react';
import { X, AlertTriangle, MessageSquare, Loader2 } from "lucide-react";
import { cancellationReasons } from '../constants/Order';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderId, isLoading }) => {
    const [reason, setReason] = useState("");
    const [otherReason, setOtherReason] = useState(""); // New state for custom reason
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    // Prevent closing modal if process is under way
    const handleBackdropClick = () => {
        if (!isLoading) onClose();
    };

    const isFormValid = reason && (reason !== "Other" || otherReason.trim().length > 0);

    const handleConfirm = () => {
        const finalReason = reason === "Other" ? otherReason : reason;
        onConfirm({ reason: finalReason, comment });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={handleBackdropClick}
            />
            
            {/* Modal Container */}
            <div className={`relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200 ${isLoading ? 'scale-[0.98]' : 'scale-100'}`}>

                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex flex-col items-center justify-center gap-3">
                        <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
                            <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                            <span className="font-bold text-gray-800 tracking-tight">Processing Cancellation...</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-red-50 px-6 py-6 flex items-center gap-4 border-b border-red-100">
                    <div className="bg-red-100 p-3 rounded-2xl">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Cancel Order</h3>
                        <p className="text-xs text-red-600 font-mono mt-0.5 font-bold uppercase tracking-wider">
                            Order ID: #{orderId}
                        </p>
                    </div>
                    {!isLoading && (
                        <button 
                            onClick={onClose} 
                            className="p-2 hover:bg-red-200/50 rounded-full transition-colors group"
                        >
                            <X className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                        </button>
                    )}
                </div>

                {/* Form Body */}
                <div className="p-6 md:p-8 space-y-6">

                    {/* Reason Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Why are you cancelling? <span className="text-red-500">*</span>
                        </label>
                        <select 
                            value={reason}
                            disabled={isLoading}
                            onChange={(e) => {
                                setReason(e.target.value);
                                // Reset custom text if they switch away from "Other"
                                if(e.target.value !== "Other") setOtherReason(""); 
                            }}
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-red-500 focus:ring-0 outline-none transition-all text-sm bg-gray-50 font-medium text-gray-800 disabled:opacity-50"
                        >
                            <option value="">Select a reason...</option>
                            {cancellationReasons.map((r) => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                            {!cancellationReasons.includes("Other") && <option value="Other">Other</option>}
                        </select>

                        {reason === "Other" && (
                            <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="relative">
                                    <input
                                        type="text"
                                        maxLength={50}
                                        value={otherReason}
                                        disabled={isLoading}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        placeholder="Please specify specific reason..."
                                        className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-red-500 focus:ring-0 outline-none transition-all text-sm bg-gray-50 font-medium text-gray-800 pr-16"
                                        autoFocus
                                    />
                                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold ${otherReason.length === 50 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {otherReason.length}/50
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            Feedback <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                        </label>
                        <textarea 
                            rows="2"
                            value={comment}
                            disabled={isLoading}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Please share any feedback to help us improve..."
                            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-red-500 focus:ring-0 outline-none transition-all text-sm bg-gray-50 resize-none text-gray-800 disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all disabled:opacity-50 shadow-sm"
                    >
                        Keep Order
                    </button>
                    <button 
                        disabled={!isFormValid || isLoading}
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-3.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                            isFormValid && !isLoading 
                            ? "bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-red-200/60 active:scale-95" 
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Cancelling...</span>
                            </>
                        ) : (
                            <span>Confirm Cancellation</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;