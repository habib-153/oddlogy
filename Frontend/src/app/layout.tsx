import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Oddlogy: Learn Skills with Expert-Led Online Courses",
  description:
    "Join Oddlogy for expert-led online courses. Unlock new skills and advance your career with flexible, engaging learning experiences. Start learning today!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html suppressHydrationWarning lang="en" data-theme="light">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <LayoutWrapper session={session}>
          {children}
        </LayoutWrapper>
        <div
          id="button"
          className="fixed bottom-8 right-8 bg-[#D2DD27] w-12 h-12 rounded flex items-center justify-center cursor-pointer opacity-0 invisible transition-all"
        >
          <i className="fas fa-chevron-up text-gray-800"></i>
        </div>
      </body>
    </html>
  );
}