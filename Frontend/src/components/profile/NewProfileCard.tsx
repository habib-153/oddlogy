"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UserData } from "@/types/auth";
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
import { useUpdateMyProfile } from "@/hooks/profile.hook";
import { useToast } from "@/hooks/use-toast";
import { Camera, User } from "lucide-react";

interface NewProfileCardProps {
    userData: UserData;
    userRole: string;
}

interface ProfileFormData {
    name: string;
    mobileNumber: string;
    profilePhoto: File | null;
}

export function NewProfileCard({ userData, userRole }: NewProfileCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ProfileFormData>({
        name: userData.name || "",
        mobileNumber: userData.phone || "",
        profilePhoto: null,
    });

    const updateProfile = useUpdateMyProfile();
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Invalid File",
                    description: "Please select an image file.",
                    variant: "destructive",
                });
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Please select an image smaller than 5MB.",
                    variant: "destructive",
                });
                return;
            }

            setFormData((prev) => ({ ...prev, profilePhoto: file }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, profilePhoto: null }));
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast({
                title: "Validation Error",
                description: "Name is required.",
                variant: "destructive",
            });
            return;
        }

        try {
            await updateProfile.mutateAsync({
                name: formData.name,
                mobileNumber: formData.mobileNumber,
                profilePhoto: formData.profilePhoto,
            });

            toast({
                title: "Profile Updated",
                description: "Your profile has been updated successfully.",
                variant: "default",
            });

            setIsOpen(false);
            setPreviewImage(null);
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "There was a problem updating your profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    const currentImage = previewImage || userData.profilePhoto || userData.image;

    return (
        <>
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
                                <Image
                                    src={currentImage || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"}
                                    alt={userData.name || "Profile"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-center">{userData.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{userRole}</p>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                                    <p className="text-gray-900 mt-1">{userData.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                                    <p className="text-gray-900 mt-1">{userData.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Phone</Label>
                                    <p className="text-gray-900 mt-1">{userData?.
                                        mobileNumber
                                        || "Not provided"}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                                    <p className="text-gray-900 mt-1 capitalize">{userData.role}</p>
                                </div>
                            </div>

                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full md:w-auto">
                                        <User className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                        <DialogDescription>
                                            Update your profile information and photo.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Profile Photo Section */}
                                        <div className="space-y-2">
                                            <Label>Profile Photo</Label>
                                            <div className="flex items-center space-x-4">
                                                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                                    <Image
                                                        src={previewImage || userData.profilePhoto || userData.image || "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"}
                                                        alt="Preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col space-y-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <Camera className="w-4 h-4 mr-2" />
                                                        Choose Photo
                                                    </Button>
                                                    {(previewImage || formData.profilePhoto) && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleRemoveImage}
                                                        >
                                                            Remove
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <p className="text-xs text-gray-500">
                                                JPG, PNG or GIF. Max size 5MB.
                                            </p>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mobileNumber">Phone Number</Label>
                                            <Input
                                                id="mobileNumber"
                                                name="mobileNumber"
                                                value={formData.mobileNumber}
                                                onChange={handleInputChange}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={updateProfile.isPending}
                                            >
                                                {updateProfile.isPending ? "Updating..." : "Update Profile"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
