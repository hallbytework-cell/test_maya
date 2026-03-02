import axiosInstance from "../../config/axiosConfig";

/**
 * @typedef {object} CartItemPayload
 * @property {string} [plantId]
 * @property {string} [plantVariantId]
 * @property {string} [potVariantId]
 * @property {string} [couponCodeId]
 * @property {number} quantity
 * @property {number} priceAtAdd
 */

/**
 * @typedef {object} AddToCartData
 * @property {CartItemPayload[]} items
 */

/**
 * @typedef {object} CartItem
 * @property {string} id - The unique ID for the cart item
 * @property {string} [plantId]
 * @property {string} [plantVariantId]
 * @property {string} [potVariantId]
 * @property {string} [couponCodeId]
 * @property {number} quantity
 * @property {number} priceAtAdd
 */

/**
 * @typedef {object} UpdateCartItemPayload
 * @property {number} [quantity]
 * @property {string} [couponId]
 */

/**
 * Fetches all items in the logged-in customer's cart.
 * @returns {Promise<CartItem[]>} A promise that resolves to an array of cart items.
 */
export const getCartItems = async () => {
    const response = await axiosInstance.get("/cart-items");
    return response.data;
};

/**
 * Adds one or more items to the customer's cart.
 * Updates quantity if the same plant variant already exists.
 * @param {AddToCartData} data - An object containing an array of items to add.
 * @returns {Promise<CartItem[]>} A promise that resolves to the updated list of cart items.
 */
export const addCartItems = async (data) => {
    const response = await axiosInstance.post("/cart-items", data);
    return response.data;
};


/**
 * Updates the quantity or coupon for a specific item in the cart.
 * @param {string} cartItemId - The unique identifier of the cart item to update.
 * @param {UpdateCartItemPayload} data - The update payload (e.g., { quantity: 2 }).
 * @returns {Promise<CartItem>} A promise that resolves to the updated cart item.
 */
export const updateCartItem = async (cartItemId, data) => {
    const response = await axiosInstance.put(`/cart-items/${cartItemId}`, data);
    return response.data;
};

/**
 * Removes a specific item from the cart.
 * @param {string} cartItemId - The unique identifier of the cart item to remove.
 * @returns {Promise<void>} A promise that resolves when the item is removed.
 */
export const deleteCartItem = async (data) => {
    const response = await axiosInstance.delete(`/cart-items`,{
        data:data
    });
    return response.data;
};

/**
 * Moves a specific item from the active cart to the "checkout later" list.
 * @param {string} cartItemId - The unique identifier of the cart item to move.
 * @returns {Promise<void>} A promise that resolves when the item is moved.
 */
export const moveCartItemToCheckoutLater = async (cartItemId) => {
    const response = await axiosInstance.post(`/cart-items/${cartItemId}/move-to-checkout-later`);
    return response.data;
};
