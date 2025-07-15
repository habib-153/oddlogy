import { Types } from 'mongoose';

export type TModule = {
  _id?: string;
  name: string;
  course: Types.ObjectId;
  video_url: string;
  module_number: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  isCompleted?: boolean;
  isDeleted?: boolean;
};