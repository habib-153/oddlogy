"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/user.hook";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientProfilePageProps {
    isAdmin?: boolean;
}

export default function ClientProfilePage({ isAdmin = false }: ClientProfilePageProps) {
    const { data: session } = useSession();
    const { user: authUser } = useAuth();

    // Use either NextAuth session or custom auth context
    const currentUser = session?.user || authUser;

    // Try to get the user ID from various sources
    const userId = currentUser?.id || currentUser?._id;

    console.log("Auth sources:", {
        session: session?.user ? true : false,
        authUser: authUser ? true : false
    });
    console.log("Current user:", currentUser);
    console.log("Using user ID for query:", userId);

    const { data: userData, isLoading, error } = useUser(userId || "");
    const [role, setRole] = useState<string>(isAdmin ? "admin" : "user");

    useEffect(() => {
        // Check if user role is available from session or auth context
        if (session?.user?.role) {
            setRole(session.user.role.toLowerCase());
            console.log("Role from session:", session.user.role);
        } else if (authUser?.role) {
            setRole(authUser.role.toLowerCase());
            console.log("Role from authUser:", authUser.role);
        } else if (userData?.role) {
            setRole(userData.role.toLowerCase());
            console.log("Role from userData:", userData.role);
        }
    }, [session, authUser, userData, isAdmin]);

    if (isLoading) {
        return (
            <div className="w-full max-w-3xl mx-auto">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-8" />
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex flex-col items-center">
                                <Skeleton className="w-32 h-32 rounded-full" />
                                <Skeleton className="h-6 w-28 mt-4" />
                                <Skeleton className="h-4 w-16 mt-2" />
                            </div>
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-48 mt-1" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-36 mt-1" />
                                    </div>
                                    <div>
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-6 w-52 mt-1" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-full md:w-36 mt-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !userData) {
        console.error("Error fetching user data:", error);
        return (
            <div className="text-center py-10">
                <h2 className="text-xl">Error loading profile</h2>
                <p className="text-muted-foreground mt-2">
                    {error?.message || "Could not load user profile data"}
                </p>
                <div className="mt-4 p-4 border rounded bg-gray-50 max-w-lg mx-auto text-left">
                    <h3 className="font-medium">Debug information:</h3>
                    <pre className="text-xs mt-2 overflow-auto">
                        User ID: {userId || "not available"}<br />
                        Error: {error?.message || "No error message"}<br />
                        Error Details: {JSON.stringify(error, null, 2)}<br />
                        Auth context user: {JSON.stringify(authUser, null, 2)}<br />
                        Session user: {JSON.stringify(session?.user, null, 2)}
                    </pre>
                    <div className="mt-4">
                        <p className="text-sm font-medium">Possible issues:</p>
                        <ul className="text-xs list-disc ml-5 mt-1">
                            <li>User ID might be missing or in wrong format</li>
                            <li>Backend API might be expecting a different ID format</li>
                            <li>Authentication token might be missing or invalid</li>
                            <li>CORS issues between frontend and backend</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">{isAdmin ? "Admin Profile" : "My Profile"}</h1>
            <p className="text-muted-foreground">
                {isAdmin
                    ? "View and update your administrator profile information"
                    : "View and update your profile information"
                }
            </p>
            <ProfileCard userData={userData} userRole={role} />
        </div>
    );
}
