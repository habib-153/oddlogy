"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  setAuthCookie,
  removeAuthCookie,
  getCurrentUser,
} from "@/utils/cookies";
import { signIn, useSession } from "next-auth/react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const handleUser = async () => {
    const cookieUser = await getCurrentUser();
    if (cookieUser) {
      setUser(cookieUser as User);
      setLoading(false);
      return;
    }

    if (session?.accessToken) {
      try {
        const payload = JSON.parse(atob(session.accessToken.split(".")[1]));
        setUser({
          id: payload._id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
          image: payload.profilePhoto,
        });
      } catch (error) {
        console.error("Error decoding NextAuth JWT token:", error);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    handleUser();
  }, [loading, session]); 

  const login = async (data: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const res = await response.json();

      if (res.success) {
        setAuthCookie(res?.data?.accessToken);
        setUser(res?.data?.user);
        router.push(res?.data?.user?.role === "admin" ? "/admin" : "/user");
      } else {
        throw new Error(
          res.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/user",
        redirect: true,
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: any) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        router.push("/login");
      } else {
        // Handle specific error messages from backend
        if (data.message === "User already exist!!") {
          throw new Error(
            "An account with this email already exists. Please try logging in instead."
          );
        }
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthCookie();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
