"use client";

import React, { useEffect, useState } from "react";
import { getVendorBookings, updateBookingStatus } from "@/lib/actions/vendor";
import { Check, X, Ticket, ArrowRight } from "lucide-react";
import { Spinner } from "@heroui/react";
import { toast } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function ReqBookingPage() {
  const { data: session, isPending } = useSession();
  const vendorEmail = session?.user?.email;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!vendorEmail) return;

      try {
        const data = await getVendorBookings(vendorEmail);
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching vendor bookings:", error);
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    if (!isPending) {
      fetchBookings();
    }
  }, [vendorEmail, isPending]);

  const handleStatusUpdate = async (bookingId, status) => {
    if (!bookingId || !vendorEmail) {
      toast.error("Invalid booking information");
      return;
    }

    if (updatingId) return;

    setUpdatingId(bookingId);

    try {
      // Always send lowercase to backend
      const normalizedStatus = status.toLowerCase();

      const result = await updateBookingStatus(
        bookingId,
        normalizedStatus,
        vendorEmail,
      );

      if (!result?.success) {
        toast.error(result?.message || "Failed to update booking");
        return;
      }

      // Update UI immediately
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: normalizedStatus,
                updatedAt: new Date().toISOString(),
              }
            : booking,
        ),
      );

      toast.success(
        `Booking ${normalizedStatus === "accepted" ? "accepted" : "rejected"} successfully`,
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter Logic for Search and Status
  const filteredBookings = bookings.filter((booking) => {
    const userName = booking.userName || "";
    const userEmail = booking.userEmail || "";
    const ticketTitle = booking.ticketTitle || "";

    const matchesSearch =
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticketTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedStatus === "ALL") return matchesSearch;

    // Normalize status strings for exact comparison
    const currentStatus = (booking.status || "pending")
      .toString()
      .toLowerCase();
    return matchesSearch && currentStatus === selectedStatus.toLowerCase();
  });

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <Spinner
          size="lg"
          color="primary"
          label="Loading booking requests..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 md:p-10 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl dark:shadow-2xl p-4 sm:p-6 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 dark:text-white uppercase">
                Requested Bookings
              </h1>
              <p className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 mt-1 uppercase">
                {bookings.length} Total Reservation Requests
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search user or ticket..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#1e2736] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-sm rounded-xl pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700/60 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <svg
                  className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5"
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

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-100 dark:bg-[#1e2736] text-slate-400 text-sm rounded-xl px-4 py-2 border border-slate-300 dark:border-slate-700/60 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto mt-4">
            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Ticket / Route</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Total Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const bookingId = booking._id;
                    // Robust lower-case comparisons
                    const currentStatus = (booking.status || "pending")
                      .toString()
                      .toLowerCase();
                    const isPendingState = currentStatus === "pending";
                    const isAccepted = currentStatus === "accepted";
                    const isRejected = currentStatus === "rejected";

                    const userAvatar =
                      booking.img ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        booking.userName || "User",
                      )}&background=random`;

                    return (
                      <tr
                        key={bookingId}
                        className="bg-slate-100/70 dark:bg-[#1a2332]/60 hover:bg-slate-200/70 dark:hover:bg-[#1f2a3c] transition-colors rounded-xl border border-slate-200 dark:border-slate-800/40"
                      >
                        <td className="px-4 py-3.5 rounded-l-xl">
                          <div className="flex items-center gap-3">
                            <img
                              src={userAvatar}
                              alt={booking.userName}
                              width={20}
                              height={20}
                              className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shadow-sm"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900 dark:text-slate-100">
                                {booking.userName}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                                {booking.userEmail}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {booking.ticketTitle}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              <span>{booking.fromLocation}</span>
                              <ArrowRight
                                size={12}
                                className="text-slate-400 dark:text-slate-500"
                              />
                              <span>{booking.toLocation}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 bg-slate-200 dark:bg-[#1e2736] border border-slate-300 dark:border-slate-700/60 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {booking.quantity}{" "}
                            {booking.quantity > 1 ? "Tickets" : "Ticket"}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                          ৳ {booking.totalPrice?.toLocaleString()}
                        </td>

                        <td className="px-4 py-3.5">
                          {isAccepted ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Accepted
                            </span>
                          ) : isRejected ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3.5 text-right rounded-r-xl">
                          <div className="inline-flex items-center justify-end gap-2">
                            {isPendingState ? (
                              <>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(bookingId, "Accepted")
                                  }
                                  disabled={updatingId === bookingId}
                                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                  <Check size={14} /> Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(bookingId, "Rejected")
                                  }
                                  disabled={updatingId === bookingId}
                                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider italic">
                                Action Completed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Ticket className="w-8 h-8 text-slate-400 dark:text-slate-600" />
                        <p>No booking requests found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW */}
          <div className="block md:hidden mt-4 space-y-4">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => {
                const bookingId = booking._id;
                const currentStatus = (booking.status || "pending")
                  .toString()
                  .toLowerCase();
                const isPendingState = currentStatus === "pending";
                const isAccepted = currentStatus === "accepted";
                const isRejected = currentStatus === "rejected";

                const userAvatar =
                  booking.img ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    booking.userName || "User",
                  )}&background=random`;

                return (
                  <div
                    key={bookingId}
                    className="bg-slate-100/80 dark:bg-[#1a2332] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-md dark:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={userAvatar}
                        alt={booking.userName}
                        height={20}
                        width={20}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 shadow-md"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {booking.userName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {booking.userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/80 dark:bg-[#151c28] border border-slate-200 dark:border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Ticket:
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {booking.ticketTitle}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Route:
                        </span>
                        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                          {booking.fromLocation} <ArrowRight size={10} />{" "}
                          {booking.toLocation}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Quantity:
                        </span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">
                          {booking.quantity}{" "}
                          {booking.quantity > 1 ? "Tickets" : "Ticket"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Total Price:
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                          ৳ {booking.totalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Status
                        </span>
                        {isAccepted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                            Accepted
                          </span>
                        ) : isRejected ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 uppercase">
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                            Pending
                          </span>
                        )}
                      </div>

                      {isPendingState ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(bookingId, "Accepted")
                            }
                            disabled={updatingId === bookingId}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <Check size={14} /> Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(bookingId, "Rejected")
                            }
                            disabled={updatingId === bookingId}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider italic pt-1">
                          Action Completed
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
                No booking requests found.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div>
              Showing {filteredBookings.length} of {bookings.length} requests
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2.5 py-1 rounded bg-slate-200 dark:bg-[#1e2736] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700/60 disabled:opacity-40">
                &lt;
              </button>
              <button className="px-2.5 py-1 rounded bg-indigo-600 text-white font-bold">
                1
              </button>
              <button className="px-2.5 py-1 rounded bg-slate-200 dark:bg-[#1e2736] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700/60">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}