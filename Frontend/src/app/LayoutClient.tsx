"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/sidebar/page";
import EmployeeSidebar from "./components/employee/EmployeeSidebar/page";
import Navbar from "./components/navbar/Navbar";
import styles from "./layout.module.css";

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps) {
  const pathname = usePathname();

  console.log("🔄 Current path:", pathname);

  // Authentication pages - no sidebar/navbar
  const authPages = [
    "/pages/login",
    "/pages/employee/auth/login",
    "/pages/employee/auth/forgot-password",
    "/pages/employee/auth/verify-otp",
    "/pages/employee/auth/reset-password",
    "/pages/employee/auth/success",
  ];

  const isAuthPage = authPages.includes(pathname);

  // Check if it's an employee dashboard page (not auth)
  const isEmployeePage =
    pathname.startsWith("/pages/employee/") &&
    !pathname.includes("/auth/") &&
    pathname !== "/pages/employee" && // root employee path if it exists
    !pathname.endsWith("/employee"); // any other employee root paths

  // Check if it's an admin page
  const isAdminPage =
    pathname.startsWith("/pages/admin/") ||
    (pathname.startsWith("/pages/") &&
      !pathname.startsWith("/pages/employee/") &&
      !pathname.startsWith("/pages/login"));

  console.log("🔐 Is auth page:", isAuthPage);
  console.log("👤 Is employee page:", isEmployeePage);
  console.log("👨‍💼 Is admin page:", isAdminPage);
  console.log(
    "🎯 Rendering sidebar:",
    isEmployeePage ? "EmployeeSidebar" : "Admin Sidebar"
  );

  if (isAuthPage) {
    return <div className={styles.loginContainer}>{children}</div>;
  }

  // For all other pages, render with navbar and appropriate sidebar
  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="px-6 mx-auto max-w-screen-3xl">
          <Navbar />
        </div>
      </div>

      {/* Main layout */}
      <div className="pt-20">
        <div className="flex flex-col min-h-screen  p-5 gap-5">
          <div className="flex flex-1 gap-5">
            {/* Conditional Sidebar */}
            <div className="flex items-start flex-none">
              {isEmployeePage ? <EmployeeSidebar /> : <Sidebar />}
            </div>

            {/* Content container */}
            <div className="flex-1 shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
