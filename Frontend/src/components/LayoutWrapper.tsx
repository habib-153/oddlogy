"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Providers from "@/contexts/Provider";
import QueryProvider from "@/contexts/QueryProvider";

interface LayoutWrapperProps {
  children: React.ReactNode;
  session: any;
}

const LayoutWrapper = ({ children, session }: LayoutWrapperProps) => {
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isDashboardPage =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/instructor");

  if (isAuthPage) {
    return <Providers session={session}>{children}</Providers>;
  }

  if (isDashboardPage) {
    return (
      <QueryProvider>
        <Providers session={session}>{children}</Providers>
      </QueryProvider>
    );
  }

  return (
    <QueryProvider>
      <Providers session={session}>
        <Navbar />
        <div className="min-h-screen w-[95%] mx-auto">{children}</div>
      </Providers>
    </QueryProvider>
  );
};

export default LayoutWrapper;