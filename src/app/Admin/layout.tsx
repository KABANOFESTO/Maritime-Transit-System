"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/components/admincomponents/Navbar";
import StaffSideBar from "@/components/admincomponents/Sidebar";

interface UserProfile {
    username: string;
    email: string;
    role: string;
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [userProfile] = useState<UserProfile | null>({
        username: "admin",
        email: "admin@example.com",
        role: "admin"
    });

    // Render Admin Panel
    return (
        <div className="flex flex-row w-full min-h-screen lg:w-[90%] bg-none">
            <StaffSideBar />
            <div className="flex flex-col ml-auto w-full lg:w-[78%]">
                <Navbar onSearch={(query: string) => { /* handle search here */ }} />
                {children}
            </div>
        </div>
    );
}