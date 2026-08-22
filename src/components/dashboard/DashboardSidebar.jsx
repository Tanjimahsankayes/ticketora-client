"use client";

import { useState } from "react";
import {
  LayoutSideContent,
  Plus,
  ListUl,
  ChartLineArrowUp,
  BookmarkFill,
  Person,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

export function DashboardSidebar() {
  const [activeItem, setActiveItem] = useState("Profile");

  const navItems = [
    {
      icon: Person,
      label: "Profile",
      href: "/dashboard/vendor",
      color: "from-blue-500 to-cyan-400",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      icon: Plus,
      label: "Add Tickets",
      href: "/dashboard/vendor/tickets/new",
      color: "from-emerald-500 to-teal-400",
      glow: "group-hover:shadow-emerald-500/20",
    },
    {
      icon: ListUl,
      label: "My Added Tickets",
      href: "/dashboard/vendor/tickets",
      color: "from-violet-500 to-purple-400",
      glow: "group-hover:shadow-violet-500/20",
    },
    {
      icon: BookmarkFill,
      label: "Requested Bookings",
      href: "/dashboard/vendor/tickets/reqbook",
      color: "from-amber-500 to-orange-400",
      glow: "group-hover:shadow-amber-500/20",
    },
    {
      icon: ChartLineArrowUp,
      label: "Revenue Overview",
      href: "/dashboard/vendor/tickets/revenue",
      color: "from-rose-500 to-pink-400",
      glow: "group-hover:shadow-rose-500/20",
    },
  ];

  const navContent = (
    <nav className="flex flex-col gap-1.5 p-2">
      {navItems.map((item) => {
        const isActive = activeItem === item.label;
        const Icon = item.icon;

        return (
          <Link
            href={item.href}
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={`group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-300 ease-out ${
              isActive
                ? "bg-slate-800/80 dark:bg-slate-800/80 text-white shadow-lg shadow-black/20 border border-slate-700/60 dark:border-slate-700/60"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-200 hover:translate-x-1"
            }`}
          >
            {/* Active Accent Indicator */}
            {isActive && (
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b ${item.color}`}
              />
            )}

            {/* Icon Container with Gradient Accent */}
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-tr ${item.color} text-white shadow-md shadow-black/40`
                  : `bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-800 group-hover:text-slate-900 dark:group-hover:text-slate-100 ${item.glow}`
              }`}
            >
              <Icon className="size-4.5" />
            </div>

            <span className="tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar View */}
      <div className="hidden md:block p-3">
        <div className="mb-6 px-3.5 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Dashboard
          </h2>
        </div>
        {navContent}
      </div>

      {/* Mobile Drawer View */}
      <div className="p-4 md:hidden">
        <Drawer>
          <Button
            className="w-full justify-start bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
            variant="secondary"
          >
            <LayoutSideContent className="size-4" />
            Sidebar Menu
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content
              placement="left"
              className="bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800"
            >
              <Drawer.Dialog className="bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-100">
                <Drawer.CloseTrigger />
                <Drawer.Header className="border-b border-slate-200 dark:border-slate-800/60 pb-3">
                  <Drawer.Heading className="text-slate-800 dark:text-slate-200">
                    Menu
                  </Drawer.Heading>
                </Drawer.Header>
                <Drawer.Body className="pt-4">{navContent}</Drawer.Body>
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}
