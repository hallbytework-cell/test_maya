import axios from "axios";
import { setUserProfileInformations } from "@/context/AuthContext";
import logger from "@/lib/logger";


// Use the Vercel proxy route to avoid CORS issues
// The proxy at /api forwards to https://mayavriksh.in/api
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : "https://mayavriksh.in/api";
// const API_URL =  "http://localhost:5500/api";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 15000,
});

// -- CONCURRENCY LOCK VARIABLES --
let isRefreshing = false;
let failedQueue = [];

// Helper to process the queue of waiting requests
const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 1. PREVENT INFINITE LOOP: If the error comes from the refresh endpoint itself, reject immediately
        if (originalRequest.url.includes("/auth/refresh-token")) {
             // Optional: Trigger a window event to force logout in UI if refresh fails totally
             window.dispatchEvent(new Event("auth:logout"));
             return Promise.reject(error);
        }

        if ((error.response?.status === 401 || error.response?.status === 403)  && !originalRequest._retry) {
            
            // 2. HANDLE CONCURRENCY: If refreshing is already happening, queue this request
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    return axiosInstance(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call the refresh endpoint
                // Note: We intentionally use a separate instance or bypass interceptors if needed, 
                // but since we added the 'includes' check above, using axiosInstance is safe.
                const res = await axiosInstance.post("/auth/refresh-token");
                
                const newAccessToken = res.data.data.accessToken;
                sessionStorage.setItem("mv_access_token", newAccessToken);
                
                // Update React State
                setUserProfileInformations();
                
                // Process the queue: Retry all failed requests
                processQueue(null, newAccessToken);
                
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // 3. FORCE LOGOUT ON FAILURE
                // Since we can't easily access React Context here, we dispatch a custom event
                // or clear storage manually.
                sessionStorage.removeItem("mv_access_token");
                window.dispatchEvent(new Event("auth:logout"));
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;