export type TCourseStatus = 'in-progress' | 'completed' | 'not-started';
export type TCourseType = 'free' | 'paid' | 'subscription';
export type TCourseCategory = 'HSC' | 'Admission' | 'Skill Development' | 'Others';

export type TCourseMedia = {
  banner: string;
  intro_video: string;
  thumbnail: string;
};

export type TPrerequisite = {
  course: string;
};

export type TCourse = {
  _id?: string;
  title: string;
  description: string;
  instructor: any;
  students: any[];
  moduleCount: number;
  modules: any[];
  courseType: TCourseType;
  courseCategory: TCourseCategory;
  courseStatus: TCourseStatus;
  media: TCourseMedia;
  prerequisites?: TPrerequisite[];
  price?: number;
  salePrice?: number;
  studentEnrolled: number;
  createdAt?: string;
  updatedAt?: string;
  isCompleted?: boolean;
  isDeleted?: boolean;
};

export type TUserCourse = TCourse & {
  enrollmentInfo: {
    enrollmentDate: string;
    approvalDate: string;
    paymentMethod: string;
    amount: number;
  };
  moduleCount: number;
  completedModules: number;
  progressPercentage: number;
};

export type TUserCoursesResponse = {
  courses: TUserCourse[];
  total: number;
  enrolledCoursesCount: number;
};