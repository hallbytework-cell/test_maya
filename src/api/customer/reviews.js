import axiosInstance from "../../config/axiosConfig";


export const getMyReviews = async (page = 1, limit = 10, sortBy = 'latest') => {
    const response = await axiosInstance.get(`/me/reviews`, {
        params: { page, limit, sortBy }
    });
    return response.data;
};

export const getPendingReviews = async () => {
    const response = await axiosInstance.get(`/me/reviews/pending`);
    return response.data;
};

export const getPlantReviews = async (plantId, page = 1, limit = 10, sortBy = 'latest') => {
    const response = await axiosInstance.get(`/products/${plantId}/reviews`, {
        params: { page, limit, sortBy }
    });
    return response.data;
};

export const getVariantReviews = async (variantId, page = 1, limit = 10, sortBy = 'latest') => {
    const response = await axiosInstance.get(`/products/${variantId}/reviews/variant`, {
        params: { page, limit, sortBy }
    });
    return response.data;
};

export const createReview = async (variantId, formData) => {
    const response = await axiosInstance.post(`/products/${variantId}/reviews`, formData);
    return response.data;
};

export const updateReview = async (reviewId, formData) => {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, formData);
    return response.data;
};

export const getPlantReviewMedia = async (plantId, page = 1, limit = 10, mediaType) => {
    const response = await axiosInstance.get(`/products/${plantId}/reviews/media`, {
        params: { 
            page, 
            limit, 
        }
    });
    return response.data;
};