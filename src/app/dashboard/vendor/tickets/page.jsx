"use client";

import { deleteTicket, getTickets, updateTicket } from "@/lib/actions/tickets";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const TicketsPage = () => {
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete Modal State
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Edit Modal State
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    fromLocation: "",
    toLocation: "",
    transportType: "",
    price: "",
    quantity: "",
    departureDateTime: "",
    imageUrl: "",
    perks: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState("");

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

  // --- DELETE MODAL HANDLERS ---
  const openDeleteModal = (ticketId) => {
    setDeleteError("");
    setTicketToDelete(ticketId);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setTicketToDelete(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!ticketToDelete) return;

    try {
      setIsDeleting(true);
      setDeleteError("");
      const res = await deleteTicket(ticketToDelete);

      if (res.success) {
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket._id !== ticketToDelete),
        );
        setTicketToDelete(null);
      } else {
        setDeleteError(res.message || "Failed to delete ticket.");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setDeleteError("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- EDIT MODAL HANDLERS ---
  const openEditModal = (ticket) => {
    // Security check on client UI level
    if (ticket.vendorEmail !== user?.email) {
      alert("You are not authorized to edit this ticket.");
      return;
    }

    setEditError("");
    setTicketToEdit(ticket);
    setEditFormData({
      title: ticket.title || "",
      fromLocation: ticket.fromLocation || "",
      toLocation: ticket.toLocation || "",
      transportType: ticket.transportType || "Bus",
      price: ticket.price || "",
      quantity: ticket.quantity || "",
      departureDateTime: ticket.departureDateTime || "",
      imageUrl: ticket.imageUrl || "",
      perks: Array.isArray(ticket.perks)
        ? ticket.perks.join(", ")
        : ticket.perks || "",
    });
  };

  const closeEditModal = () => {
    if (isUpdating) return;
    setTicketToEdit(null);
    setEditError("");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const confirmUpdate = async (e) => {
    e.preventDefault();
    if (!ticketToEdit) return;

    try {
      setIsUpdating(true);
      setEditError("");

      const updatedPayload = {
        ...editFormData,
        price: Number(editFormData.price),
        quantity: Number(editFormData.quantity),
        perks:
          typeof editFormData.perks === "string"
            ? editFormData.perks
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean)
            : editFormData.perks,
        vendorEmail: user?.email, // Backend authorization checks against this
      };

      const res = await updateTicket(ticketToEdit._id, updatedPayload);

      if (res.success) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === ticketToEdit._id
              ? { ...ticket, ...updatedPayload }
              : ticket,
          ),
        );
        setTicketToEdit(null);
      } else {
        setEditError(res.message || "Failed to update ticket.");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      setEditError("An unexpected error occurred. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isSessionLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
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
    <div className="text-slate-100 relative">
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
                        {/* EDIT BUTTON UPDATED */}
                        <button
                          onClick={() => openEditModal(ticket)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(ticket._id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-medium transition-colors"
                        >
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

      {/* --- EDIT TICKET MODAL --- */}
      {ticketToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                Edit Ticket Details
              </h3>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={confirmUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditInputChange}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    From Location
                  </label>
                  <input
                    type="text"
                    name="fromLocation"
                    value={editFormData.fromLocation}
                    onChange={handleEditInputChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    To Location
                  </label>
                  <input
                    type="text"
                    name="toLocation"
                    value={editFormData.toLocation}
                    onChange={handleEditInputChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Transport Type
                  </label>
                  <select
                    name="transportType"
                    value={editFormData.transportType}
                    onChange={handleEditInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Bus">Bus</option>
                    <option value="Train">Train</option>
                    <option value="Flight">Flight</option>
                    <option value="Launch">Launch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={editFormData.quantity}
                    onChange={handleEditInputChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Departure Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="departureDateTime"
                    value={editFormData.departureDateTime}
                    onChange={handleEditInputChange}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={editFormData.imageUrl}
                    onChange={handleEditInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Perks (comma separated)
                </label>
                <input
                  type="text"
                  name="perks"
                  value={editFormData.perks}
                  onChange={handleEditInputChange}
                  placeholder="WiFi, Sleeper Berth, Snacks"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-600/20 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Ticket?</h3>
                <p className="text-xs text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this ticket listing
              from your account?
            </p>

            {deleteError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs font-medium">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-rose-600/20 flex items-center space-x-2 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Ticket"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
