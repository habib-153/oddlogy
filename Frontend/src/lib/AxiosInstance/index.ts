'use client';
import envConfig from "@/config/envConfig";
import axios from "axios";
import { getAuthCookie } from "@/utils/cookies";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach auth token
axiosInstance.interceptors.request.use(
  async function (config) {
    let token = null;

    // const cookieStore = await cookies();
    token = await getAuthCookie();
    console.log("Token from cookies:", token);

    if (!token) {
      try {
        const session = await getSession();
        console.log("NextAuth session:", session?.accessToken);
        if (session?.accessToken) {
          token = session.accessToken as string;
        }
      } catch (error) {
        console.log("No NextAuth session found");
      }
    }
    if (token) {
      config.headers.authorization = token;
    }

    return config;
  },
  function (error) {
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