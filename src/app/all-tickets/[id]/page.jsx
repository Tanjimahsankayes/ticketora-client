"use client";

import { createBooking, getTicketById } from "@/lib/actions/tickets";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TicketDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();
  const user = session?.user;

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookQuantity, setBookQuantity] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    const fetchDetails = async () => {
      if (!params?.id) return;
      try {
        setLoading(true);
        const data = await getTicketById(params.id);
        setTicket(data);
      } catch (err) {
        console.error("Error loading ticket:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [params?.id]);


  useEffect(() => {
    if (!ticket?.departureDateTime) return;

    const calculateTime = () => {
      const departureTime = new Date(ticket.departureDateTime).getTime();
      const now = new Date().getTime();
      const difference = departureTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsExpired(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [ticket?.departureDateTime]);


  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const qty = parseInt(bookQuantity, 10);

    if (isNaN(qty) || qty < 1) {
      setErrorMessage("Please enter a valid quantity (at least 1).");
      return;
    }

    if (qty > ticket.quantity) {
      setErrorMessage(
        `Booking quantity cannot exceed available seats (${ticket.quantity}).`,
      );
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        fromLocation: ticket.fromLocation,
        toLocation: ticket.toLocation,
        transportType: ticket.transportType,
        departureDateTime: ticket.departureDateTime,
        pricePerUnit: ticket.price,
        quantity: qty,
        totalPrice: ticket.price * qty,
        vendorEmail: ticket.vendorEmail,
        userEmail: user?.email,
        userName: user?.name,
        img: ticket?.imageUrl,
      };

      const res = await createBooking(payload);
      if (res?.success && res?.result?.insertedId) {
        toast.success("Booking submitted successfully!");
        setIsModalOpen(false);
        router.push("/dashboard/user/ticketbook");
      } else {
        throw new Error("Failed to save booking.");
      }
    } catch (err) {
      toast.error(err.message || "Booking failed.");
      setErrorMessage(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || isSessionLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-400">
          <span className="animate-pulse">Loading Details...</span>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400">Ticket not found!</p>
      </div>
    );
  }

  const isOutOfStock = ticket.quantity <= 0;
  const isButtonDisabled = isExpired || isOutOfStock;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Banner Image */}
        <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          {ticket.imageUrl ? (
            <Image
              src={ticket.imageUrl}
              alt={ticket.title}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <span className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-md">
                {ticket.transportType}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
                {ticket.title}
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase text-slate-400 font-bold block">
                Price
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                ${ticket.price}
              </span>
            </div>
          </div>
        </div>

        {/* Countdown & Quick Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Countdown Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Departure Countdown
            </h3>

            {isExpired ? (
              <span className="px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-bold rounded-xl">
                Departure Time Passed
              </span>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                  <span className="text-xl font-black text-indigo-400">
                    {timeLeft.days}
                  </span>
                  <span className="block text-[10px] uppercase text-slate-500 font-semibold">
                    Days
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                  <span className="text-xl font-black text-indigo-400">
                    {timeLeft.hours}
                  </span>
                  <span className="block text-[10px] uppercase text-slate-500 font-semibold">
                    Hours
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                  <span className="text-xl font-black text-indigo-400">
                    {timeLeft.minutes}
                  </span>
                  <span className="block text-[10px] uppercase text-slate-500 font-semibold">
                    Mins
                  </span>
                </div>
                <div className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
                  <span className="text-xl font-black text-indigo-400">
                    {timeLeft.seconds}
                  </span>
                  <span className="block text-[10px] uppercase text-slate-500 font-semibold">
                    Secs
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Logistics Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Route:</span>
              <span className="text-slate-200 font-semibold">
                {ticket.fromLocation} ➔ {ticket.toLocation}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Available Quantity:</span>
              <span
                className={`font-semibold ${isOutOfStock ? "text-rose-400" : "text-emerald-400"}`}
              >
                {isOutOfStock ? "Out of Stock" : `${ticket.quantity} Seats`}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Vendor:</span>
              <span className="text-indigo-300 font-semibold">
                {ticket.vendorName || "TravelCorp"}
              </span>
            </div>

            {/* Book Now Main Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isButtonDisabled}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isExpired
                ? "Departure Passed"
                : isOutOfStock
                  ? "Sold Out"
                  : "Book Now"}
            </button>
          </div>
        </div>

        {/* Perks Section */}
        {ticket.perks && ticket.perks.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Included Perks
            </h3>
            <div className="flex flex-wrap gap-2">
              {ticket.perks.map((perk, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium"
                >
                  ✓ {perk}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-2xl">
            <h2 className="text-xl font-bold text-white">Book Ticket</h2>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">
                  Select Ticket Quantity (Max: {ticket.quantity})
                </label>
                <input
                  type="number"
                  min="1"
                  max={ticket.quantity}
                  value={bookQuantity}
                  onChange={(e) => setBookQuantity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center text-sm">
                <span className="text-slate-400">Total Price:</span>
                <span className="text-emerald-400 font-extrabold text-lg">
                  $
                  {(ticket.price * (parseInt(bookQuantity, 10) || 0)).toFixed(
                    2,
                  )}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setErrorMessage("");
                  }}
                  className="w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-1/2 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
