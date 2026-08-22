"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { UserDashboardSidebar } from "@/components/dashboard/UserSidebar";
import { AdminDashboardSidebar } from "@/components/dashboard/AdminSidebar";

const DashboardLayout = ({ children }) => {
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;

  // Premium & Modern Loading State
  if (isPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 theme-transition">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-2 border-indigo-500/20 animate-ping" />
          <div className="h-12 w-12 rounded-full border-2 border-t-indigo-500 border-r-indigo-500/30 border-b-indigo-500/10 border-l-indigo-500/50 animate-spin" />
        </div>
        <p className="mt-4 text-xs font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  // Determine Sidebar based on User Role
  const renderSidebar = () => {
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
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white flex flex-col md:flex-row overflow-x-hidden theme-transition">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[45%] h-[45%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 dark:bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Sidebar Section */}
      <aside className="relative z-20 w-full md:w-72 md:shrink-0 md:sticky md:top-0 md:h-screen border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 backdrop-blur-xl transition-all duration-300">
        {renderSidebar()}
      </aside>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 min-w-0 sm:p-6 lg:p-8 xl:p-10 transition-all duration-300">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
