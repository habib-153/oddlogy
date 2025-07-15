import { Types } from 'mongoose';
type TCourseStatus = 'in-progress' | 'completed' | 'not-started';
type TCourseType = 'free' | 'paid' 

type TCourseMedia = {
  banner: string;
  intro_video: string;
  thumbnail: string;
};

type TPrerequisite = {
  course: Types.ObjectId;
};

export type TCourse = {
  _id?: string;
  title: string;
  description: string;
  instructor: Types.ObjectId;
  students: Types.ObjectId[];
  moduleCount: number;
  modules: Types.ObjectId[];
  courseType: TCourseType;
  courseStatus: TCourseStatus;
  media: TCourseMedia;
  prerequisites?: TPrerequisite[];
  price?: number;
  salePrice?: number;
  studentEnrolled: number;
  createdAt?: Date;
  updatedAt?: Date;
  isCompleted?: boolean;
  isDeleted?: boolean;
};
