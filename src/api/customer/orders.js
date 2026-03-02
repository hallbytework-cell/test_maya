import axiosInstance from "../../config/axiosConfig";

/**
 * @typedef {object} Order
 * @property {string} id
 * @property {string} orderDate
 * @property {number} totalAmount
 * @property {string} status
 * @property {any[]} items
 */

/**
 * @typedef {object} PaginatedOrdersResponse
 * @property {Order[]} data
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 */

/**
 * @typedef {object} CreateOrderPayload
 * @property {string} billingAddressId
 * @property {string} shippingAddressId
 * @property {boolean} shippingSameAsBilling
 * @property {string} [promoCodeId]
 * @property {string[]} cartItemIds
 * @property {number} [useLoyaltyPoints]
 * @property {"COD" | "ONLINE"} paymentMethod
 * @property {string} [occasion]
 * @property {string} [giftMessage]
 * @property {string} [specialInstructions]
 */

/**
 * @typedef {object} UpdateOrderStatusPayload
 * @property {"PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED"} status
 */

/**
 * @typedef {object} VerifyPaymentPayload
 * @property {string} paymentId
 * @property {"SUCCESS" | "FAILURE"} paymentStatus
 */


/**
 * Fetches a paginated list of all orders for the logged-in customer.
 * @param {number} [page=1] - The page number to fetch.
 * @param {number} [limit=10] - The number of orders to return per page.
 * @returns {Promise<PaginatedOrdersResponse>} A promise that resolves to the paginated list of orders.
 */
export const getCustomerOrders = async (params) => {
    const response = await axiosInstance.get("/orders", { params });
    return response.data;
};


/**
 * Creates a new order for the logged-in customer.
 * @param {CreateOrderPayload} orderData - The payload containing all necessary order details.
 * @returns {Promise<Order>} A promise that resolves to the newly created order.
 */
export const createCustomerOrder = async (orderData) => {
    const response = await axiosInstance.post("/orders", orderData);
    return response.data;
};

/**
 * Fetches the details of a specific order by its ID.
 * @param {string} orderId - The unique identifier of the order.
 * @returns {Promise<Order>} A promise that resolves to the detailed order object.
 */
export const getCustomerOrderById = async (orderId) => {
    const response = await axiosInstance.get(`/orders/${orderId}`);
    return response.data;
};

/**
 * Updates the status of a specific order.
 * @param {string} orderId - The unique identifier of the order to update.
 * @param {UpdateOrderStatusPayload} payload - The new status for the order.
 * @returns {Promise<Order>} A promise that resolves to the updated order object.
 */
export const updateCustomerOrderStatus = async (orderId, payload) => {
    const response = await axiosInstance.put(`/orders/${orderId}/status`, payload);
    return response.data;
};

/**
 * Verifies the payment for a specific order.
 * @param {string} orderId - The unique identifier of the order to verify.
 * @param {VerifyPaymentPayload} payload - The payment details (paymentId, paymentStatus).
 * @returns {Promise<any>} A promise that resolves to the verification response.
 */
export const verifyOrderPayment = async (orderId, payload) => {
    const response = await axiosInstance.post(`/orders/${orderId}/verify-payment`, payload);
    return response.data;
};

export const cancelCustomerOrder = async (orderId, cancelData) => {
    const response = await axiosInstance.patch(`/orders/${orderId}/cancel`, cancelData);
    return response.data;
};

export const calculateShippingPreview = async (payload) => {
    const response = await axiosInstance.post("/orders/shipping-preview", payload);
    return response.data;
};

export const convertCodToOnlinePayment = async (orderId) => {
    const response = await axiosInstance.post(`/orders/${orderId}/pay-online`);
    return response.data;
};

export const retryOrderPayment = async (orderId) => {
    const response = await axiosInstance.post(`/orders/${orderId}/retry-payment`);
    return response.data;
};