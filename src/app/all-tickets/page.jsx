"use client";

import { getTickets } from "@/lib/actions/tickets";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import { HiOutlineX } from "react-icons/hi";

const AllTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromSearch, setFromSearch] = useState("");
  const [toSearch, setToSearch] = useState("");
  const [transportFilter, setTransportFilter] = useState("all");
  const [sortPriceOrder, setSortPriceOrder] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

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
      <div className="min-h-screen bg-slate-50 dark:bg-[#080b12] text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors duration-300">
        <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 bg-white dark:bg-[#0d121f] px-5 py-3.5 rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-800">
          <RiLoader2Fill className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading tickets...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b12] text-slate-700 dark:text-slate-300 py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-5 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              All Available Tickets
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Explore available routes across verified operators.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-500/20 shadow-sm">
              Showing {filteredAndSortedTickets.length} of {tickets.length}{" "}
              Tickets
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800/80 p-4 sm:p-5 rounded-2xl shadow-md space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* From Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                From Location
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* To Input */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                To Location
              </label>
              <input
                type="text"
                placeholder="e.g. Chittagong"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Transport Filter */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Transport Type
              </label>
              <select
                value={transportFilter}
                onChange={(e) => setTransportFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="all">All Types</option>
                {uniqueTransportTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Sort */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sort By Price
              </label>
              <select
                value={sortPriceOrder}
                onChange={(e) => setSortPriceOrder(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
              >
                <option value="default">Default Order</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>

            {/* Per Page */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Per Page
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition"
              >
                <option value={8}>8 items</option>
                <option value={12}>12 items</option>
                <option value={16}>16 items</option>
              </select>
            </div>
          </div>

          {(fromSearch ||
            toSearch ||
            transportFilter !== "all" ||
            sortPriceOrder !== "default") && (
            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                <HiOutlineX className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* 4 Cards Per Row Grid */}
        {filteredAndSortedTickets.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#0d121f] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
            <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
              No tickets matched your search or filter criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white shadow-md transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {currentTickets.map((ticket, index) => {
              const departureDate = ticket.departureDateTime
                ? new Date(ticket.departureDateTime).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
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
                  className="group relative bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  {/* Compact Banner Image */}
                  <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    {ticket.imageUrl ? (
                      <Image
                        src={ticket.imageUrl}
                        alt={ticket.title || "Ticket image"}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 text-[10px]">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-md text-blue-400 border border-slate-700/60 shadow-sm">
                        {ticket.transportType || "Bus"}
                      </span>
                    </div>
                  </div>

                  {/* Compact Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2.5">
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {ticket.title}
                      </h2>

                      {/* Route Box */}
                      <div className="bg-slate-50 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="truncate">
                          <p className="text-[9px] uppercase font-bold text-slate-400">
                            From
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {ticket.fromLocation}
                          </p>
                        </div>

                        <span className="px-1 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                          ➔
                        </span>

                        <div className="text-right truncate">
                          <p className="text-[9px] uppercase font-bold text-slate-400">
                            To
                          </p>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {ticket.toLocation}
                          </p>
                        </div>
                      </div>

                      {/* Departure Summary */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Departure:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {departureDate}{" "}
                          {departureTime && `(${departureTime})`}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Price & Action */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400">
                          Price
                        </p>
                        <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                          ${ticket.price}
                        </p>
                      </div>

                      <Link
                        href={`/all-tickets/${ticket._id}`}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all text-center"
                      >
                        Details
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
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/80 dark:border-slate-800/80 pt-5 gap-3">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {indexOfFirstTicket + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {Math.min(indexOfLastTicket, filteredAndSortedTickets.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-200">
                {filteredAndSortedTickets.length}
              </span>{" "}
              entries
            </p>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#0d121f] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
