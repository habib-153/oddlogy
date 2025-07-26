"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile } from "@/hooks/profile.hook";
import { InstructorProfileCard } from "@/components/instructor/InstructorProfileCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => (
    <div className="w-full max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-8" />
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex flex-col items-center">
                        <Skeleton className="w-40 h-40 rounded-full" />
                        <Skeleton className="h-6 w-28 mt-4" />
                        <Skeleton className="h-4 w-16 mt-2" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-36" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-32" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-52" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-10 w-full md:w-36 mt-6" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function InstructorProfilePage() {
    const { data: session } = useSession();
    const { user: authUser } = useAuth();

    // Use the profile hook that doesn't require user ID
    const { data: profileData, isLoading, error } = useMyProfile();

    console.log("Instructor profile page data:", {
        profileData,
        isLoading,
        error,
        session: session?.user ? true : false,
        authUser: authUser ? true : false
    });

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
        console.error("Error fetching instructor profile data:", error);
        return (
            <div className="text-center py-10">
                <h2 className="text-xl font-semibold text-red-600">Error loading profile</h2>
                <p className="text-muted-foreground mt-2">
                    {error?.message || "Could not load your instructor profile data"}
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
                            <li>User might not have instructor privileges</li>
                            <li>CORS issues between frontend and backend</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Instructor Profile</h1>
                <p className="text-muted-foreground">
                    View and update your instructor profile information, qualifications, and experience
                </p>
            </div>
            <InstructorProfileCard userData={profileData} />
        </div>
    );
}
