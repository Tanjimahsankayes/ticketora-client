"use client";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Ticket,
  Store,
  Settings,
  LogOut,
  CheckCircle2,
  Camera,
  Edit3,
  X,
  Loader2,
} from "lucide-react";

const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API ||
  process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const ProfilePage = () => {
  const { data: session, isPending, refetch } = useSession();
  const user = session?.user;
  const router = useRouter();

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Edit Modal Open
  const handleOpenEdit = () => {
    setName(user?.name || "");
    setImagePreview(user?.image || "");
    setImageFile(null);
    setIsEditOpen(true);
  };

  // Image File Change Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload image to ImgBB
  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error?.message || "Image upload failed");
    }

    return data.data.display_url || data.data.url;
  };

  // Save Updated Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = user?.image || "";

      // ১. নতুন ছবি সিলেক্ট করলে আগে ImgBB তে আপলোড হবে
      if (imageFile) {
        imageUrl = await uploadImageToImgbb(imageFile);
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

      // ২. Backend API দিয়ে MongoDB / Auth Data আপডেট
      const res = await fetch(`${baseUrl}/api/users/${user?.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image: imageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update profile");
      }

      // ৩. refetch() ডাকার মাধ্যমে Navbar এবং পুরো অ্যাপে নতুন Image/Name অটোমেটিক সিঙ্ক হবে
      if (refetch) {
        await refetch();
      }

      toast.success("Profile updated successfully!");
      setIsEditOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
          router.refresh();
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-gray-400">Please log in to view your profile.</p>
      </div>
    );
  }

  const role = user?.role || "User";

  const getRoleBadgeColor = (userRole) => {
    switch (userRole?.toLowerCase()) {
      case "admin":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "vendor":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar with Camera Icon Overlay */}
            <div
              className="relative group cursor-pointer"
              onClick={handleOpenEdit}
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-indigo-500/30 shadow-lg group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-3xl font-bold ring-4 ring-indigo-500/30 shadow-lg group-hover:opacity-80 transition-opacity">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              {/* Hover Camera Overlay Button */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-7 h-7 text-white" />
              </div>

              <span
                className="absolute bottom-1 right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-slate-900 z-10"
                title="Active Now"
              />
            </div>

            {/* Basic Info */}
            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {user.name || "Ticketora User"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 w-fit mx-auto sm:mx-0 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                    role,
                  )}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {role.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                {user.email}
              </p>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={handleOpenEdit}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-medium text-xs border border-indigo-500/30 transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Information Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-400" /> Account Information
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-800/60">
                  <span className="text-slate-400 text-sm">Full Name</span>
                  <span className="text-slate-200 font-medium text-sm">
                    {user.name || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-800/60">
                  <span className="text-slate-400 text-sm">Email Address</span>
                  <span className="text-slate-200 font-medium text-sm flex items-center gap-2">
                    {user.email}
                    {user.emailVerified && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-slate-800/60">
                  <span className="text-slate-400 text-sm">Role</span>
                  <span className="text-slate-200 font-medium text-sm capitalize">
                    {role}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-400 text-sm">Joined Date</span>
                  <span className="text-slate-200 font-medium text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Action Sidebar */}
          <div className="space-y-6">
            {/* Quick Overview Card */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Overview
              </h3>

              {role.toLowerCase() === "vendor" ? (
                <div className="flex items-center gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Account Type</p>
                    <p className="text-sm font-bold text-white">
                      Event Organizer
                    </p>
                  </div>
                </div>
              ) : role.toLowerCase() === "admin" ? (
                <div className="flex items-center gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Privilege</p>
                    <p className="text-sm font-bold text-white">
                      System Controller
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Account Type</p>
                    <p className="text-sm font-bold text-white">Ticket Buyer</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 backdrop-blur-sm space-y-3">
              <button
                onClick={handleOpenEdit}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 transition-colors text-sm font-medium border border-slate-800"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-400" /> Account
                  Settings
                </span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors text-sm font-medium border border-rose-500/20"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Update Profile</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Profile Image Select Box */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                      No Image
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
