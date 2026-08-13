"use client";

import { getTickets } from "@/lib/actions/tickets";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const TicketsPage = () => {
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorTickets = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const ticketsData = await getTickets(user.email);
        const fetchedTickets = Array.isArray(ticketsData)
          ? ticketsData
          : ticketsData
            ? [ticketsData]
            : [];
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching vendor tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!isSessionLoading) {
      fetchVendorTickets();
    }
  }, [user?.email, isSessionLoading]);

  if (isSessionLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-400">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm font-medium">Loading your tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Tickets Management
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Overview and quick actions for tickets added by{" "}
              <span className="text-indigo-400 font-semibold">
                {user?.name || user?.email || "Vendor"}
              </span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              My Total Tickets: {tickets.length}
            </span>
          </div>
        </div>

        {/* 3-Column Grid for Tickets */}
        {tickets.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 font-medium">
              You haven't listed any tickets yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket, index) => {
              const departureDate = ticket.departureDateTime
                ? new Date(ticket.departureDateTime).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    },
                  )
                : "N/A";

              const departureTime = ticket.departureDateTime
                ? new Date(ticket.departureDateTime).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )
                : "";

              // Safe unique key creation
              const itemKey = ticket._id
                ? String(ticket._id)
                : `ticket-${index}`;

              return (
                <div
                  key={itemKey}
                  className="group relative bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  {/* Top Image Banner */}
                  <div className="relative w-full h-44 bg-slate-800 overflow-hidden">
                    {ticket.imageUrl ? (
                      <Image
                        src={ticket.imageUrl}
                        alt={ticket.title || "Ticket image"}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center text-slate-500 text-xs font-medium">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-indigo-400 border border-slate-700/80 shadow-md">
                        {ticket.transportType || "Transport"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border backdrop-blur-md shadow-md ${
                          ticket.verificationStatus === "pending"
                            ? "bg-slate-950/80 text-amber-400 border-amber-500/30"
                            : ticket.verificationStatus === "verified"
                              ? "bg-slate-950/80 text-emerald-400 border-emerald-500/30"
                              : "bg-slate-950/80 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ticket.verificationStatus === "pending"
                              ? "bg-amber-400 animate-pulse"
                              : ticket.verificationStatus === "verified"
                                ? "bg-emerald-400"
                                : "bg-rose-400"
                          }`}
                        />
                        {ticket.verificationStatus || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {ticket.title}
                      </h2>

                      {/* Route */}
                      <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-sm">
                        <div className="truncate">
                          <p className="text-[10px] uppercase font-bold text-slate-500">
                            From
                          </p>
                          <p className="font-semibold text-slate-200 truncate">
                            {ticket.fromLocation}
                          </p>
                        </div>

                        <div className="px-2 text-indigo-400 font-bold text-xs">
                          ➔
                        </div>

                        <div className="text-right truncate">
                          <p className="text-[10px] uppercase font-bold text-slate-500">
                            To
                          </p>
                          <p className="font-semibold text-slate-200 truncate">
                            {ticket.toLocation}
                          </p>
                        </div>
                      </div>

                      {/* Departure & Seats */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">
                            Departure
                          </p>
                          <p className="text-slate-300 font-medium">
                            {departureDate}
                          </p>
                          <p className="text-slate-400 text-[11px]">
                            {departureTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 font-semibold uppercase">
                            Quantity
                          </p>
                          <p className="text-slate-300 font-medium">
                            {ticket.quantity} Seats
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">
                          Price
                        </p>
                        <p className="text-xl font-black text-emerald-400">
                          ${ticket.price}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-medium transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
