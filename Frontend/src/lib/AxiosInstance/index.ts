import envConfig from "@/config/envConfig";
import axios from "axios";
import { getAuthCookie } from "@/utils/cookies";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get the auth token from cookies
      const authToken = await getAuthCookie();
      
      if (authToken) {
        // Format the authorization header properly with Bearer prefix
        config.headers["Authorization"] = `Bearer ${authToken}`;
        console.log("Authorization header set:", `Bearer ${authToken.substring(0, 20)}...`);
      } else {
        console.log("No auth token found in cookies");
      }
      
      return config;
    } catch (error) {
      console.error("Error in axios interceptor:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;