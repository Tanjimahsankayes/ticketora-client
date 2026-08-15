"use client";

import { getUserProfileByUserId, saveUserProfile } from "@/lib/actions/users";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
  process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API ||
  "";

const UserDashboardPage = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // User Profile State
  const [userProfile, setUserProfile] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Mode States
  const [isCreating, setIsCreating] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const user = session?.user;

  // Role Guard: Redirect vendor to vendor dashboard safely
  useEffect(() => {
    if (!isPending && session?.user?.role === "vendor") {
      router.replace("/dashboard/vendor");
    }
  }, [session, isPending, router]);

  const loadUserProfile = useCallback(async () => {
    if (!user?.id) return;
    setFetchingProfile(true);

    try {
      const data = await getUserProfileByUserId(user.id);
      setUserProfile(data);
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setFetchingProfile(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id, loadUserProfile]);

  if (isPending || (user?.id && fetchingProfile)) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <Spinner size="lg" color="primary" label="Loading user profile..." />
      </div>
    );
  }

  // Check if user profile exists in Database
  const hasProfile = Boolean(userProfile?.phone || userProfile?.name);

  // Form populate helper
  const populateFormData = () => {
    setName(userProfile?.name || user?.name || "");
    setPhone(userProfile?.phone || user?.phone || "");
    setAddress(userProfile?.address || "");
    setImagePreview(userProfile?.image || user?.image || "");
    setImageFile(null);
  };

  const handleStartCreate = () => {
    populateFormData();
    setIsCreating(true);
  };

  const handleOpenEdit = () => {
    populateFormData();
    setIsEditOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToImgbb = async (file) => {
    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API Key not found. Please check your .env file.");
    }

    const body = new FormData();
    body.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body,
      },
    );
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error?.message || "Image upload failed");
    }
    return data.data.display_url;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = userProfile?.image || user?.image || "";

      if (imageFile) {
        imageUrl = await uploadImageToImgbb(imageFile);
      }

      const profileData = {
        userId: user?.id,
        name,
        phone,
        address,
        image: imageUrl,
      };

      const res = await saveUserProfile(profileData);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to update profile in database");
      }

      await loadUserProfile();

      setIsCreating(false);
      setIsEditOpen(false);
      toast.success(
        hasProfile
          ? "Profile updated successfully!"
          : "User profile created successfully!",
      );
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return "U";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userProfile?.name || user?.name || "User";
  const displayPhone = userProfile?.phone || "Not set";
  const displayAddress = userProfile?.address || "Not set";
  const displayImage = userProfile?.image || user?.image;

  return (
    <div className="text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-cyan-400">{displayName}</span>{" "}
              👋
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your personal information, contact details, and account
              preferences.
            </p>
          </div>

          {hasProfile && !isCreating && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenEdit}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-600/20 active:scale-95 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* CONDITION 1: INITIAL STATE - Setup Callout */}
        {!hasProfile && !isCreating && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 max-w-xl mx-auto shadow-xl">
            <div className="w-16 h-16 bg-cyan-600/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              👤
            </div>
            <h2 className="text-xl font-bold text-white">
              Complete Your Profile
            </h2>
            <p className="text-sm text-slate-400">
              Your profile is incomplete. Add your contact number and home
              address for a smoother booking experience.
            </p>
            <button
              onClick={handleStartCreate}
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-600/20 active:scale-95"
            >
              Setup Profile Now
            </button>
          </div>
        )}

        {/* CONDITION 2: FORM STATE - Setup Profile Form */}
        {!hasProfile && isCreating && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white">
                Setup Your Personal Profile
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Provide your details below to save your profile.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                      No Image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="+880 1700-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Address / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-md"
                >
                  {loading ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CONDITION 3: PROFILE DISPLAY */}
        {hasProfile && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-3xl font-bold text-white border-2 border-cyan-500/30 shadow-lg">
                    {getInitials(displayName)}
                  </div>
                )}
              </div>

              <div className="flex-1 w-full space-y-4 text-center md:text-left">
                <div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h2 className="text-2xl font-bold text-white">
                      {displayName}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {user?.role || "User"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">{user?.email}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      Phone Number
                    </p>
                    <p className="text-xs font-semibold text-slate-200 mt-1">
                      {displayPhone}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      Address
                    </p>
                    <p className="text-xs font-semibold text-slate-200 mt-1 truncate">
                      {displayAddress}
                    </p>
                  </div>

                  <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] uppercase font-bold text-slate-500">
                      Account Status
                    </p>
                    <p className="text-xs font-semibold text-emerald-400 mt-1">
                      Active Customer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white">Edit User Profile</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 text-xs">
                      No Image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="+880 1700-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Address / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

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
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-50"
                >
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

export default UserDashboardPage;
