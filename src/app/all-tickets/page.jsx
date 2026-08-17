"use client";

import { getTickets } from "@/lib/actions/tickets";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";

const AllTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [transportFilter, setTransportFilter] = useState("all");
  const [sortPriceOrder, setSortPriceOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const fetchAllTickets = async () => {
      try {
        setLoading(true);
        const ticketsData = await getTickets();
        const fetchedTickets = Array.isArray(ticketsData)
          ? ticketsData
          : ticketsData
            ? [ticketsData]
            : [];
        setTickets(fetchedTickets);
      } catch (error) {
        console.error("Error fetching all tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTickets();
  }, []);

  // Dynamically extract unique transport types from ticket list
  const uniqueTransportTypes = useMemo(() => {
    const types = tickets.map((t) => t.transportType).filter(Boolean);
    return Array.from(new Set(types));
  }, [tickets]);

  // Reset pagination to page 1 when search or filter controls change
  useEffect(() => {
    setCurrentPage(1);
  }, [fromSearch, toSearch, transportFilter, sortPriceOrder, itemsPerPage]);

  // Apply Search, Filter, and Sort logic
  const filteredAndSortedTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        const matchesFrom = (ticket.fromLocation || "")
          .toLowerCase()
          .includes(fromSearch.toLowerCase().trim());

        const matchesTo = (ticket.toLocation || "")
          .toLowerCase()
          .includes(toSearch.toLowerCase().trim());

        const matchesTransport =
          transportFilter === "all" ||
          (ticket.transportType || "").toLowerCase() ===
            transportFilter.toLowerCase();

        return matchesFrom && matchesTo && matchesTransport;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;

        if (sortPriceOrder === "lowToHigh") return priceA - priceB;
        if (sortPriceOrder === "highToLow") return priceB - priceA;
        return 0;
      });
  }, [tickets, fromSearch, toSearch, transportFilter, sortPriceOrder]);

  // Calculate Pagination values
  const totalPages =
    Math.ceil(filteredAndSortedTickets.length / itemsPerPage) || 1;
  const indexOfLastTicket = currentPage * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = filteredAndSortedTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket,
  );

  const handleClearFilters = () => {
    setFromSearch("");
    setToSearch("");
    setTransportFilter("all");
    setSortPriceOrder("default");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-100 flex items-center justify-center theme-transition">
        <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
          <RiLoader2Fill size={20} />
          <span className="text-sm font-medium">
            Loading all available tickets...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans theme-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All Available Tickets
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Browse and explore all listed routes across all vendors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
              Showing {filteredAndSortedTickets.length} of {tickets.length}{" "}
              Tickets
            </span>
          </div>
        </div>

        {/* Filter, Search, and Sorting Controls Toolbar */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* From Location Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                From Location
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* To Location Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                To Location
              </label>
              <input
                type="text"
                placeholder="e.g. Chittagong"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Transport Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Transport Type
              </label>
              <select
                value={transportFilter}
                onChange={(e) => setTransportFilter(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="all">All Types</option>
                {uniqueTransportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Sort By Price
              </label>
              <select
                value={sortPriceOrder}
                onChange={(e) => setSortPriceOrder(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="default">Default Order</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Items Per Page Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value={6}>6 items</option>
                <option value={9}>9 items</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Quick Action */}
          {(fromSearch ||
            toSearch ||
            transportFilter !== "all" ||
            sortPriceOrder !== "default") && (
            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800/60">
              <button
                onClick={handleClearFilters}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition"
              >
                Reset Filters & Search
              </button>
            </div>
          )}
        </div>

        {/* 3-Column Grid for Tickets */}
        {filteredAndSortedTickets.length === 0 ? (
          <div className="text-center py-16 bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              No tickets matched your search or filter criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTickets.map((ticket, index) => {
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

              const itemKey = ticket._id
                ? String(ticket._id)
                : `all-ticket-${index}`;

              return (
                <div
                  key={itemKey}
                  className="group relative bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  {/* Top Image Banner */}
                  <div className="relative w-full h-44 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    {ticket.imageUrl ? (
                      <Image
                        src={ticket.imageUrl}
                        alt={ticket.title || "Ticket image"}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-slate-200 dark:from-slate-900 via-slate-300 dark:via-slate-800 to-indigo-200 dark:to-indigo-950 flex items-center justify-center text-slate-500 dark:text-slate-500 text-xs font-medium">
                        No Image Available
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 dark:from-slate-900 via-transparent to-black/30" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-md text-indigo-600 dark:text-indigo-400 border border-slate-700/80 dark:border-slate-700/80 shadow-md">
                        {ticket.transportType || "Transport"}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border backdrop-blur-md shadow-md ${
                          ticket.verificationStatus === "pending"
                            ? "bg-slate-950/80 dark:bg-slate-950/80 text-amber-600 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/30"
                            : ticket.verificationStatus === "verified"
                              ? "bg-slate-950/80 dark:bg-slate-950/80 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/30"
                              : "bg-slate-950/80 dark:bg-slate-950/80 text-rose-600 dark:text-rose-400 border-rose-500/30 dark:border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ticket.verificationStatus === "pending"
                              ? "bg-amber-600 dark:bg-amber-400 animate-pulse"
                              : ticket.verificationStatus === "verified"
                                ? "bg-emerald-600 dark:bg-emerald-400"
                                : "bg-rose-600 dark:bg-rose-400"
                          }`}
                        />
                        {ticket.verificationStatus || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {ticket.title}
                      </h2>

                      {/* Route */}
                      <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-sm">
                        <div className="truncate">
                          <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">
                            From
                          </p>
                          <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {ticket.fromLocation}
                          </p>
                        </div>

                        <div className="px-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          ➔
                        </div>

                        <div className="text-right truncate">
                          <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">
                            To
                          </p>
                          <p className="font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {ticket.toLocation}
                          </p>
                        </div>
                      </div>

                      {/* Departure & Vendor Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-semibold uppercase">
                            Departure
                          </p>
                          <p className="text-slate-700 dark:text-slate-300 font-medium">
                            {departureDate}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {departureTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-500 font-semibold uppercase">
                            Vendor
                          </p>
                          <p className="text-indigo-600 dark:text-indigo-300 font-medium truncate">
                            {ticket.vendorName || "TravelCorp"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-500">
                          Price
                        </p>
                        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                          ${ticket.price}
                        </p>
                      </div>

                      <Link
                        href={`/all-tickets/${ticket._id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all text-center"
                      >
                        See details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {filteredAndSortedTickets.length > 0 && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6 gap-4">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {indexOfFirstTicket + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {Math.min(indexOfLastTicket, filteredAndSortedTickets.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {filteredAndSortedTickets.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : "bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTicketPage;
