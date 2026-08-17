"use client";

import React, { useEffect, useState } from "react";
import { getAdvertisedTickets } from "@/lib/actions/tickets";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  BusFront,
  Users,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Spinner } from "@heroui/react";

const AdvertiseTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getAdvertisedTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to load advertised tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      </section>
    );
  }

  if (!tickets.length) {
    return null;
  }

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden theme-transition">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/70 dark:from-slate-900/50 via-white dark:via-slate-900 to-white dark:to-slate-950" />

      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              Featured Tickets
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Find Your Next <span className="text-blue-600 dark:text-blue-400">Journey</span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Discover hand-picked travel tickets and book your journey quickly
              and easily.
            </p>
          </div>

          <Link
            href="/all-tickets"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
          >
            View all tickets
            <ArrowRight
              size={17}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Ticket Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const departure = ticket.departureDateTime
              ? new Date(ticket.departureDateTime)
              : null;

            const date = departure
              ? departure.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A";

            const time = departure
              ? departure.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A";

            return (
              <div
                key={ticket._id}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Top Gradient */}
                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500" />

                <div className="p-6">
                  {/* Ticket Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <BusFront size={22} />
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          Transport
                        </p>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          {ticket.title || "Travel Ticket"}
                        </h3>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/30 text-[10px] font-bold uppercase">
                      Featured
                    </span>
                  </div>

                  {/* Route */}
                  <div className="mt-7 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        From
                      </p>

                      <p className="mt-1 font-bold text-slate-800 dark:text-slate-200 truncate">
                        {ticket.fromLocation || "Unknown"}
                      </p>
                    </div>

                    <div className="w-10 h-10 shrink-0 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <ArrowRight size={18} />
                    </div>

                    <div className="min-w-0 flex-1 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        To
                      </p>

                      <p className="mt-1 font-bold text-slate-800 dark:text-slate-200 truncate">
                        {ticket.toLocation || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-6 border-t border-dashed border-slate-200 dark:border-slate-800" />

                  {/* Ticket Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <CalendarDays size={17} />
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                          Date
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <Clock3 size={17} />
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                          Departure
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <Users size={17} />
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                          Seats
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {ticket.quantity ?? 0} Available
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <MapPin size={17} />
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                          Type
                        </p>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {ticket.transportType || "Bus"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-7 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        Starting From
                      </p>

                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                        ৳{ticket.price ?? 0}
                      </p>
                    </div>

                    <Link
                      href={`/all-tickets/${ticket._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-sm font-semibold hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors"
                    >
                      View Ticket
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AdvertiseTicket;
