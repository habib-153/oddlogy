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
    // Create a comprehensive error object for logging
    const errorInfo = {
      message: error.message || 'Unknown error',
      status: error.response?.status || 'No status',
      statusText: error.response?.statusText || 'No status text',
      url: error.config?.url || 'No URL',
      method: error.config?.method?.toUpperCase() || 'No method',
      data: error.response?.data || 'No response data',
      headers: error.config?.headers || 'No request headers',
      responseHeaders: error.response?.headers || 'No response headers'
    };
    
    console.error("API Error:", errorInfo);
    
    // Instead of console.error with the error object directly
    return Promise.reject(error);
  }
);

export default axiosInstance;