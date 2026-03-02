import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, X, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const StepIndicator = ({ currentStep, totalSteps, stepNames }) => (
    <div className="hidden md:flex items-center space-x-2 text-sm">
        {stepNames.map((name, index) => (
            <React.Fragment key={index}>
                <div className={`flex items-center ${index + 1 <= currentStep ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                    <CheckCircle className={`w-4 h-4 mr-1 ${index + 1 > currentStep ? 'opacity-50' : ''}`} />
                    <span className="hidden lg:inline">{name}</span>
                    <span className="lg:hidden">{index + 1}</span>
                </div>
                {index < totalSteps - 1 && (
                    <div className="w-10 h-0.5 bg-gray-200 mx-1">
                        <div 
                            className={`h-full transition-all duration-500 ${index + 1 < currentStep ? 'bg-green-600' : 'bg-transparent'}`} 
                            style={{ width: index + 1 === currentStep ? '50%' : '100%' }}
                        ></div>
                    </div>
                )}
            </React.Fragment>
        ))}
    </div>
);

export default function CheckoutLayout({ currentStep = 1, children }) {
    const totalSteps = 4;
    const stepNames = ["Login", "Address", "Order Summary", "Payment"];
    const navigate = useNavigate();
    const location = useLocation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({
        title: "",
        message: "",
        confirmText: ""
    });

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    const handleConfirmExit = () => {
        setIsModalOpen(false);
        if (location.key === "default" || location.pathname === "/order-confirm") {
            navigate('../');
        } else {
            navigate(-1);
        }
    };

    const triggerBackConfirm = () => {
        setModalContent({
            title: "Wait! Don't lose your spot",
            message: "Going back may clear some of the information you've already entered. Are you sure you want to return to the previous page?",
            confirmText: "Yes, Go Back"
        });
        setIsModalOpen(true);
    };

    const triggerExitConfirm = () => {
        setModalContent({
            title: "Leave Checkout?",
            message: "Don't worry, your items will stay in your cart! However, you'll need to restart the checkout process when you return.",
            confirmText: "Yes, Exit"
        });
        setIsModalOpen(true);
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            <header className="fixed top-0 left-0 w-full shadow-sm z-40 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={triggerBackConfirm}
                                className="p-2 rounded-full text-gray-400 hover:text-green-700 hover:bg-green-50 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold text-green-700 tracking-tight">Checkout</h1>
                        </div>

                        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} stepNames={stepNames} />

                        <div className="flex items-center">
                            <button
                                onClick={triggerExitConfirm}
                                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                                <X className="h-5 w-5 md:h-6 md:w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- REUSABLE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)} 
                    />
                    
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 md:p-8 transform transition-all scale-100">
                        <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 bg-green-50 rounded-full">
                            <ShoppingCart className="w-7 h-7 text-green-600" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-center text-gray-900">
                            {modalContent.title}
                        </h3>
                        <p className="mt-3 text-sm md:text-base text-center text-gray-500 leading-relaxed">
                            {modalContent.message}
                        </p>

                        <div className="flex flex-col gap-3 mt-8">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="w-full px-4 py-3 text-sm font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
                            >
                                Continue Checkout
                            </button>
                            <button
                                onClick={handleConfirmExit}
                                className="w-full px-4 py-3 text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors"
                            >
                                {modalContent.confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="pt-16 md:pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}