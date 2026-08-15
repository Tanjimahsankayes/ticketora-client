"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getAllVendorTickets, updateTicketStatus } from "@/lib/actions/admin";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ManageTicketsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Role Guard
  useEffect(() => {
    if (!isPending && session?.user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllVendorTickets();
      setTickets(data || []);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchTickets();
    }
  }, [session, fetchTickets]);

  const handleStatusChange = async (ticketId, newStatus) => {
    setActionLoadingId(ticketId);
    try {
      const res = await updateTicketStatus(ticketId, newStatus);
      if (res?.success) {
        toast.success(`Ticket ${newStatus} successfully!`);
        // Refresh local state to reflect changes instantly
        setTickets((prev) =>
          prev.map((t) =>
            t._id === ticketId || t.id === ticketId
              ? { ...t, status: newStatus }
              : t,
          ),
        );
      } else {
        throw new Error(res?.message || "Operation failed");
      }
    } catch (error) {
      toast.error(error.message || "Could not update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center p-4">
        <Spinner
          size="lg"
          color="danger"
          label="Loading tickets management..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Admin Panel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Manage Vendor Tickets
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Review, approve, or reject tickets submitted by system vendors.
            </p>
          </div>
          <button
            onClick={fetchTickets}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 transition-all self-start sm:self-auto"
          >
            🔄 Refresh List
          </button>
        </div>

        {/* Tickets Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
          {tickets.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <p className="text-3xl">🎫</p>
              <p className="text-base font-medium text-white">
                No tickets found
              </p>
              <p className="text-xs text-slate-500">
                There are currently no tickets submitted by vendors.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Route / Title</th>
                    <th className="py-4 px-6">Vendor</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Seats</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tickets.map((ticket) => {
                    const id = ticket._id || ticket.id;
                    const isProcessing = actionLoadingId === id;

                    return (
                      <tr
                        key={id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        {/* Title / Departure */}
                        <td className="py-4 px-6 font-semibold text-white">
                          <div>
                            {ticket.title || `${ticket.from} ➔ ${ticket.to}`}
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            Date: {ticket.departureDate || "N/A"}
                          </div>
                        </td>

                        {/* Vendor Name */}
                        <td className="py-4 px-6 text-slate-300">
                          {ticket.vendorName ||
                            ticket.vendor?.name ||
                            "Unknown Vendor"}
                        </td>

                        {/* Transport Type */}
                        <td className="py-4 px-6 capitalize">
                          <span className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                            {ticket.type || "Bus"}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 text-slate-200 font-medium">
                          ${ticket.price}
                        </td>

                        {/* Available Seats */}
                        <td className="py-4 px-6 text-slate-400">
                          {ticket.availableSeats ?? ticket.seats ?? 0} seats
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-6">
                          {ticket.status === "approved" && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Approved
                            </span>
                          )}
                          {ticket.status === "rejected" && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              Rejected
                            </span>
                          )}
                          {(!ticket.status || ticket.status === "pending") && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusChange(id, "approved")}
                              disabled={
                                isProcessing || ticket.status === "approved"
                              }
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all shadow-md active:scale-95"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(id, "rejected")}
                              disabled={
                                isProcessing || ticket.status === "rejected"
                              }
                              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all shadow-md active:scale-95"
                            >
                              Reject
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
    </div>
  );
}
