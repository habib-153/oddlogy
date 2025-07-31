import { UserData } from "./auth";
import { TCourse } from "./course";

export interface TCarouselImage {
  _id?: string;
  name: string;
  img_url: string;
}

export interface TModule {
  _id?: string;
  name: string;
  description: string;
  module_number: number;
  video_url: string;
  course: string;
  isCompleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductCardProps {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  status?: string;
  studentsEnrolled?: number;
  moduleCount?: number;
  className?: string;
}

export interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  status?: string;
  studentsEnrolled?: number;
  moduleCount?: number;
}

export interface ProductGridProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export interface TEnrollment {
  _id?: string;
  courseId: TCourse
  studentId: UserData
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  paymentMethod?: "bkash" | "nagad" | "rocket";
  transactionId?: string;
  paymentNumber?: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  enrollmentDate: Date;
  approvalDate?: Date;
  approvedBy?: string
  rejectionReason?: string;
  isDeleted: boolean;
}