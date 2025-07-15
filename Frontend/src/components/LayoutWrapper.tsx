"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

interface LayoutWrapperProps {
    children: React.ReactNode;
    session: any;
}

const LayoutWrapper = ({ children, session }: LayoutWrapperProps) => {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar session={session} />
            <div className="min-h-screen w-[95%] mx-auto">{children}</div>
        </>
    );
};

export default LayoutWrapper;
