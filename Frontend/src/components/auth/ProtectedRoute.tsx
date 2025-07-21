"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from "@/utils/cookies";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  adminOnly?: boolean; 
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  adminOnly = false,
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user: authUser } = useAuth();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Get user from either NextAuth or JWT context
        let currentUser = session?.user || authUser;

        // If no user from context, try to get from cookies
        if (!currentUser) {
          const cookieUser = await getCurrentUser();
          currentUser = cookieUser || null;
        }

        if (!currentUser) {
          router.push("/login");
          return;
        }

        // Determine allowed roles
        let roles: string[] = [];

        if (adminOnly) {
          // Backward compatibility
          roles = ["admin"];
        } else if (allowedRoles.length > 0) {
          // Use provided allowed roles
          roles = allowedRoles.map((role) => role.toLowerCase());
        } else {
          // If no roles specified, allow any authenticated user
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }

        // Check if user's role is in allowed roles
        const userRole = currentUser.role?.toLowerCase();
        const hasAccess = roles.includes(userRole as string);

        if (!hasAccess) {
          // Redirect based on user's actual role
          switch (userRole) {
            case "admin":
              router.push("/admin");
              break;
            case "instructor":
              router.push("/instructor");
              break;
            case "user":
            default:
              router.push("/user");
              break;
          }
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Authorization check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    // Only run check when session status is determined or we have authUser
    if (status !== "loading" || authUser) {
      checkAuthorization();
    }
  }, [session, authUser, status, allowedRoles, adminOnly, router]);

  // Show loading spinner while checking authorization
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show nothing if not authorized (user will be redirected)
  if (!isAuthorized) {
    return null;
  }

  // Render children if authorized
  return <>{children}</>;
}