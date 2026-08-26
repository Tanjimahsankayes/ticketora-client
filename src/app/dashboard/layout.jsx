"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { UserDashboardSidebar } from "@/components/dashboard/UserSidebar";
import { AdminDashboardSidebar } from "@/components/dashboard/AdminSidebar";

const DashboardLayout = ({ children }) => {
  const { data: session, isPending } = useSession();

  const role = session?.user?.role;

  // Render sidebar based on user role
  const renderSidebar = () => {
    if (isPending) {
      return (
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="relative flex items-center justify-center">
            {/* Outer pulse */}
            <div className="absolute h-16 w-16 animate-ping rounded-full border-2 border-indigo-500/20" />

            {/* Spinner */}
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-b-indigo-500/10 border-l-indigo-500/50 border-r-indigo-500/30 border-t-indigo-500" />
          </div>
        </div>
      );
    }

    switch (role) {
      case "admin":
        return <AdminDashboardSidebar />;

      case "vendor":
        return <DashboardSidebar />;

      case "user":
      default:
        return <UserDashboardSidebar />;
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-50 text-[#115E59] antialiased selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100 md:flex-row">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-left glow */}
        <div className="absolute -left-[10%] -top-[10%] h-[45%] w-[45%] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/5" />

        {/* Bottom-right glow */}
        <div className="absolute -right-[10%] top-[60%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-500/5" />
      </div>

      {/* side bar */}
      <aside className="relative z-20 w-full shrink-0 border-b border-slate-200 bg-white backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/60 md:sticky md:top-0 md:w-72 md:border-b-0 md:border-r">
        {renderSidebar()}
      </aside>

      <main className="relative z-10 min-w-0 flex-1 transition-all duration-300">
        <div>{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
