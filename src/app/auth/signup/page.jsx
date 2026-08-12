"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Car,
  Plane,
  Person,
  Envelope,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeSlash,
  Shield,
} from "@gravity-ui/icons";
import { FaTrainSubway } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Better Auth handles saving to MongoDB & logging in automatically
      const { data, error: authError } = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role, // Pass selected role
      });

      if (authError) {
        throw new Error(authError.message || "Failed to create account");
      }

      toast.success("Ticketora account created successfully!");
      // On success, redirect to Home page
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const modernFeatures = [
    { icon: Car, text: "Seamless Bus Bookings" },
    { icon: FaTrainSubway, text: "Rapid Train Reservations" },
    { icon: Plane, text: "Easy Flight Ticketing" },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] flex text-zinc-300">
      <div
        className="hidden lg:flex lg:w-1/2 p-16 flex-col justify-between border-r border-white/5 relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/signupBg.png')" }}
      >
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-10">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white text-black p-1.5 shadow-lg">
              <Car className="w-7 h-7" />
            </div>
            <span className="font-bold text-2xl text-white tracking-tight">
              TicketTora
            </span>
          </Link>

          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tighter mb-6">
            Your Journey <br /> Starts Here.
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-md">
            Book tickets seamlessly for Bus, Train, Launch & Flight. Secure,
            fast, and reliable platform trusted by thousands.
          </p>
        </div>

        {/* Bottom Section: Feature Icons & Trust */}
        <div className="relative z-10 space-y-10">
          <div className="flex items-center gap-8">
            {modernFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl text-white">
                  <feature.icon className="w-8 h-8" />
                </div>
                <span className="text-xs text-zinc-500 font-medium max-w-[100px]">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-zinc-600 font-medium">
            Trusted by thousands of travelers across the country.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 md:px-16 lg:px-20">
        <div className="w-full max-w-md">
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden flex-col items-center mb-10 text-center">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-black p-1">
                <Car className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                TicketTora
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Create Your Account
            </h2>
            <p className="text-sm text-zinc-400 mt-1.5">
              Fill in the details below to register and start booking.
            </p>
          </div>

          {/* Desktop Header (Visible only on large screens) */}
          <div className="hidden lg:block mb-10">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Create Your Account
            </h2>
            <p className="text-base text-zinc-400 mt-2">
              Fill in the details below to register.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                  <Person className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-[#111215] border border-white/10 rounded-xl text-base text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                  <Envelope className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-[#111215] border border-white/10 rounded-xl text-base text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                />
              </div>
            </div>

            {/* Role Select Option */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Join As
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                  <Shield className="w-5 h-5" />
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-[#111215] border border-white/10 rounded-xl text-base text-white focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="user" className="bg-[#111215] text-white">
                    User (Book Tickets)
                  </option>
                  <option value="vendor" className="bg-[#111215] text-white">
                    Vendor (Manage & Sell Tickets)
                  </option>
                </select>
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-[#111215] border border-white/10 rounded-xl text-base text-white placeholder-zinc-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                />
                {/* Password Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-zinc-400 transition-colors"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-white hover:bg-zinc-200 text-black font-semibold py-3 px-6 rounded-xl text-base flex items-center justify-center gap-2.5 transition-all duration-150 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-white hover:underline font-medium ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
