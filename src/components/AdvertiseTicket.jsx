"use client";

import React, { useEffect, useState } from "react";
import { getAdvertisedTickets } from "@/lib/actions/tickets";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  BusFront,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Spinner } from "@heroui/react";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdvertiseTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getAdvertisedTickets();
        // 6개 카드만 깔끔하게 노출
        setTickets((data ?? []).slice(0, 6));
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
      <section className="flex min-h-[200px] items-center justify-center bg-slate-50 py-12 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" color="primary" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Finding featured journeys...
          </p>
        </div>
      </section>
    );
  }

  if (!tickets.length) return null;

  return (
    <section className="relative isolate overflow-hidden bg-slate-50 py-12 transition-colors duration-300 sm:py-16 dark:bg-slate-950">
      {/* Background blur */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Sparkles size={13} />
              Featured journeys
            </div>

            <h2 className="text-2xl font-extrabold text-slate-950 sm:text-3xl dark:text-white">
              Your next journey,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                made effortless
              </span>
            </h2>
          </div>

          <Link
            href="/all-tickets"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Explore all tickets
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Cards Grid (Max 6) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => {
            const isAvailable = (ticket.quantity ?? 0) > 0;
            const perks = Array.isArray(ticket.perks) ? ticket.perks : [];

            return (
              <article
                key={ticket._id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30"
              >
                {/* Image Banner */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {ticket.imageUrl ? (
                    <img
                      src={ticket.imageUrl}
                      alt={ticket.title || "Journey"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/40 dark:to-slate-900">
                      <BusFront
                        size={36}
                        className="text-indigo-400 dark:text-indigo-500"
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="rounded-md border border-white/20 bg-slate-950/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                      {ticket.transportType || "Bus"}
                    </span>
                  </div>

                  <div className="absolute right-3 top-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm ${
                        isAvailable
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                      }`}
                    >
                      {isAvailable ? `${ticket.quantity} seats` : "Sold out"}
                    </span>
                  </div>

                  {/* Route overlay on image */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-bold truncate max-w-[85%]">
                      <MapPin size={13} className="shrink-0 text-indigo-400" />
                      <span className="truncate">
                        {ticket.fromLocation || "Start"}
                      </span>
                      <ArrowRight
                        size={12}
                        className="shrink-0 text-slate-300"
                      />
                      <span className="truncate">
                        {ticket.toLocation || "End"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                    {ticket.title || "Travel Ticket"}
                  </h3>

                  {/* Date & Time */}
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={13} className="text-violet-500" />
                      <span>{formatDate(ticket.departureDateTime)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock3 size={13} className="text-indigo-500" />
                      <span>{formatTime(ticket.departureDateTime)}</span>
                    </div>
                  </div>

                  {/* Perks Tags (Compact) */}
                  {perks.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {perks.slice(0, 2).map((perk, i) => (
                        <span
                          key={i}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {perk}
                        </span>
                      ))}
                      {perks.length > 2 && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          +{perks.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer: Price & Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
                        Price
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ৳{(ticket.price ?? 0).toLocaleString("en-BD")}
                      </span>
                    </div>

                    <Link
                      href={`/all-tickets/${ticket._id}`}
                      aria-disabled={!isAvailable}
                      tabIndex={isAvailable ? undefined : -1}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        isAvailable
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                          : "pointer-events-none bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600"
                      }`}
                    >
                      {isAvailable ? "View" : "Sold"}
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Link */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/all-tickets"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/50 dark:hover:text-indigo-400"
          >
            Discover all journeys
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdvertiseTicket;
