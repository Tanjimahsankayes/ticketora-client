"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Car,
  Plane,
  Envelope,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeSlash,
} from "@gravity-ui/icons";
import { FaTrainSubway } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 1. Handle Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.email(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: async (ctx) => {
            toast.success("Logged in successfully!");

            // সেশন ডাটা থেকে ইউজার রোল চেক করা
            const role = ctx.data?.user?.role;

            if (role === "admin") {
              window.location.href = "/dashboard/admin";
            } else if (role === "vendor") {
              window.location.href = "/dashboard/vendor";
            } else {
              window.location.href = "/dashboard";
            }
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Invalid email or password");
            setLoading(false);
          },
        },
      );
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // 2. Handle Google Social Login
  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard", // সোশ্যাল লগইনের জন্য রিডাইরেক্ট
      });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      setGoogleLoading(false);
    }
  };

  const modernFeatures = [
    { icon: Car, text: "Seamless Bus Bookings" },
    { icon: FaTrainSubway, text: "Rapid Train Reservations" },
    { icon: Plane, text: "Easy Flight Ticketing" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08090a] flex text-slate-700 dark:text-zinc-300 theme-transition">
      {/* LEFT SIDE: Hero / Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-between border-r border-slate-200 dark:border-white/5 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/signupBg.png')" }}
      >
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white dark:bg-slate-800 text-black dark:text-white p-1.5 shadow-lg">
              <Car className="w-7 h-7" />
            </div>
            <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">
              TicketTora
            </span>
          </Link>

          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tighter mb-6">
            Welcome Back <br /> To TicketTora.
          </h1>
          <p className="text-lg text-slate-600 dark:text-zinc-400 leading-relaxed max-w-md">
            Sign in to access your booked tickets, check schedule updates, and
            plan your next destination seamlessly.
          </p>
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-8">
            {modernFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="p-4 bg-slate-200 dark:bg-zinc-900 border border-slate-300 dark:border-white/5 rounded-2xl text-slate-800 dark:text-white">
                  <feature.icon className="w-8 h-8" />
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-500 font-medium max-w-[100px]">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-600 font-medium">
            Trusted by thousands of travelers across the country.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 md:px-16 lg:px-20">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden flex-col items-center mb-10 text-center">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-slate-800 text-black dark:text-white p-1">
                <Car className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                TicketTora
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1.5">
              Please enter your details to log in.
            </p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Sign In
            </h2>
            <p className="text-base text-slate-600 dark:text-zinc-400 mt-2">
              Enter your credentials to access your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full bg-white dark:bg-[#111215] hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-xl border border-slate-200 dark:border-white/10 text-base flex items-center justify-center gap-3 transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <FaGoogle className="w-5 h-5 text-slate-900 dark:text-white" />
            <span>
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </span>
          </button>

          <div className="flex items-center gap-4 my-6">
            <div className="h-[1px] w-full bg-slate-200 dark:bg-white/10" />
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-semibold shrink-0">
              Or with email
            </span>
            <div className="h-[1px] w-full bg-slate-200 dark:bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-zinc-600">
                  <Envelope className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-[#111215] border border-slate-200 dark:border-white/10 rounded-xl text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-slate-400 dark:focus:border-white/20 focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 dark:text-zinc-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-white dark:bg-[#111215] border border-slate-200 dark:border-white/10 rounded-xl text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:border-slate-400 dark:focus:border-white/20 focus:ring-1 focus:ring-slate-200 dark:focus:ring-white/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 dark:text-zinc-600 hover:text-slate-700 dark:hover:text-zinc-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlash className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-6 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2.5 transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-slate-900 dark:text-white hover:underline font-medium ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
