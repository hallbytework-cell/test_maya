import axiosInstance from "../../config/axiosConfig";

/**
 * @typedef {object} Address
 * @property {string} streetAddress
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} pinCode
 * @property {string} [landmark]
 * @property {string} [latitude]
 * @property {string} [longitude]
 */

/**
 * @typedef {object} AddressData
 * @property {string} addresseeName
 * @property {string} addresseePhoneNumber
 * @property {'Home' | 'Work' | 'Other'} addressType
 * @property {Address} address
 * @property {string} [deliveryInstruction]
 * @property {boolean} isDefault
 */

/**
 * @typedef {object} AddressResponse
 * @property {string} id
 */

/**
 * Fetches all saved addresses for the logged-in customer.
 * @returns {Promise<AddressData[]>} A promise that resolves to an array of customer addresses.
 */
export const getCustomerAddresses = async () => {
    const response = await axiosInstance.get("/addresses");
    return response.data;
};

/**
 * Adds a new address for the logged-in customer.
 * @param {AddressData} data - The new address details.
 * @returns {Promise<AddressResponse>} A promise that resolves to the newly created address.
 */
export const addCustomerAddress = async (data) => {
    const response = await axiosInstance.post("/addresses", data);
    return response.data;
};

/**
 * Fetches a single saved address by its ID for the logged-in customer.
 * @param {string} addressId - The unique identifier of the customer address.
 * @returns {Promise<AddressData>} A promise that resolves to a single customer address object.
 */
export const getCustomerAddressById = async (addressId) => {
    const response = await axiosInstance.get(`/addresses/${addressId}`);
    return response.data;
};

/**
 * Updates an existing address for the logged-in customer.
 * @param {string} addressId - The unique identifier of the address to update.
 * @param {AddressData} data - The updated address details.
 * @returns {Promise<AddressResponse>} A promise that resolves to the updated address.
 */
export const updateCustomerAddress = async (addressId, data) => {
    const response = await axiosInstance.put(`/addresses/${addressId}`, data);
    return response.data;
};


/**
 * Deletes a saved address for the logged-in customer.
 * @param {string} addressId - The unique identifier of the address to delete.
 * @returns {Promise<void>} A promise that resolves when the address is deleted.
 */
export const deleteCustomerAddress = async (addressId) => {
    const response = await axiosInstance.delete(`/addresses/${addressId}`);
    return response.data;
};

/**
 * Sets a specific address as the default for the logged-in customer.
 * @param {string} addressId - The unique identifier of the address to set as default.
 * @returns {Promise<void>} A promise that resolves when the default is set.
 */
export const setDefaultCustomerAddress = async (addressId) => {
    const response = await axiosInstance.put(`/addresses/${addressId}/set-default`);
    return response.data;
};

export const getLocationDetails = async (latitude, longitude) => {
    const response = await axiosInstance.get(`/addresses/reverse-geocode?lat=${latitude}&lon=${longitude}`);
    return response.data;
};
