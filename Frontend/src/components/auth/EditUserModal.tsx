"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Shield } from "lucide-react";
import { useUpdateUserOnAdmin } from "@/hooks/user.hook";
import { UserData } from "@/types/auth";
import ODForm from "@/components/form/ODForm";
import ODInput from "@/components/form/ODInput";
import ODSelect from "@/components/form/ODSelect";
import Image from "next/image";

interface EditUserModalProps {
  user: UserData;
  onSuccess: () => void;
}

export default function EditUserModal({ user, onSuccess }: EditUserModalProps) {
  const { toast } = useToast();
  const { mutate: updateUser, isPending } = useUpdateUserOnAdmin();

  const roleOptions = [
    { value: "USER", label: "Student" },
    { value: "INSTRUCTOR", label: "Instructor" },
    { value: "ADMIN", label: "Admin" },
  ];

  const defaultValues = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const onSubmit = (data: any) => {
    updateUser(
      { id: user._id!, userData: data },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "User updated successfully!",
          });
          onSuccess();
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to update user",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* User Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
          <Image
            src={
              user.profilePhoto ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt={user.name}
            className="w-full h-full object-cover"
            width={80}
            height={80}
          />
        </div>
      </div>

      <ODForm defaultValues={defaultValues} onSubmit={onSubmit}>
        <div className="space-y-3">
          {/* Name Field */}
          <div >
            <ODInput
              name="name"
              label="Full Name"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email Field */}
          <div >
            <ODInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Role Field */}
          <div >
            <ODSelect
              name="role"
              label="User Role"
              options={roleOptions}
              required
              placeholder="Select user role"
            />
          </div>

          {/* Google User Info */}
          {user.isGoogleUser && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📧</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Google Account
                  </p>
                  <p className="text-xs text-blue-700">
                    This user signed up via Google Auth
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              className="px-6 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Update User
                </>
              )}
            </Button>
          </div>
        </div>
      </ODForm>
    </div>
  );
}