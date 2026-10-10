import { getLatestTickets } from "@/lib/actions/tickets";
import { ArrowRight, Calendar } from "@gravity-ui/icons";
import Link from "next/link";

export default async function LatestTickets() {
  const tickets = await getLatestTickets(6);

  if (!tickets || tickets.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        No tickets available at the moment.
      </div>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-slate-50 py-12 transition-colors duration-300 sm:py-16 dark:bg-slate-950">
      {/* Background blur */}
      <div className="pointer-events-none absolute -left-32 top-10 -z-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-600/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl dark:text-white">
              Latest Tickets
            </h2>
            <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Discover the newest travel tickets and book your journey quickly
              and easily.
            </p>
          </div>

          <Link
            href="/all-tickets"
            className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition"
          >
            View all tickets
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Compact Tickets Grid (6 Cards) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30"
            >
              {/* Image Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={
                    ticket.imageUrl ||
                    "https://placehold.co/600x400?text=No+Image"
                  }
                  alt={ticket.title || "Ticket Image"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Price Tag */}
                <span className="absolute right-2.5 top-2.5 rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-md dark:bg-indigo-500">
                  ৳{ticket.price}
                </span>

                {/* Transport Type Tag */}
                {ticket.transportType && (
                  <span className="absolute left-2.5 top-2.5 rounded-md bg-slate-950/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm dark:bg-white/10 dark:text-slate-200">
                    {ticket.transportType}
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="mb-2 truncate text-base font-bold text-slate-900 dark:text-white">
                    {ticket.title}
                  </h3>

                  {/* Route Information */}
                  <div className="mb-2 flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    <span className="max-w-[40%] truncate">
                      {ticket.fromLocation}
                    </span>
                    <span className="font-bold text-indigo-500 dark:text-indigo-400">
                      ➔
                    </span>
                    <span className="max-w-[40%] truncate text-right">
                      {ticket.toLocation}
                    </span>
                  </div>

                  {/* Departure Time */}
                  {ticket.departureDateTime && (
                    <p className="mb-2 flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <Calendar
                        size={13}
                        className="shrink-0 text-indigo-500"
                      />
                      <span className="truncate">
                        {new Date(ticket.departureDateTime).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </span>
                    </p>
                  )}

                  {/* Perks Tags */}
                  {ticket.perks && ticket.perks.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {ticket.perks.slice(0, 2).map((perk, index) => (
                        <span
                          key={index}
                          className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                        >
                          {perk}
                        </span>
                      ))}
                      {ticket.perks.length > 2 && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          +{ticket.perks.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Operator
                    </p>
                    <p className="max-w-[110px] truncate text-xs font-semibold text-slate-700 dark:text-slate-400">
                      {ticket.vendorName || "Verified Vendor"}
                    </p>
                  </div>

                  <Link
                    href={`/all-tickets/${ticket._id}`}
                    className="shrink-0 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
