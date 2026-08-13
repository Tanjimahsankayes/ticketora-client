"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { UserDashboardSidebar } from "@/components/dashboard/UserSidebar";

import { useSession } from "@/lib/auth-client";
import React from "react";

const DashboardLayout = ({ children }) => {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const role = session?.user?.role;
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">
      <aside className="w-full md:w-64 md:shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50">
        {role === "vendor" ? <DashboardSidebar /> : <UserDashboardSidebar></UserDashboardSidebar> }
      </aside>
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
