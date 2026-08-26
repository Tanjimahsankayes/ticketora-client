"use client";

import { getAdminProfileByUserId, saveAdminProfile } from "@/lib/actions/admin";
import { useSession } from "@/lib/auth-client";
import { PencilToSquare, Shield } from "@gravity-ui/icons";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

const AdminDashboardPage = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const user = session?.user;

  // Role Guard: Ensure only admin can access
  useEffect(() => {
    if (!isPending && session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  const loadAdminProfile = useCallback(async () => {
    if (!user?.id) return;
    setFetchingProfile(true);

    try {
      const data = await getAdminProfileByUserId(user.id);
      setAdminProfile(data);
    } catch (err) {
      console.error("Failed to load admin profile:", err);
    } finally {
      setFetchingProfile(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      loadAdminProfile();
    }
  }, [user?.id, loadAdminProfile]);

  if (isPending || (user?.id && fetchingProfile)) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <Spinner size="lg" color="danger" label="Loading admin panel..." />
      </div>
    );
  }

  // Populate helper
  const populateFormData = () => {
    setName(adminProfile?.name || user?.name || "");
    setPhone(adminProfile?.phone || user?.phone || "");
    setDesignation(adminProfile?.designation || "Super Admin");
    setImagePreview(adminProfile?.image || user?.image || "");
    setImageFile(null);
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
      let imageUrl = adminProfile?.image || user?.image || "";

      if (imageFile) {
        imageUrl = await uploadImageToImgbb(imageFile);
      }

      const profileData = {
        userId: user?.id,
        name,
        phone,
        designation,
        image: imageUrl,
      };

      const res = await saveAdminProfile(profileData);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to update admin profile");
      }

      await loadAdminProfile();
      setIsEditOpen(false);
      toast.success("Admin profile updated successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (nameStr) => {
    if (!nameStr) return "AD";
    return nameStr
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = adminProfile?.name || user?.name || "Admin User";
  const displayPhone = adminProfile?.phone || "Not set";
  const displayDesignation =
    adminProfile?.designation || "System Administrator";
  const displayImage = adminProfile?.image || user?.image;

  return (
    <div className="min-h-screen text-slate-700 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                Admin Control Panel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Admin Profile:{" "}
              <span className="text-rose-600 dark:text-rose-500">{displayName}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage system administrator details, security clearance, and
              authority rights.
            </p>
          </div>

          <button
            onClick={handleOpenEdit}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-600/20 active:scale-95 flex items-center gap-2 self-start sm:self-auto"
          >
            <PencilToSquare size={20} ></PencilToSquare>
            Edit Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={displayName}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-rose-500/40 shadow-xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-rose-600 to-purple-800 flex items-center justify-center text-3xl font-bold text-white border-2 border-rose-500/40 shadow-xl">
                  {getInitials(displayName)}
                </div>
              )}
              <span
                className="absolute -bottom-2 -right-2 bg-rose-600 text-white p-1 rounded-lg text-xs shadow-md"
                title="Super Admin"
              >
                <Shield></Shield>
              </span>
            </div>

            <div className="flex-1 w-full space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {displayName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
                    {user?.role || "ADMIN"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{user?.email}</p>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <div className="bg-slate-100 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">
                    Designation
                  </p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {displayDesignation}
                  </p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">
                    Phone Contact
                  </p>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {displayPhone}
                  </p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-950/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
                  <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">
                    Access Level
                  </p>
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1">
                    Full System Authority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extra Section: Quick System Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-2">
              <span>⚡</span> Permissions & Control
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> Manage All User
                Accounts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> Approve Vendor
                Approvals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span> System Logs & Audit
                Control
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider flex items-center gap-2">
              <span>🔒</span> Security Log
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <p>
                Last Password Reset:{" "}
                <span className="text-slate-800 dark:text-slate-200">2 weeks ago</span>
              </p>
              <p>
                2FA Authentication:{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active</span>
              </p>
              <p>
                Session State:{" "}
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Encrypted</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Edit Admin Profile
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Update your personal admin details.
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-2">
                  Profile Avatar
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-300 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-500 text-xs">
                      No Image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-600 file:text-white hover:file:bg-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Chief Admin / Operations Head"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="+880 1700-000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold disabled:opacity-50 transition-all shadow-md"
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

export default AdminDashboardPage;
