import axiosInstance from "../../config/axiosConfig";


export const submitContactMessage = async (contactData) => {
    // The endpoint expects application/json, so we pass the object directly.
    const response = await axiosInstance.post(`/contact`, contactData);
    return response.data;
};