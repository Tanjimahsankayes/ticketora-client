"use client";

import Link from "next/link";
import { ShieldKeyhole, Lock, House } from "@gravity-ui/icons";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-300 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 space-y-8 py-12">
        {/* Glowing Badge & 403 Visual */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Error 403 - Access Denied</span>
          </div>

          <h1 className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 tracking-tight select-none">
            403
          </h1>
        </div>

        {/* Message Content */}
        <div className="space-y-3 max-w-md mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Restricted Area
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            You don't have permission to access this page or resource. Please
            check your credentials or log in with an authorized account.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-zinc-200 text-black font-semibold py-3.5 px-7 rounded-xl text-sm transition-all duration-150 shadow-xl hover:scale-105 active:scale-95"
          >
            <House className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/auth/singin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#111215] hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-white font-semibold py-3.5 px-7 rounded-xl text-sm transition-all duration-150 active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>Log In</span>
          </Link>
        </div>

        {/* Help Link Footer */}
        <div className="pt-8 border-t border-white/5 text-xs text-zinc-500">
          Think this is a mistake?{" "}
          <Link
            href="/contact"
            className="text-zinc-300 underline hover:text-white transition-colors"
          >
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}
