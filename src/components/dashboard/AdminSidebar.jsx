"use client";

import { useState } from "react";
import {
  Person,
  Ticket,
  Persons,
  Megaphone,
  LayoutSideContent,
  ShieldCheck,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

export function AdminDashboardSidebar() {
  const [activeItem, setActiveItem] = useState("Admin Profile");

  const navItems = [
    {
      icon: Person,
      label: "Admin Profile",
      href: "/dashboard/admin",
      color: "from-amber-500 to-orange-400",
      glow: "group-hover:shadow-amber-500/30",
    },
    {
      icon: Ticket,
      label: "Manage Tickets",
      href: "/dashboard/admin/manage",
      color: "from-emerald-500 to-teal-400",
      glow: "group-hover:shadow-emerald-500/30",
    },
    {
      icon: Persons,
      label: "Manage Users",
      href: "/dashboard/admin/manage/manage-users",
      color: "from-indigo-500 to-violet-400",
      glow: "group-hover:shadow-indigo-500/30",
    },
    {
      icon: Megaphone,
      label: "Advertise Tickets",
      href: "/dashboard/admin/manage/manage-users/advertise",
      color: "from-rose-500 to-pink-400",
      glow: "group-hover:shadow-rose-500/30",
    },
  ];

  const navContent = (
    <nav className="flex flex-col gap-2 p-2 min-h-screen">
      {navItems.map((item) => {
        const isActive = activeItem === item.label;
        const Icon = item.icon;

        return (
          <Link
            href={item.href}
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3.5 text-sm font-medium transition-all duration-300 ease-out ${isActive
                ? "bg-slate-900/90 text-white shadow-xl shadow-black/40 border border-slate-700/80 backdrop-blur-md"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-100 hover:translate-x-1"
              }`}
          >
            {/* Active Glow Light */}
            {isActive && (
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1.5 rounded-r-full bg-gradient-to-b ${item.color} shadow-lg shadow-amber-500/50`}
              />
            )}

            {/* Icon Box with Premium Gradient */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${isActive
                  ? `bg-gradient-to-tr ${item.color} text-white shadow-lg shadow-black/50 scale-105`
                  : `bg-slate-900/80 text-slate-400 border border-slate-800/80 group-hover:border-slate-700 group-hover:text-slate-100 ${item.glow}`
                }`}
            >
              <Icon className="size-5" />
            </div>

            {/* Label */}
            <span className="tracking-wide font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-800/80 p-4 lg:block min-h-screen">
        {/* Header Section */}
        <div className="mb-6 px-2 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="size-4" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Admin Panel
            </h2>
          </div>
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
            Pro
          </span>
        </div>

        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-4" />

        {navContent}
      </aside>

      {/* Mobile Drawer */}
      <Drawer>
        <Button
          className="lg:hidden bg-slate-900 border border-amber-500/20 text-amber-400 hover:bg-slate-800"
          variant="secondary"
        >
          <LayoutSideContent className="size-4" />
          Admin Menu
        </Button>
        <Drawer.Backdrop>
          <Drawer.Content
            placement="left"
            className="bg-slate-950 border-r border-slate-800"
          >
            <Drawer.Dialog className="bg-slate-950 text-slate-100">
              <Drawer.CloseTrigger />
              <Drawer.Header className="border-b border-slate-800/60 pb-3">
                <Drawer.Heading className="text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="size-4 text-amber-400" />
                  Admin Controls
                </Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body className="pt-4">{navContent}</Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
    </>
  );
}
