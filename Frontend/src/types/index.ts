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