import { Schema, model } from 'mongoose';
import { TEnrollment } from './enrollment.interface';

const enrollmentSchema = new Schema<TEnrollment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentPhone: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['bkash', 'nagad', 'rocket'],
    },
    transactionId: {
      type: String,
    },
    paymentNumber: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    approvalDate: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Enrollment = model<TEnrollment>('Enrollment', enrollmentSchema);
