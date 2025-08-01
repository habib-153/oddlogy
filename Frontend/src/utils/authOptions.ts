import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.Google_ID!,
      clientSecret: process.env.Google_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Send user data to your backend
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google`,
            {
              googleUserData: {
                email: user.email,
                name: user.name,
                picture: user.image,
                sub: profile?.sub,
              },
            }
          );
console.log("Response from backend after Google sign-in:", response.data);
          if (response.data.success) {
            console.log("User created/updated successfully:", response.data.data.accessToken);
            // Store the JWT token for later use
            user.accessToken = response.data.data.accessToken;
            user.role = response.data.data.user.role;
            user.id = response.data.data.user._id;
            return true;
          }
        } catch (error) {
          console.error("Error creating/updating Google user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   // Handle post-login redirects based on user role
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profilePhoto?: string;
      role?: string;
    };
    accessToken?: string;
  }

  interface User {
    role?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    accessToken?: string;
  }
}