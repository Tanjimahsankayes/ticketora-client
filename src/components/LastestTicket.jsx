import { getLatestTickets } from "@/lib/actions/tickets";
import { ArrowRight, Calendar } from "@gravity-ui/icons";
import Link from "next/link";


export default async function LatestTickets() {
  const tickets = await getLatestTickets(6);

  if (!tickets || tickets.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No tickets available at the moment.
      </div>
    );
  }

  return (
    <section className="w-full py-16 sm:py-20 bg-gray-50 dark:bg-[#08090a] theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0F766E] dark:text-white">
              Latest Tickets
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Discover the newest travel tickets and book your journey quickly
              and easily.
            </p>
          </div>

          <Link
            href="/all-tickets"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition"
          >
            View all tickets
            <ArrowRight
              size={17}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="group relative bg-white dark:bg-[#111215] border border-gray-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* Image & Price Tag */}
                <div className="relative h-48 w-full bg-gray-100">
                  <img
                    src={
                      ticket.imageUrl ||
                      "https://placehold.co/600x400?text=No+Image"
                    }
                    alt={ticket.title || "Ticket Image"}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    ৳{ticket.price}
                  </span>
                  {ticket.transportType && (
                    <span className="absolute top-3 left-3 bg-black/60 dark:bg-white/10 backdrop-blur-sm text-white dark:text-gray-200 text-xs px-2.5 py-1 rounded-md">
                      {ticket.transportType}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#0F766E] dark:text-gray-200 line-clamp-1 mb-2">
                    {ticket.title}
                  </h3>

                  {/* Route Information */}
                  <div className="flex items-center font-semibold text-[#115E59] dark:text-gray-400 bg-gray-50 dark:bg-slate-950 p-2.5 rounded-lg border border-gray-100 dark:border-slate-700 mb-3 text-sm">
                    <span>{ticket.fromLocation}</span>
                    <span className="mx-2 text-indigo-500 dark:text-indigo-400">
                      ➔
                    </span>
                    <span>{ticket.toLocation}</span>
                  </div>

                  {/* Date & Departure */}
                  {ticket.departureDateTime && (
                    <p className="text-xs flex gap-1 items-center text-gray-600 dark:text-gray-300 mb-3">
                      <Calendar></Calendar> Departure:{" "}
                      {new Date(ticket.departureDateTime).toLocaleString(
                        "en-US",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        },
                      )}
                    </p>
                  )}

                  {/* Perks Tags */}
                  {ticket.perks && ticket.perks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ticket.perks.map((perk, index) => (
                        <span
                          key={index}
                          className="bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[11px] font-medium px-2 py-0.5 rounded-md"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between mt-2">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Operator
                  </p>
                  <p className="text-xs font-semibold text-[#115E59] dark:text-gray-400 truncate max-w-[130px]">
                    {ticket.vendorName || "Verified Vendor"}
                  </p>
                </div>
                <Link
                  href={`/all-tickets/${ticket._id}`}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
