"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";

export default function ManageUsersPage() {
  // 1. ALL Hooks defined at the top level
  const { data: session, isPending } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedFraudVendor, setSelectedFraudVendor] = useState(null);

  // Role Guard: Ensure only admin can access
  useEffect(() => {
    if (!isPending && session?.user?.role !== "admin") {
      window.location.href = "/dashboard";
    }
  }, [session, isPending]);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      if (session?.user?.role === "admin") {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
          const res = await fetch(`${baseUrl}/api/users`, {
            cache: "no-store",
          });
          if (res.ok) {
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
          } else {
            toast.error("Failed to load users");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Error loading users");
        } finally {
          setLoading(false);
        }
      }
    };

    if (!isPending) {
      fetchUsers();
    }
  }, [session, isPending]);

  // Event Handlers
  const handleMakeAdmin = async (userId) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "admin" }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId || user.id === userId
              ? { ...user, role: "Admin", isFraud: false }
              : user,
          ),
        );
        toast.success("User promoted to admin");
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role");
    }
  };

  const handleMakeVendor = async (userId) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "vendor" }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId || user.id === userId
              ? { ...user, role: "Vendor", isFraud: false }
              : user,
          ),
        );
        toast.success("User promoted to vendor");
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Error updating user role");
    }
  };

  const handleConfirmFraud = async () => {
    if (!selectedFraudVendor) return;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
      const userId = selectedFraudVendor._id || selectedFraudVendor.id;
      const res = await fetch(`${baseUrl}/api/users/${userId}/fraud`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFraud: true }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId || user.id === userId
              ? {
                  ...user,
                  isFraud: true,
                  ticketsCount: 0,
                }
              : user,
          ),
        );
        setSelectedFraudVendor(null);
        toast.success("User marked as fraudulent");
      } else {
        toast.error("Failed to mark user as fraudulent");
      }
    } catch (error) {
      console.error("Error marking user as fraudulent:", error);
      toast.error("Error marking user as fraudulent");
    }
  };

  // Filter Logic
  const filteredUsers = users.filter((user) => {
    const userName = user.name || "";
    const userEmail = user.email || "";
    const matchesSearch =
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedRole === "ALL") return matchesSearch;
    if (selectedRole === "FRAUD") return matchesSearch && user.isFraud;
    const userRole = (user.role || "").toLowerCase();
    return (
      matchesSearch && !user.isFraud && userRole === selectedRole.toLowerCase()
    );
  });

  // 2. Early Return AFTER all Hook calls
  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <Spinner size="lg" color="primary" label="Loading users..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 font-sans p-4 sm:p-6 md:p-10 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Card Container */}
        <div className=" backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase">
                Manage Users
              </h1>
              <p className="text-xs font-semibold tracking-wider text-slate-400 mt-1 uppercase">
                {users.length} Total Users
              </p>
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e2736] text-slate-200 placeholder-slate-500 text-sm rounded-xl pl-9 pr-4 py-2 border border-slate-700/60 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <svg
                  className="w-4 h-4 text-slate-500 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Filter Dropdown */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-[#1e2736] text-slate-200 text-sm rounded-xl px-4 py-2 border border-slate-700/60 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admins</option>
                <option value="VENDOR">Vendors</option>
                <option value="CUSTOMER">Customers</option>
                <option value="FRAUD">Fraud Flagged</option>
              </select>
            </div>
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto mt-4">
            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const userId = user._id || user.id;
                    const userRole = (user.role || "").toLowerCase();
                    const isAdmin = userRole === "admin" && !user.isFraud;
                    const isVendor = userRole === "vendor" && !user.isFraud;
                    const userAvatar =
                      user.avatar ||
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || "User",
                      )}&background=random`;

                    return (
                      <tr
                        key={userId}
                        className="bg-[#1a2332]/60 hover:bg-[#1f2a3c] transition-colors rounded-xl border border-slate-800/40"
                      >
                        <td className="px-4 py-3.5 rounded-l-xl">
                          <div className="flex items-center gap-3">
                            <img
                              src={userAvatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm"
                            />
                            <span className="font-semibold text-slate-100">
                              {user.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 text-slate-400 font-normal">
                          {user.email}
                        </td>

                        <td className="px-4 py-3.5">
                          {user.isFraud ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />{" "}
                              Fraud Vendor
                            </span>
                          ) : (
                            <span className="text-slate-300 font-medium capitalize">
                              {user.role || "User"}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right rounded-r-xl">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleMakeAdmin(userId)}
                              disabled={isAdmin}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                isAdmin
                                  ? "bg-indigo-600/40 text-indigo-300/50 cursor-not-allowed"
                                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95"
                              }`}
                            >
                              Make Admin
                            </button>

                            <button
                              onClick={() => handleMakeVendor(userId)}
                              disabled={isVendor}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                isVendor
                                  ? "bg-sky-600/40 text-sky-300/50 cursor-not-allowed"
                                  : "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20 active:scale-95"
                              }`}
                            >
                              Make Vendor
                            </button>

                            {userRole === "vendor" && (
                              <button
                                onClick={() => setSelectedFraudVendor(user)}
                                disabled={user.isFraud}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                  user.isFraud
                                    ? "bg-red-600/30 text-red-300/40 border border-red-500/20 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-95"
                                }`}
                              >
                                {user.isFraud
                                  ? "Flagged Fraud"
                                  : "Mark as Fraud"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-10 text-slate-500 text-sm"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="block md:hidden mt-4 space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const userId = user._id || user.id;
                const userRole = (user.role || "").toLowerCase();
                const isAdmin = userRole === "admin" && !user.isFraud;
                const isVendor = userRole === "vendor" && !user.isFraud;
                const userAvatar =
                  user.avatar ||
                  user.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || "User",
                  )}&background=random`;

                return (
                  <div
                    key={userId}
                    className="bg-[#1a2332] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={userAvatar}
                        alt={user.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-slate-700 shadow-md"
                      />
                      <div>
                        <h3 className="font-bold text-white text-base">
                          {user.name}
                        </h3>
                        <p className="text-xs text-slate-400">{user.email}</p>
                        <div className="mt-1">
                          {user.isFraud ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                              Fraud Vendor
                            </span>
                          ) : (
                            <span className="text-xs text-indigo-400 font-semibold capitalize">
                              {user.role || "User"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Actions
                      </p>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleMakeAdmin(userId)}
                          disabled={isAdmin}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                            isAdmin
                              ? "bg-indigo-600/30 text-indigo-300/40 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                          }`}
                        >
                          Make Admin
                        </button>

                        <button
                          onClick={() => handleMakeVendor(userId)}
                          disabled={isVendor}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                            isVendor
                              ? "bg-sky-600/30 text-sky-300/40 cursor-not-allowed"
                              : "bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20"
                          }`}
                        >
                          Make Vendor
                        </button>

                        {userRole === "vendor" && (
                          <button
                            onClick={() => setSelectedFraudVendor(user)}
                            disabled={user.isFraud}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                              user.isFraud
                                ? "bg-red-600/20 text-red-400/40 border border-red-500/20 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20"
                            }`}
                          >
                            {user.isFraud ? "Flagged Fraud" : "Mark as Fraud"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No users found.
              </div>
            )}
          </div>

          {/* Footer / Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800/80 text-xs text-slate-400 font-medium">
            <div>
              Showing 1 - {filteredUsers.length} of {users.length} users
            </div>

            <div className="flex items-center gap-2">
              <button className="px-2 py-1 rounded bg-[#1e2736] hover:bg-slate-700 text-slate-300 disabled:opacity-30">
                &lt;
              </button>
              <button className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold">
                1
              </button>
              <button className="px-2.5 py-1 rounded bg-[#1e2736] hover:bg-slate-700 text-slate-300">
                2
              </button>
              <button className="px-2.5 py-1 rounded bg-[#1e2736] hover:bg-slate-700 text-slate-300">
                3
              </button>
              <button className="px-2 py-1 rounded bg-[#1e2736] hover:bg-slate-700 text-slate-300">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fraud Warning Dark Modal */}
      {selectedFraudVendor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#151c28] border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Confirm Fraud Flag
              </h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Flag{" "}
              <strong className="text-white">{selectedFraudVendor.name}</strong>{" "}
              as a fraudulent vendor?
            </p>

            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-xs text-red-300 space-y-1">
              <p className="font-bold text-red-400">System Actions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>All active vendor tickets will be immediately hidden.</li>
                <li>Vendor account will lose ticket creation privileges.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setSelectedFraudVendor(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-[#1e2736] rounded-xl border border-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFraud}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/30 transition"
              >
                Confirm Fraud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
