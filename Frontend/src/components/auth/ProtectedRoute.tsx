"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (adminOnly && user.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, adminOnly, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}