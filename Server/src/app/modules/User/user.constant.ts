export const USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  INSTRUCTOR: 'INSTRUCTOR',
} as const;


export const DEFAULT_PROFILE_URL =
  'https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Free-Download.png';

export const UserSearchableFields = [
  'name',
  'email',
  'phone',
  'role',
  'status',
];
