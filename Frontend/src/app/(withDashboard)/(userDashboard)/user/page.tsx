"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "next-auth/react";
import Image from "next/image";

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const { user: authUser, logout } = useAuth();

  const user = session?.user || authUser;
  console.log("user", user);
  return (
    <>
      {session?.user && (
        <>
          <h1 className="text-4xl text-center mt-10">
            Welcome {session?.user?.name}
          </h1>
          <h1 className="text-4xl text-center mt-10">
            Logged-in user email: {session?.user?.email}
          </h1>
          <Image
            src={
              session?.user?.image ||
              "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
            }
            width={100}
            height={100}
            alt="user image"
            className="mx-auto rounded-full mt-5"
          />
        </>
      )}
    </>
  );
};

export default DashboardPage;
