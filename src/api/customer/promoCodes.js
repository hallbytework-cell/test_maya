import axiosInstance from "../../config/axiosConfig";

export const getAllCoupons = async () => {
    const response = await axiosInstance.get(`/promo-codes?isActive=true`);
    return response.data;
};

export const getPriceSpecificCoupons = async (orderAmount) => {
    const response = await axiosInstance.get(`/promo-codes/by-order-amount/${orderAmount}`);
    return response.data;
};

export const validatePromoCode = async (data) => {
    const response = await axiosInstance.post(`/promo-codes/validate`, data);
    return response.data;
};