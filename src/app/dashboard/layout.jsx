import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100">

      <aside className="w-full md:w-64 md:shrink-0 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50">
        <DashboardSidebar />
      </aside>
      <main className="flex-1 w-full min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;