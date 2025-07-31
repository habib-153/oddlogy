export type FormValues = {
  email: string;
  password: string;
};

export type UserData = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  profilePhoto?: string;
  bio?: string;
  phone?: string;
  mobileNumber?: string;
  address?: string;
  role?: string;
  // Instructor-specific fields
  designation?: string;
  qualifications?: string;
  experience?: string;
  specialization?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  isGoogleUser?: boolean;
};

export interface TUserStats {
  totalUsers: number;
  activeUsers: number;
  instructors: number;
  students: number;
}

export type ProfileUpdateData = Omit<UserData, 'password' | 'email' | 'createdAt' | 'updatedAt' | '_id' | 'id'>;
