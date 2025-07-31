"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/profile.hook";
import { NewProfileCard } from "@/components/profile/NewProfileCard";
import { Skeleton } from "@/components/ui/skeleton";

interface NewProfilePageProps {
    isAdmin?: boolean;
}

const ProfileSkeleton = () => (
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

export default function NewProfilePage({ isAdmin = false }: NewProfilePageProps) {
    const { data: session } = useSession();
    const { user: authUser } = useAuth();
    const [role, setRole] = useState<string>(isAdmin ? "admin" : "user");

    // Use the profile hook that doesn't require user ID
    const { data: profileData, isLoading, error } = useMyProfile();



    useEffect(() => {
        // Determine role from various sources
        if (session?.user?.role) {
            setRole(session.user.role.toLowerCase());
        } else if (authUser?.role) {
            setRole(authUser.role.toLowerCase());
        } else if (profileData?.role) {
            setRole(profileData.role.toLowerCase());
        }
    }, [session, authUser, profileData, isAdmin]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </div>
                <ProfileSkeleton />
            </div>
        );
    }

    if (error || !profileData) {
        console.error("Error fetching profile data:", error);
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-red-600">Error loading profile</h2>
                <p className="text-muted-foreground mt-2">
                    {error?.message || "Could not load your profile data"}
                </p>
                <div className="mt-4 p-4 border rounded bg-gray-50 max-w-lg mx-auto text-left">
                    <h3 className="font-medium">Debug information:</h3>
                    <pre className="text-xs mt-2 overflow-auto">
                        Error: {error?.message || "No error message"}<br />
                        Error Details: {JSON.stringify(error, null, 2)}<br />
                        Session: {session?.user ? "Available" : "Not available"}<br />
                        Auth User: {authUser ? "Available" : "Not available"}
                    </pre>
                    <div className="mt-4">
                        <p className="text-sm font-medium">Possible issues:</p>
                        <ul className="text-xs list-disc ml-5 mt-1">
                            <li>Authentication token might be missing or invalid</li>
                            <li>Backend profile API might not be accessible</li>
                            <li>CORS issues between frontend and backend</li>
                            <li>User might not be properly authenticated</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    {isAdmin ? "Admin Profile" : "My Profile"}
                </h1>
                <p className="text-muted-foreground">
                    {isAdmin
                        ? "View and update your administrator profile information"
                        : "View and update your profile information"
                    }
                </p>
            </div>
            <NewProfileCard userData={profileData} userRole={role} />
        </div>
    );
}
