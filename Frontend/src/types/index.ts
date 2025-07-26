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