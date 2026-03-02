
import axiosInstance from "../../config/axiosConfig";

/**
 * Registers a new customer after they have been verified via Firebase OTP.
 * This endpoint requires the JWT from the previous verification step to be in the Authorization header.
 * @param {CustomerRegisterData} data - The customer's first name, last name, and email.
 * @returns {Promise<CustomerRegisterResponse>} A promise that resolves to the registration confirmation.
 */
export const registerCustomer = async (data) => {
  const response = await axiosInstance.post("/auth/customer/register", data);
  return response.data;
};

/**
 * Verifies a Firebase ID token from a phone number sign-in.
 * Called after the user successfully enters the OTP on the frontend.
 * @param {string} accessToken - The Firebase ID token (JWT) from the client.
 * @returns {Promise<import('./authService').LoginResponse>} A promise that resolves to the backend's login response.
 */
export const verifyFirebasePhone = async (accessToken) => {
  const payload = { access_token: accessToken };
  const response = await axiosInstance.post("/auth/customer/firebase/phone-verify", payload);
  return response.data;
};

/**
 * Logs in or registers a user via a Firebase ID token from an email/password or social provider sign-in.
 * @param {string} accessToken - The Firebase ID token (JWT) from the client.
 * @returns {Promise<import('./authService').LoginResponse>} A promise that resolves to the backend's login response.
 */
export const verifyFirebaseProfile = async (accessToken) => {
  const payload = { access_token: accessToken };
  const response = await axiosInstance.post("/auth/customer/firebase/profile-verify", payload);
  return response.data;
};

export const sendOtp = async (phoneNumber) => {
  const payload = { phoneNumber };
  const response = await axiosInstance.post("/auth/customer/send-otp", payload);
  return response.data;
};

export const verifyOtp = async (phoneNumber, otp) => {
  const payload = { phoneNumber, otp };
  const response = await axiosInstance.post("/auth/customer/verify-otp", payload);
  return response.data;
};

export const getCustomerProfile = async () => {
    const response = await axiosInstance.get("/auth/customer/profile");
    return response.data;
};