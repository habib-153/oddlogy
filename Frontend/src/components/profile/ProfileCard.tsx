"use client";

import { useState } from "react";
import Image from "next/image";
import { UserData, ProfileUpdateData } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUser } from "@/hooks/user.hook";
import { useToast } from "@/hooks/use-toast";

interface ProfileCardProps {
    userData: UserData;
    userRole: string;
}

export function ProfileCard({ userData, userRole }: ProfileCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<ProfileUpdateData>({
        name: userData.name,
        image: userData.image || "",
        bio: userData.bio || "",
        phone: userData.phone || "",
        address: userData.address || "",
    });

    // Use the MongoDB _id or fallback to id from user data
    const userId = userData._id || userData.id;

    console.log("User data in ProfileCard:", userData);
    console.log("Using user ID for updates:", userId);

    const updateUser = useUpdateUser(userId || "");
    const { toast } = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            toast({
                title: "Update Failed",
                description: "User ID is missing. Cannot update profile.",
                variant: "destructive",
            });
            return;
        }
        try {
            await updateUser.mutateAsync(formData);
            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
                variant: "default",
            });
            setIsOpen(false);
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "There was a problem updating your profile.",
                variant: "destructive",
            });
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                            <Image
                                src={userData.profilePhoto || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"}
                                alt={userData.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <h3 className="text-xl font-semibold">{userData.name}</h3>
                        <span className="badge bg-primary text-white px-2 py-1 rounded mt-1 capitalize">
                            {userRole}
                        </span>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                                <p>{userData.email}</p>
                            </div>

                            {userData.phone && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                                    <p>{userData.phone}</p>
                                </div>
                            )}

                            {userData.address && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                                    <p>{userData.address}</p>
                                </div>
                            )}

                            {userData.bio && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Bio</h4>
                                    <p>{userData.bio}</p>
                                </div>
                            )}

                            {userData.createdAt && (
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground">Member Since</h4>
                                    <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>

                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full md:w-auto mt-4">Update Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <form onSubmit={handleSubmit}>
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your profile information here. Click save when you&apos;re done.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="col-span-3"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="image" className="text-right">
                                                Image URL
                                            </Label>
                                            <Input
                                                id="image"
                                                name="image"
                                                value={formData.image}
                                                onChange={handleChange}
                                                className="col-span-3"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="phone" className="text-right">
                                                Phone
                                            </Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="col-span-3"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="address" className="text-right">
                                                Address
                                            </Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="col-span-3"
                                            />
                                        </div>

                                        <div className="grid grid-cols-4 items-start gap-4">
                                            <Label htmlFor="bio" className="text-right pt-2">
                                                Bio
                                            </Label>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                className="col-span-3"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button type="submit" disabled={updateUser.isPending}>
                                            {updateUser.isPending ? "Saving..." : "Save changes"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
