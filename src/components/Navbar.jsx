"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars, Xmark, Person, ChevronDown, MapPin } from "@gravity-ui/icons";
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
    <header className="sticky top-0 w-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 text-sm font-medium text-slate-800 dark:text-slate-200 z-50 transition-colors duration-200 shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 text-slate-900 dark:text-white transition-all"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 text-white p-1.5 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all">
            <img
              src="/images/nav.png"
              alt="navImg"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Ticketora Title with MapPin icon as 'o' */}
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent flex items-center gap-[1px]">
            Ticket
            <span className="inline-flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-bounce duration-1000 -mt-1 mx-[1px]">
              <MapPin className="w-5 h-5 stroke-[2.5]" />
            </span>
            ra
          </span>
        </Link>

        {/* Center/Right: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-900/60 p-1.5 rounded-full border border-slate-200 dark:border-slate-800/80">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/80 shadow-none hover:shadow-sm transition-all duration-200 font-semibold text-xs sm:text-sm"
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
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700/50"></div>
          ) : user ? (
            /* User Profile Dropdown */
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 focus:outline-none transition-all group"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Profile"}
                    width={32}
                    height={32}
                    unoptimized
                    className="w-8 h-8 rounded-full object-cover border border-violet-500/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-slate-300 group-hover:border-violet-500/50 transition-colors">
                    <Person className="w-4 h-4" />
                  </div>
                )}
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 hidden lg:inline-block pr-1">
                  {user.name}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                    profileDropdownOpen
                      ? "rotate-180 text-violet-600 dark:text-violet-400"
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
                  ></div>

                  <div className="absolute right-0 mt-3 w-60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 text-sm z-20 origin-top-right overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 mb-1 bg-slate-50/80 dark:bg-slate-950/40">
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
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors font-medium"
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
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
                        <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
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
                className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white font-semibold transition-colors duration-150 px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/50"
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
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 transition-colors"
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
            className="fixed inset-0 top-16 bg-slate-950/30 dark:bg-slate-950/70 backdrop-blur-md z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="absolute top-16 left-0 w-full md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-6 py-6 flex flex-col gap-6 z-50 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-base font-semibold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-800/80" />

            {/* Mobile Auth Options */}
            {isAuthPending ? (
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User Profile"}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-10 h-10 rounded-full object-cover border border-violet-500/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-slate-300">
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
                  className="flex items-center gap-3 text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-white px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors font-medium"
                >
                  <Person className="w-4 h-4 text-indigo-600 dark:text-violet-400" />
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
