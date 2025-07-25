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
  profilePhoto?: string;
  bio?: string;
  phone?: string;
  address?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProfileUpdateData = Omit<UserData, 'password' | 'email' | 'createdAt' | 'updatedAt' | '_id' | 'id'>;
