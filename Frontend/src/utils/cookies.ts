'use server';
import { jwtDecode } from "jwt-decode";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const setAuthCookie = async (token: string) => {
  (await cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
};

export const getAuthCookie = async () => {
  return (await cookies()).get("auth-token");
};

export const removeAuthCookie = async () => {
  (await cookies()).delete("auth-token");
};

export const getCurrentUser = async () => {
    const cookie = await getAuthCookie();
    const accessToken = cookie?.value;

    let decodedToken = null;

    if (accessToken) {
      decodedToken = await jwtDecode(accessToken);

      return {
        id: decodedToken._id,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
      };
    }
  };