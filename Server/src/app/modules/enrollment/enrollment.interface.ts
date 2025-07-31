import { Types } from "mongoose";

export interface TEnrollment {
  _id?: string;
  courseId: Types.ObjectId;
  studentId: Types.ObjectId;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  paymentMethod?: 'bkash' | 'nagad' | 'rocket';
  transactionId?: string;
  paymentNumber?: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  enrollmentDate: Date;
  approvalDate?: Date;
  approvedBy?: Types.ObjectId;
  rejectionReason?: string;
  isDeleted: boolean;
}
