"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Providers from "@/contexts/Provider";

interface LayoutWrapperProps {
    children: React.ReactNode;
    session: any;
}

const LayoutWrapper = ({ children, session }: LayoutWrapperProps) => {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (isAuthPage) {
        return (
            <Providers session={session}>
                {children}
            </Providers>
        );
    }

    return (
        <Providers session={session}>
            <Navbar />
            <div className="min-h-screen w-[95%] mx-auto">{children}</div>
        </Providers>
    );
};

export default LayoutWrapper;
