import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; 

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000, 
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry & Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If Unauthorized & Not Retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt Token Refresh
        const refreshToken = Cookies.get("refresh_token");
        if (!refreshToken) {
          throw new Error("No refresh token found.");
        }

        const { data } = await axios.post(`${API_BASE_URL}/users/refresh/`, {
          refresh: refreshToken,
        });

        // Store New Tokens
        Cookies.set("access_token", data.access, { path: "/" });
        Cookies.set("refresh_token", data.refresh, { path: "/" });

        // Retry the Original Request with New Token
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login"; // Redirect to login on failure
      }
    }
    return Promise.reject(error);
  }
);

export default api;
