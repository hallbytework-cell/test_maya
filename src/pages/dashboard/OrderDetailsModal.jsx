import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, CreditCard, Loader2, Package, AlertCircle, RefreshCw, Tag, Truck, CreditCard as PaymentIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomerOrderById, retryOrderPayment, convertCodToOnlinePayment } from '@/api/customer/orders';
import { toast } from "react-hot-toast"

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const formatAddress = (addrObj) => {
    if (!addrObj) return 'Address not available';
    const parts = [
        addrObj.STREET_ADDRESS,
        addrObj.LANDMARK ? `Near ${addrObj.LANDMARK}` : null,
        addrObj.CITY,
        `${addrObj.STATE} - ${addrObj.PIN_CODE}`,
        addrObj.COUNTRY
    ];
    return parts.filter(Boolean).join(', ');
};

const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
        case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
        case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
        case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

const getPaymentStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
        case 'PAID':
        case 'SUCCESS': return 'text-green-600 bg-green-50 border-green-200';
        case 'FAILED': return 'text-red-600 bg-red-50 border-red-200';
        case 'REFUNDED': return 'text-blue-600 bg-blue-50 border-blue-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
};

export function OrderDetailsModal({ order: initialOrder, onClose }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    const orderIdToFetch = initialOrder?.id || initialOrder?.orderId;

    const { data: responseData, isLoading, isError } = useQuery({
        queryKey: ['order', orderIdToFetch],
        queryFn: () => getCustomerOrderById(orderIdToFetch),
        enabled: !!orderIdToFetch,
        gcTime: 0,
        staleTime: 0
    });

    const orderDetails = responseData?.data;
    const items = orderDetails?.items || [];
    const currentItem = items[currentItemIndex];

    const handlePaymentPopup = async (paymentData) => {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) return toast.error("Razorpay SDK failed to load.");
        const options = {
            key: paymentData.key,
            amount: paymentData.amount,
            currency: paymentData.currency,
            name: "Maya Vriksh",
            description: `Order #${orderDetails?.meta.orderId}`,
            order_id: paymentData.razorpayOrderId,
            handler: (response) => {
                toast.success("Payment successful!");
                queryClient.invalidateQueries(['order', orderIdToFetch]);
            },
            prefill: { name: orderDetails?.addresses.shipping.name, contact: orderDetails?.addresses.shipping.phone },
            theme: { color: "#065f46" }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const retryPayment = useMutation({
        mutationFn: () => retryOrderPayment(orderIdToFetch),
        onSuccess: (res) => handlePaymentPopup(res.data),
        onError: () => toast.error("Failed to initiate retry.")
    });

    const convertToOnline = useMutation({
        mutationFn: () => convertCodToOnlinePayment(orderIdToFetch),
        onSuccess: (res) => handlePaymentPopup(res.data),
        onError: () => toast.error("Conversion failed.")
    });

    const hasFailedPayment = orderDetails?.payments?.some(p => p.status === 'FAILED');
    const isCodOrder = orderDetails?.payments?.some(p => p.method === 'COD');
    const isPending = orderDetails?.meta.status === 'PENDING';
    const isNotDelivered = orderDetails?.meta.status !== 'DELIVERED' && orderDetails?.meta.status !== 'CANCELLED';

    const handlePrevItem = () => {
        setCurrentItemIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    const handleNextItem = () => {
        setCurrentItemIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    const handleItemClick = (item) => {
        if (!item) return;
        const slug = item.title ? item.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'product';
        let url = `/product/${slug}/${item.plantVariantId}${item.pot?.potVariantId ? `?potId=${item.pot.potVariantId}` : ''}`;
        onClose();
        navigate(url);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="sticky top-0 bg-gradient-to-r from-green-700 to-emerald-800 text-white p-6 flex justify-between items-start z-20 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                            Order Details
                        </h2>
                        <p className="text-green-100 text-sm mt-1 font-mono">
                            {orderDetails ? `#${orderDetails.meta.orderId}` : 'Loading...'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition cursor-pointer text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6 flex-grow">
                    {isLoading ? (
                        <div className="animate-pulse space-y-6">
                            <div className="h-6 w-32 bg-gray-200 rounded">
                            </div><div className="bg-gray-100 h-64 rounded-xl"></div></div>
                    ) : isError || !orderDetails ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <Package className="w-16 h-16 mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Failed to load order details.</p>
                            <button onClick={onClose} className="mt-4 text-green-700 font-bold hover:underline">
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            {hasFailedPayment && isPending && (
                                <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-xl text-red-800 text-sm">
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    <p>Payment failed. Please retry to avoid order cancellation.</p>
                                </div>
                            )}

                            {isCodOrder && isNotDelivered && (
                                <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm">
                                    <PaymentIcon className="w-5 h-5 shrink-0" />
                                    <p>Want to go cashless? Switch this COD order to online payment now.</p>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-200">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span>Placed on: </span>
                                <span className="font-semibold text-gray-900">
                                    {new Date(orderDetails.meta.placedAt).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            {items.length > 0 ? (
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-100 relative">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Purchased Items</h3>
                                        <span className="text-sm text-gray-500 font-medium bg-white px-2 py-1 rounded shadow-sm">
                                            {currentItemIndex + 1} / {items.length}
                                        </span>
                                    </div>
                                    <div className="relative flex items-center gap-4">
                                        <button
                                            onClick={handlePrevItem}
                                            disabled={items.length <= 1}
                                            className={`absolute -left-3 z-10 p-2 bg-white rounded-full shadow-md transition ${items.length <= 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-50 hover:scale-110 cursor-pointer'}`}
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                                        </button>
                                        <div className="flex-1 bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
                                            <div
                                                className="w-full sm:w-40 h-40 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative cursor-pointer group"
                                                onClick={() => handleItemClick(currentItem)}>
                                                <img
                                                    src={currentItem.image}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                    onError={(e) => { e.target.src = "https://via.placeholder.com/200?text=No+Image"; }}
                                                />
                                                <span className="absolute bottom-0 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded-tl-lg font-bold z-10">x{currentItem.quantity}</span>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h4
                                                    className="text-xl font-bold text-gray-900 mb-1 cursor-pointer hover:text-green-700 transition-colors"
                                                    onClick={() => handleItemClick(currentItem)}
                                                >
                                                    {currentItem.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 mb-4">{currentItem.subtitle}</p>
                                                <div className="space-y-2"><div className="flex justify-between text-sm border-b border-gray-50 pb-2"><span className="text-gray-500">Unit Price</span><span className="font-medium text-gray-900">{formatCurrency(currentItem.pricing.unitPrice)}</span></div>
                                                    {currentItem.pot &&
                                                        <div className="flex justify-between text-sm bg-orange-50 p-2 rounded text-orange-800">
                                                            <span className="text-xs font-bold uppercase">Pot Included</span>
                                                            <span className="font-medium">{currentItem.pot.title} ({currentItem.pot.color})</span>
                                                        </div>}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleNextItem}
                                            disabled={items.length <= 1}
                                            className={`absolute -right-3 z-10 p-2 bg-white rounded-full shadow-md transition ${items.length <= 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-gray-50 hover:scale-110 cursor-pointer'}`}
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-700" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-lg">
                                    No items found.
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Payment Breakdown
                                    </h3>
                                    <div className="space-y-3 mb-4">
                                        {orderDetails.payments.map((pay, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-2 rounded-lg border border-dashed border-gray-200 bg-gray-50/30">
                                                <div className="text-xs">
                                                    <p className="font-bold text-gray-700 uppercase">{pay.method.replace('_', ' ')}</p>
                                                    <p className="text-gray-400 font-mono text-[10px] truncate w-24 sm:w-32">{pay.transactionId || '---'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900">{formatCurrency(pay.amount)}</p>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold border inline-block mt-0.5 ${getPaymentStatusStyle(pay.status)}`}>
                                                        {pay.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span>{formatCurrency(orderDetails.pricing.subtotal)}</span>
                                        </div>
                                        
                                        {orderDetails.pricing.discount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount</span>
                                                <span>-{formatCurrency(orderDetails.pricing.discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                                            <span className={orderDetails.pricing.shipping === 0 ? "text-green-600 font-medium" : ""}>
                                                {orderDetails.pricing.shipping === 0 ? "Free" : formatCurrency(orderDetails.pricing.shipping)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100 mt-2">
                                            <span>Total Paid</span>
                                            <span className="text-green-700">{formatCurrency(orderDetails.pricing.total)}</span>
                                        </div>
                                    </div>
                                    <div className={`mt-4 w-full px-3 py-2 rounded-lg border text-[10px] font-black text-center uppercase tracking-widest ${getStatusColor(orderDetails.meta.status)}`}>
                                        {orderDetails.meta.status}
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
                                    <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Shipping To
                                    </h4>
                                    <p className="font-semibold text-gray-800 mb-1">
                                        {orderDetails.addresses.shipping.name}
                                    </p>
                                    <p className="text-xs text-blue-600 font-mono mb-2">
                                        +91 {orderDetails.addresses.shipping.phone}
                                    </p>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                        {formatAddress(orderDetails.addresses.shipping.address)}
                                    </p>
                                    <p className="mt-2 text-xs text-blue-400 font-semibold bg-white w-fit px-2 py-0.5 rounded border border-blue-100">
                                        {orderDetails.addresses.shipping.type}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-gray-50 p-6 border-t flex gap-3 shrink-0 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm cursor-pointer"
                        data-testid="button-close-details"
                    >
                        Close
                    </button>
                    {hasFailedPayment && isPending ? (
                        <button
                            className="flex-[2] px-4 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                            onClick={() => retryPayment.mutate()}
                            disabled={retryPayment.isPending}
                        >
                            {retryPayment.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RefreshCw className="w-5 h-5" /> Retry Payment</>}
                        </button>
                    ) : isCodOrder && isNotDelivered ? (
                        <button
                            className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                            onClick={() => convertToOnline.mutate()}
                            disabled={convertToOnline.isPending}
                        >
                            {convertToOnline.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><PaymentIcon className="w-5 h-5" /> Pay Online Now</>}
                        </button>
                    ) : (
                        <button
                            className={`flex-[2] px-4 py-3 bg-green-700 text-white rounded-xl font-medium transition shadow-sm shadow-green-200 flex items-center justify-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-800 cursor-pointer'}`}
                            data-testid="button-track"
                            onClick={() => navigate("../track-order")}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track Order"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}