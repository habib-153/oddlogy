import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.Google_ID as string,
      clientSecret: process.env.Google_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};
