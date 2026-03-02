import axiosInstance from "../../config/axiosConfig";

/**
 * @typedef {object} CheckoutLaterItemData
 * @property {string} [plantId]
 * @property {string} [plantVariantId]
 * @property {string} [potVariantId]
 * @property {string} [promoCodeId]
 * @property {number} units
 */

/**
 * @typedef {object} CheckoutLaterItem
 * @property {string} id - The unique ID for the checkout-later item itself
 * @property {string} [plantId]
 * @property {string} [plantVariantId]
 * @property {string} [potVariantId]
 * @property {string} [promoCodeId]
 * @property {number} units
 */


/**
 * Fetches all items saved for later by the logged-in user.
 * @returns {Promise<CheckoutLaterItem[]>} A promise that resolves to an array of saved items.
 */
export const getCheckoutLaterItems = async () => {
    const response = await axiosInstance.get("/checkout-later");
    return response.data;
};

/**
 * Adds an item to the "checkout later" list for the logged-in user.
 * @param {CheckoutLaterItemData} itemData - The details of the item to save.
 * @returns {Promise<CheckoutLaterItem>} A promise that resolves to the newly saved item.
 */
export const addCheckoutLaterItem = async (itemData) => {
    const response = await axiosInstance.post("/checkout-later", itemData);
    return response.data;
};

/**
 * Deletes an item from the "checkout later" list.
 * @param {string} checkoutLaterId - The unique identifier of the item to delete.
 * @returns {Promise<void>} A promise that resolves when the item is successfully deleted.
 */
export const deleteCheckoutLaterItem = async (checkoutLaterId) => {
    const response = await axiosInstance.delete(`/checkout-later/${checkoutLaterId}`);
    return response.data;
};

/**
 * Moves an item from the "checkout later" list back to the active cart.
 * @param {string} checkoutLaterId - The unique identifier of the item to move.
 * @returns {Promise<void>} A promise that resolves when the item is successfully moved.
 */
export const moveCheckoutLaterItemToCart = async (checkoutLaterId) => {
    const response = await axiosInstance.post(`/checkout-later/${checkoutLaterId}/move-to-cart`);
    return response.data;
};
