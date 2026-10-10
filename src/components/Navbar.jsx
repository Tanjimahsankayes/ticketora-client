"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars, Xmark, Person, ChevronDown } from "@gravity-ui/icons";
import { PiSignOutThin } from "react-icons/pi";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session, isPending } = useSession();
  const user = session?.user;

  const isAuthPending = !mounted || isPending;

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "All Tickets", href: "/all-tickets" },
  ];

  const navLinks =
    mounted && user
      ? [...baseNavLinks, { name: "Dashboard", href: "/dashboard/vendor" }]
      : baseNavLinks;

  const handleSignOut = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 text-sm font-medium z-50 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo (Optimized for Light/Dark Mode Visibility) */}
        <Link
          href="/"
          aria-label="Ticketora Home"
          className="group flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center rounded-xl bg-slate-900/5 dark:bg-white/95 px-2.5 py-1 backdrop-blur-sm border border-slate-200/50 dark:border-white transition-all shadow-sm">
            <Image
              src="/images/TicketoraLogo.png"
              alt="Ticketora"
              width={160}
              height={36}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>
        </Link>

        {/* Center/Right: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-5">
          <nav className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-none hover:shadow-sm transition-all duration-200 font-semibold text-xs sm:text-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Theme Toggle (Desktop) */}
          <ThemeToggle />

          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800" />

          {/* Conditional Auth / User Section */}
          {isAuthPending ? (
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700" />
          ) : user ? (
            /* User Profile Dropdown */
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 focus:outline-none transition-all group"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Profile"}
                    width={32}
                    height={32}
                    unoptimized
                    className="w-8 h-8 rounded-full object-cover border border-teal-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300 group-hover:border-teal-500 transition-colors">
                    <Person className="w-4 h-4" />
                  </div>
                )}
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 hidden lg:inline-block">
                  {user.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                    profileDropdownOpen
                      ? "rotate-180 text-teal-600 dark:text-teal-400"
                      : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileDropdownOpen(false)}
                  />

                  <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl py-2 text-sm z-20 origin-top-right overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 mb-1 bg-slate-50/60 dark:bg-slate-950/40">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    <div className="px-1.5 py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors font-medium"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-teal-700 dark:text-teal-400">
                          <Person className="w-4 h-4" />
                        </div>
                        My Profile
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 mt-1 pt-1 px-1.5">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-medium"
                      >
                        <div className="p-1.5 rounded-lg bg-rose-100/60 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                          <PiSignOutThin className="w-4 h-4" />
                        </div>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Logged Out Buttons */
            <div className="flex items-center gap-3">
              <Link
                href="/auth/signin"
                className="text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white font-semibold transition-colors duration-150 px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60"
              >
                Log in
              </Link>

              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-5 py-2 rounded-full transition-all duration-200 text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02]"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Controls (Theme Toggle + Hamburger) */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white focus:outline-none p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <Xmark className="w-6 h-6" />
            ) : (
              <Bars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-slate-950/40 dark:bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="absolute top-16 left-0 w-full md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-6 flex flex-col gap-6 z-50 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-base font-semibold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-800" />

            {/* Mobile Auth Options */}
            {isAuthPending ? (
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Profile"}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-10 h-10 rounded-full object-cover border border-teal-500/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-700 dark:text-teal-300">
                      <Person className="w-5 h-5" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <span className="font-semibold text-slate-900 dark:text-white block truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors font-medium"
                >
                  <Person className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  My Profile
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 text-left text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-medium"
                >
                  <PiSignOutThin className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-3 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-base font-semibold"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all text-base shadow-lg shadow-indigo-500/20"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}
