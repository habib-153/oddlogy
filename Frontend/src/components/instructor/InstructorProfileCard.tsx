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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateMyProfile } from "@/hooks/profile.hook";
import { useToast } from "@/hooks/use-toast";
import { Camera, User, GraduationCap, Briefcase, Phone, Mail } from "lucide-react";

interface InstructorProfileCardProps {
    userData: UserData & {
        designation?: string;
        qualifications?: string;
        experience?: string;
        specialization?: string;
        bio?: string;
    };
}

export function InstructorProfileCard({ userData }: InstructorProfileCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const updateProfile = useUpdateMyProfile();

    const [formData, setFormData] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        mobileNumber: userData?.mobileNumber || '',
        designation: userData?.designation || '',
        qualifications: userData?.qualifications || '',
        experience: userData?.experience || '',
        specialization: userData?.specialization || '',
        bio: userData?.bio || '',
        profilePhoto: null as File | null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast({
                    title: "Invalid file type",
                    description: "Please select an image file",
                    variant: "destructive",
                });
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "File too large",
                    description: "Please select an image smaller than 5MB",
                    variant: "destructive",
                });
                return;
            }

            setFormData(prev => ({ ...prev, profilePhoto: file }));

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
                description: "Name is required",
                variant: "destructive",
            });
            return;
        }

        try {
            // Create ProfileUpdateData object with required fields
            const submitData = {
                name: formData.name,
                mobileNumber: formData.mobileNumber || undefined,
                profilePhoto: formData.profilePhoto instanceof File ? formData.profilePhoto : null,
            };

            await updateProfile.mutateAsync(submitData);

            toast({
                title: "Success",
                description: "Profile updated successfully",
            });

            setIsOpen(false);
            setPreviewImage(null);
        } catch (error) {
            console.error('Profile update error:', error);
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive",
            });
        }
    };

    const currentImage = previewImage || userData.profilePhoto || userData.image;

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Instructor Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Profile Image Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200">
                                {currentImage ? (
                                    <Image
                                        src={currentImage}
                                        alt="Profile"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <User className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold">{userData?.name}</h3>
                                <p className="text-sm text-muted-foreground">{userData?.designation || 'Instructor'}</p>
                                <p className="text-xs text-muted-foreground capitalize">{userData?.role?.toLowerCase()}</p>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg border-b pb-2">Basic Information</h4>

                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">{userData?.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Phone</p>
                                            <p className="text-sm text-muted-foreground">{userData?.mobileNumber || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Designation</p>
                                            <p className="text-sm text-muted-foreground">{userData?.designation || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-lg border-b pb-2">Professional Details</h4>

                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-4 h-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">Qualifications</p>
                                            <p className="text-sm text-muted-foreground">{userData?.qualifications || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Briefcase className="w-4 h-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">Experience</p>
                                            <p className="text-sm text-muted-foreground">{userData?.experience || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-4 h-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm font-medium">Specialization</p>
                                            <p className="text-sm text-muted-foreground">{userData?.specialization || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            {userData?.bio && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-lg border-b pb-2 mb-4">Biography</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{userData.bio}</p>
                                </div>
                            )}

                            {/* Update Button */}
                            <div className="mt-6">
                                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full md:w-auto">
                                            <Camera className="w-4 h-4 mr-2" />
                                            Update Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Update Instructor Profile</DialogTitle>
                                            <DialogDescription>
                                                Update your instructor profile information including professional details.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            {/* Profile Photo Upload */}
                                            <div className="space-y-2">
                                                <Label>Profile Photo</Label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                                                        {(previewImage || userData.profilePhoto) ? (
                                                            <Image
                                                                src={previewImage || userData.profilePhoto || userData.image || ''}
                                                                alt="Profile preview"
                                                                width={80}
                                                                height={80}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                                <User className="w-8 h-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
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
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </div>
                                            </div>

                                            {/* Basic Information */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Name *</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleInputChange}
                                                        placeholder="Enter your full name"
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

                                                <div className="space-y-2">
                                                    <Label htmlFor="designation">Designation</Label>
                                                    <Input
                                                        id="designation"
                                                        name="designation"
                                                        value={formData.designation}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., Senior Instructor, Professor"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="specialization">Specialization</Label>
                                                    <Input
                                                        id="specialization"
                                                        name="specialization"
                                                        value={formData.specialization}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., Web Development, Data Science"
                                                    />
                                                </div>
                                            </div>

                                            {/* Professional Details */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="qualifications">Educational Qualifications</Label>
                                                    <Textarea
                                                        id="qualifications"
                                                        name="qualifications"
                                                        value={formData.qualifications}
                                                        onChange={handleInputChange}
                                                        placeholder="e.g., Ph.D. in Computer Science, M.S. in Software Engineering"
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="experience">Experience</Label>
                                                    <Textarea
                                                        id="experience"
                                                        name="experience"
                                                        value={formData.experience}
                                                        onChange={handleInputChange}
                                                        placeholder="Describe your teaching and professional experience"
                                                        rows={3}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="bio">Biography</Label>
                                                    <Textarea
                                                        id="bio"
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        placeholder="Write a brief biography about yourself"
                                                        rows={4}
                                                    />
                                                </div>
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
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
