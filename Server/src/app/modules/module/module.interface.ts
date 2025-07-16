import { Types } from 'mongoose';

export type TModule = {
  _id?: Types.ObjectId;
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