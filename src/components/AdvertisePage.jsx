"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdvertisePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Guard against non-admin access
  useEffect(() => {
    if (!isPending && session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  const fetchApprovedTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approved-tickets");
      const data = await res.json();
      if (res.ok) {
        setTickets(data || []);
      } else {
        toast.error(data.message || "Failed to load approved tickets");
      }
    } catch (err) {
      toast.error("Network error while fetching tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchApprovedTickets();
    }
  }, [session, fetchApprovedTickets]);

  const advertisedCount = tickets.filter((t) => t.isAdvertised).length;

  const handleToggleAdvertise = async (ticketId, currentIsAdvertised) => {
    if (!currentIsAdvertised && advertisedCount >= 6) {
      toast.error("Limit reached! Maximum 6 tickets can be advertised.");
      return;
    }

    setActionLoadingId(ticketId);
    try {
      const res = await fetch(`/api/admin/advertise-ticket/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(
          data.ticket.isAdvertised
            ? "Ticket added to homepage advertisements!"
            : "Ticket removed from advertisements.",
        );
        setTickets((prev) =>
          prev.map((t) =>
            (t._id || t.id) === ticketId
              ? { ...t, isAdvertised: data.ticket.isAdvertised }
              : t,
          ),
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error connecting to server");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <Spinner size="lg" color="danger" label="Loading approved tickets..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats & Quota Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Approved Tickets
            </p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {tickets.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-lg">
            🎫
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Currently Advertised
            </p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {advertisedCount}{" "}
              <span className="text-xs font-normal text-slate-400">
                / 6 max
              </span>
            </h3>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg border ${
              advertisedCount >= 6
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            }`}
          >
            📢
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Available Slots
            </p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {Math.max(0, 6 - advertisedCount)}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-lg">
            ⚡
          </div>
        </div>
      </div>

      {/* Tickets Table Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        {tickets.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-3xl">📭</p>
            <p className="text-base font-medium text-white">
              No Approved Tickets
            </p>
            <p className="text-xs text-slate-500">
              Approved vendor tickets will appear here for advertisement setup.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Ticket Title / Route</th>
                  <th className="py-4 px-6">Vendor</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Seats</th>
                  <th className="py-4 px-6">Ad Status</th>
                  <th className="py-4 px-6 text-right">Advertise Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((ticket) => {
                  const id = ticket._id || ticket.id;
                  const isProcessing = actionLoadingId === id;
                  const isAdvertised = !!ticket.isAdvertised;
                  const limitReached = !isAdvertised && advertisedCount >= 6;

                  return (
                    <tr
                      key={id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      {/* Title & Route */}
                      <td className="py-4 px-6 font-semibold text-white">
                        <div>
                          {ticket.title || `${ticket.from} ➔ ${ticket.to}`}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          Departure: {ticket.departureDate || "N/A"}
                        </div>
                      </td>

                      {/* Vendor */}
                      <td className="py-4 px-6 text-slate-300">
                        {ticket.vendorName || ticket.vendor?.name || "Vendor"}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 text-slate-200 font-medium">
                        ${ticket.price}
                      </td>

                      {/* Available Seats */}
                      <td className="py-4 px-6 text-slate-400">
                        {ticket.availableSeats ??
                          ticket.seats ??
                          ticket.quantity ??
                          0}{" "}
                        seats
                      </td>

                      {/* Ad Status Badge */}
                      <td className="py-4 px-6">
                        {isAdvertised ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Ad
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                            Off
                          </span>
                        )}
                      </td>

                      {/* Toggle Switch */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() =>
                              handleToggleAdvertise(id, isAdvertised)
                            }
                            disabled={isProcessing || limitReached}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              isAdvertised
                                ? "bg-rose-500"
                                : "bg-slate-800 border-slate-700"
                            } ${
                              limitReached || isProcessing
                                ? "opacity-40 cursor-not-allowed"
                                : ""
                            }`}
                            title={
                              limitReached
                                ? "Maximum 6 advertised tickets allowed"
                                : "Toggle Homepage Advertisement"
                            }
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                isAdvertised ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
