import axiosInstance from "@/lib/AxiosInstance";
import { UserData } from "@/types/auth";

export interface ProfileUpdateData {
  name: string;
  mobileNumber?: string;
  profilePhoto?: File | null;
}

export async function getMyProfile(): Promise<UserData | null> {
  try {
    console.log("Attempting to fetch profile...");
    const res = await axiosInstance.get("/profile");
    console.log("Profile info response:", res.data);
    return res.data.data || null;
  } catch (error: any) {
    console.error("Error fetching profile info:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    });
    return null;
  }
}

export async function updateMyProfile(data: ProfileUpdateData): Promise<UserData> {
  try {
    console.log("Updating profile with data:", data);
    
    // Create FormData to handle file upload
    const formData = new FormData();
    
    // Add text fields
    formData.append("name", data.name);
    if (data.mobileNumber) {
      formData.append("mobileNumber", data.mobileNumber);
    }
    
    // Add file if present
    if (data.profilePhoto) {
      formData.append("profilePhoto", data.profilePhoto);
    }
    
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    // Use PATCH method and multipart/form-data content type (automatically set by FormData)
    const res = await axiosInstance.patch("/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log("Profile update response:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
