"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/user.hook";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientProfilePage() {
    const { data: session } = useSession();
    const { user: authUser } = useAuth();

    // Use either NextAuth session or custom auth context
    const currentUser = session?.user || authUser;
    const id = currentUser?.id as string;

    const { data: userData, isLoading, error } = useUser(id);
    const [role, setRole] = useState<string>("user");

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
    }, [session, authUser, userData]); if (isLoading) {
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
        return (
            <div className="text-center py-10">
                <h2 className="text-xl">Error loading profile</h2>
                <p className="text-muted-foreground mt-2">
                    {error?.message || "Could not load user profile data"}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">
                View and update your profile information
            </p>
            <ProfileCard userData={userData} userRole={role} />
        </div>
    );
}
