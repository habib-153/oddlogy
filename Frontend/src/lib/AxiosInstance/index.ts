"use client";
import envConfig from "@/config/envConfig";
import axios from "axios";
import { getSession } from "next-auth/react";
import { getAuthCookie } from "@/utils/cookies";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi,
});

// axiosInstance.interceptors.request.use(
//   async function (config) {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("auth-token")?.value;
//     console.log("Token from cookies:", accessToken);

//     if (accessToken) {
//       config.headers.Authorization = accessToken;
//     }

//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

axiosInstance.interceptors.request.use(
  async function (config) {
    let token = null;

    // const cookieStore = await cookies();
    token = await getAuthCookie();
    console.log("Token from cookies:", token);

    if (!token) {
      try {
        const session = await getSession();
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

export default axiosInstance;