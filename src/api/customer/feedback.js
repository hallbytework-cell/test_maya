import axiosInstance from "../../config/axiosConfig";

export const getPlatformFeedback = async () => {
    const response = await axiosInstance.get(`/feedback/platform`);
    return response.data;
};

export const submitFeedback = async (formData) => {
    const response = await axiosInstance.post(`/feedback`, formData);
    return response.data;
};