'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { getCurrentUser } from "./cookies";

/**
 * Get the authenticated user from either NextAuth session or JWT cookie
 * This function should be used in server components where useSession() can't be used
 */
export async function getAuthenticatedUser() {
  // Try NextAuth session first
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    return {
      id: session.user.id,
      name: session.user.name || '',
      email: session.user.email || '',
      role: (session.user.role || 'user').toLowerCase(),
      image: session.user.image || null
    };
  }

  // If no NextAuth session, try JWT cookie
  const cookieUser = await getCurrentUser();
  
  if (cookieUser) {
    return {
      ...cookieUser,
      role: (cookieUser.role || 'user').toLowerCase()
    };
  }

  // No authenticated user found
  return null;
}

/**
 * Check if the user has the required role
 */
export function hasRole(userRole: string | undefined, requiredRole: string): boolean {
  if (!userRole) return false;
  
  return userRole.toLowerCase() === requiredRole.toLowerCase();
}
