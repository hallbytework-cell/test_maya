import React, { useState, Suspense, lazy } from 'react';
import {
    Package as Box,
    ChevronRight,
    Package,
    ChevronLeft,
    Ban,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomerOrders, cancelCustomerOrder } from '@/api/customer/orders';
import { toast } from 'react-hot-toast';
import { OrderDetailsModal } from './OrderDetailsModal'; // Ensure this path is correct

// Lazy-load CancelOrderModal (only shown when user wants to cancel an order)
const CancelOrderModal = lazy(() => import('@/components/CancelOrderModal'));

// --- Utility Functions ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

// --- Skeleton Component ---
const OrderCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md mb-6 border border-gray-100 overflow-hidden animate-pulse">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <div className="h-2 w-16 bg-gray-200 rounded"></div>
                        <div className="h-3 w-24 bg-gray-300 rounded"></div>
                    </div>
                ))}
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6">
                <div className="h-24 w-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-grow space-y-3 mt-1">
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full mt-2"></div>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-48 flex-shrink-0">
                    <div className="h-10 bg-green-100 rounded-lg w-full"></div>
                    <div className="h-9 bg-gray-100 rounded-lg w-full"></div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export default function OrdersPage() {
    // 1. State for Filters & Pagination
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    // 2. State for Modals
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null); // Added State for Details Modal

    const queryClient = useQueryClient();

    // 3. Mutation for Cancellation
    const cancelMutation = useMutation({
        // UPDATE HERE: Accept an object containing ID and payload
        mutationFn: ({ orderId, payload }) => cancelCustomerOrder(orderId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries(['customerOrders']);
            setIsCancelModalOpen(false);
            toast.success("Order cancelled successfully!");
        },
        onError: (err) => {
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.errorDetails?.message ||
                "An unexpected error occurred";
            console.error("Operation Error: ", errorMessage);
            toast.error(errorMessage);
        }
    });

    // 4. Query for Fetching Orders
    const queryParams = {
        page: page,
        limit: limit,
        ...(selectedStatus !== "All" && { status: selectedStatus }),
        sortBy: 'orderDate',
        sortOrder: 'desc'
    };

    const {
        data: orderData = { orders: [], pagination: { page: 1, limit: 10, total: 0 } },
        isFetching
    } = useQuery({
        queryKey: ['customerOrders', queryParams],
        queryFn: async () => {
            try {
                const resp = await getCustomerOrders(queryParams);
                return resp.data;
            } catch (err) {
                console.error("API failed:", err);
                return { orders: [], pagination: {} };
            }
        },
        placeholderData: (previousData) => previousData,
        gcTime: 0,
        staleTime: 0
    });

    const orders = orderData.orders || [];
    const paginationRaw = orderData.pagination || { page: 1, limit: 10, total: 0 };
    const totalPages = Math.max(1, Math.ceil(paginationRaw.total / paginationRaw.limit));

    // 5. Handlers
    const handleOpenCancelModal = (order) => {
        setOrderToCancel(order);
        setIsCancelModalOpen(true);
    };


    
    // UPDATE HERE: Accept the data passed from the Modal
    const handleConfirmCancel = ({ reason, comment }) => {
        if (orderToCancel) {
            cancelMutation.mutate({
                orderId: orderToCancel.id, // Ensure you use the correct ID field
                payload: {
                    cancellationReason: reason,
                    cancellationFeedback: comment || "" // Map 'comment' to 'cancellationFeedback'
                }
            });
        }
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const availableStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Order History</h2>

                {/* Filter Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border border-green-100 shadow-sm">
                    <p className="text-xs md:text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Filter by Status</p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        <button
                            onClick={() => handleStatusChange("All")}
                            className={`px-4 md:px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${selectedStatus === "All"
                                ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg scale-105"
                                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:text-green-600"
                                }`}
                        >
                            <span>All Orders</span>
                        </button>

                        {availableStatuses.map((status) => {
                            const statusColors = {
                                DELIVERED: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300", activeBg: "from-green-600 to-green-700" },
                                SHIPPED: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300", activeBg: "from-blue-600 to-blue-700" },
                                PENDING: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300", activeBg: "from-amber-600 to-amber-700" },
                                CANCELLED: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300", activeBg: "from-red-600 to-red-700" },
                            };
                            const colors = statusColors[status] || statusColors.PENDING;

                            return (
                                <button
                                    key={status}
                                    onClick={() => handleStatusChange(status)}
                                    className={`px-4 md:px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-2 border-2 cursor-pointer ${selectedStatus === status
                                        ? `bg-gradient-to-r ${colors.activeBg} text-white shadow-lg scale-105 border-transparent`
                                        : `${colors.bg} ${colors.text} border-2 ${colors.border} hover:scale-105`
                                        }`}
                                >
                                    <span>{status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {isFetching ? (
                <div>{[1, 2, 3].map((n) => <OrderCardSkeleton key={n} />)}</div>
            ) : orders.length > 0 ? (
                <>
                    <div className="space-y-6">
                        {/* Lazy-load CancelOrderModal (only rendered when user wants to cancel) */}
                        <Suspense fallback={null}>
                            {orderToCancel && (
                                <CancelOrderModal
                                    isOpen={isCancelModalOpen}
                                    onClose={() => setIsCancelModalOpen(false)}
                                    onConfirm={handleConfirmCancel}
                                    orderId={orderToCancel.orderId}
                                    isLoading={cancelMutation.isPending}
                                />
                            )}
                        </Suspense>
                        
                        {/* Order Details Modal Integration */}
                        {selectedOrderForDetails && (
                            <OrderDetailsModal 
                                order={selectedOrderForDetails}
                                onClose={() => setSelectedOrderForDetails(null)}
                            />
                        )}

                        {orders.map((order) => (
                            <OrderCard
                                key={order.orderId}
                                order={order}
                                // Updated to use local state setter
                                onViewDetails={() => setSelectedOrderForDetails(order)}
                                onCancelClick={() => handleOpenCancelModal(order)}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-sm text-gray-500 font-medium order-2 md:order-1">
                                Showing page <span className="text-gray-900 font-bold">{page}</span> of <span className="text-gray-900 font-bold">{totalPages}</span>
                            </span>

                            <div className="flex items-center gap-2 order-1 md:order-2">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className={`p-2 rounded-lg border transition-all ${page === 1
                                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 shadow-sm"
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pNum = i + 1;
                                        if (totalPages > 5) {
                                            if (page > 3) pNum = page - 2 + i;
                                            if (pNum > totalPages) pNum = pNum - (pNum - totalPages);
                                            if (page > totalPages - 2) pNum = totalPages - 4 + i;
                                        }

                                        if (pNum > 0 && pNum <= totalPages) {
                                            return (
                                                <button
                                                    key={pNum}
                                                    onClick={() => handlePageChange(pNum)}
                                                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${page === pNum
                                                        ? "bg-green-600 text-white shadow-md scale-105"
                                                        : "bg-white text-gray-600 hover:bg-green-50"
                                                        }`}
                                                >
                                                    {pNum}
                                                </button>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages}
                                    className={`p-2 rounded-lg border transition-all ${page === totalPages
                                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-green-50 hover:text-green-600 hover:border-green-200 shadow-sm"
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                    <Box className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">
                        No orders found with status: <strong>{selectedStatus}</strong>
                    </p>
                    {selectedStatus !== "All" && (
                        <button onClick={() => handleStatusChange("All")} className="mt-4 text-green-600 font-semibold hover:underline">
                            Clear Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

function OrderCard({ order, onViewDetails, onCancelClick }) {
    const statusColor =
        {
            DELIVERED: "bg-green-100 text-green-700 border-green-200",
            PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
            SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
            CANCELLED: "bg-red-100 text-red-700 border-red-200",
        }[order.orderStatus] || "bg-gray-100 text-gray-700 border-gray-200";

    const allActions = [
        {
            label: "View Details",
            style: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105",
            icon: <Package className="w-4 h-4" />,
            applicable: ["DELIVERED", "PENDING", "SHIPPED", "CANCELLED"],
            onClick: onViewDetails, // Calls the handler passed from parent
            isHighlight: true,
        },
        {
            label: "Cancel Order",
            style: "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
            icon: <Ban className="w-4 h-4" />,
            applicable: ["PENDING"],
            onClick: onCancelClick,
            isHighlight: false,
        }
    ];

    const actions = allActions.filter((action) =>
        action.applicable.includes(order.orderStatus)
    );

    const itemCount = order.items ? order.items.length : 0;
    const itemNames = order.items
        ? order.items.map(i => i.plantName).join(", ")
        : "";
    const displayItemNames = itemNames.length > 50 ? itemNames.substring(0, 50) + "..." : itemNames;

    return (
        <div className="bg-white rounded-2xl shadow-md mb-6 border border-gray-100 overflow-hidden">
            {/* Mobile View */}
            <div className="md:hidden p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-xs text-gray-500 font-mono">#{order.orderId.split('-')[2]}</p>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusColor} border uppercase`}>
                        {order.orderStatus}
                    </span>
                </div>

                <div className="flex items-start gap-4 mb-4">
                    {order.items && order.items[0]?.plantImage ? (
                        <img
                            src={order.items[0].plantImage}
                            alt="Plant"
                            className="h-16 w-16 rounded-lg object-cover bg-gray-100"
                        />
                    ) : (
                        <div className="bg-green-100 text-green-600 flex place-items-center justify-center h-16 w-16 rounded-lg text-xl">
                            <Box />
                        </div>
                    )}

                    <div>
                        <p className="font-semibold text-gray-800">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</p>
                        <p className="text-sm text-gray-500 leading-snug">{displayItemNames}</p>
                        <p className="text-sm font-bold text-green-700 mt-1">{formatCurrency(order.orderAmount)}</p>
                    </div>
                </div>

                <div className="space-y-3 mt-4">
                    {actions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => action.onClick(order)}
                            className={`w-full px-4 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${action.style}`}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                            {action.label === "View Details" && <ChevronRight className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="grid grid-cols-4 gap-8 w-full">
                        <div className="flex flex-col">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Placed</p>
                            <p className="font-medium text-gray-700 text-sm">{formatDate(order.orderDate)}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
                            <p className="font-bold text-green-600 text-sm">{formatCurrency(order?.finalPayableAmount)}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ship To</p>
                            <div className="group relative">
                                <p className="font-medium text-blue-600 text-sm cursor-pointer underline decoration-dotted">
                                    {order.addresseeName}
                                </p>
                                <div className="absolute hidden group-hover:block z-10 w-48 p-2 mt-1 text-xs text-white bg-gray-800 rounded shadow-lg -left-2">
                                    {order.shippingAddress?.STREET_ADDRESS}, {order.shippingAddress?.CITY}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</p>
                            <p className="font-mono text-gray-600 text-sm">#{order.orderId}</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-5">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-5">
                            {order.items && order.items[0]?.plantImage ? (
                                <img
                                    src={order.items[0].plantImage}
                                    alt="Product"
                                    className="h-24 w-24 rounded-lg object-cover border border-gray-100 shadow-sm"
                                />
                            ) : (
                                <div className="bg-green-50 text-green-500 flex place-items-center justify-center h-24 w-24 rounded-lg text-3xl border border-green-100">
                                    <Box />
                                </div>
                            )}

                            <div className="mt-1">
                                <h4 className="font-bold text-lg text-gray-800 mb-1">
                                    {order.orderStatus === "DELIVERED" ? "Delivered" : "Arriving Soon"}
                                </h4>
                                <p className="text-gray-600 text-sm mb-2 max-w-md">
                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}: <span className="text-gray-500">{displayItemNames}</span>
                                </p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} uppercase tracking-wide`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[180px]">
                            {actions.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => action.onClick(order)}
                                    className={`w-full px-4 py-2.5 flex items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${action.isHighlight
                                        ? "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                                        : action.style
                                        }`}
                                >
                                    {action.icon}
                                    <span>{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}