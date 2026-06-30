import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ REQUEST INTERCEPTOR
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

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

// ✅ RESPONSE INTERCEPTOR (SOPHISTICATED TOKEN REFRESH)
API.interceptors.response.use(
    (response) => {
        // directly return data (clean)
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is a 401 and we haven't already retried this request
        if (error?.response?.status === 401 && !originalRequest._retry) {
            
            // If the error is from the refresh endpoint itself or login endpoint, do not attempt to refresh
            if (originalRequest.url.includes("/auth/refresh/") || originalRequest.url.includes("/auth/login/")) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("role");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return API(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("role");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(error);
            }

            try {
                // Call raw axios to prevent loop intercepting
                const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
                const response = await axios.post(`${baseURL}/auth/refresh/`, {
                    refresh: refreshToken
                });

                const newAccessToken = response.data.access;
                localStorage.setItem("token", newAccessToken);
                
                API.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                processQueue(null, newAccessToken);
                isRefreshing = false;
                
                return API(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;
                
                localStorage.removeItem("token");
                localStorage.removeItem("refresh");
                localStorage.removeItem("role");
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;