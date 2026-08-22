"use client";

import { getBookingsByEmail, cancelBooking } from "@/lib/actions/tickets";
import { useSession } from "@/lib/auth-client";
import React, { useState, useEffect, useCallback } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <span className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded-full">
        Departure time passed
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg">
      <span className="text-emerald-600 dark:text-emerald-400">⏳</span>
      <span>{timeLeft.days}d</span>:
      <span>{String(timeLeft.hours).padStart(2, "0")}h</span>:
      <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>:
      <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
    </div>
  );
};

const MyBookedTickets = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookingForCancel, setSelectedBookingForCancel] =
    useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const fetchUserBookings = useCallback(async (email, isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getBookingsByEmail(email);
      if (Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      if (isInitial) setError("Failed to load your booked tickets.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }
    fetchUserBookings(user.email, true);

    const handleFocus = () => {
      fetchUserBookings(user.email, false);
    };

    window.addEventListener("focus", handleFocus);

    const interval = setInterval(() => {
      fetchUserBookings(user.email, false);
    }, 50000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [user?.email, fetchUserBookings]);

 const handlePayNow = async (booking) => {
   try {
     const response = await fetch("/api/checkout_sessions", {
       method: "POST",

       headers: {
         "Content-Type": "application/json",
       },

       body: JSON.stringify({
         bookingId: booking._id,
       }),
     });

     const data = await response.json();

     if (!response.ok) {
       throw new Error(data.error || "Failed to create payment");
     }

     if (!data.checkoutUrl) {
       throw new Error("Stripe checkout URL not found");
     }

     // Redirect user to Stripe
     window.location.href = data.checkoutUrl;
   } catch (error) {
     console.error("Payment error:", error);

     alert(error.message || "Failed to proceed with payment");
   }
 };

  const openCancelModal = (booking) => {
    setCancelError(null);
    setSelectedBookingForCancel(booking);
  };

  const closeCancelModal = () => {
    if (isCancelling) return;
    setSelectedBookingForCancel(null);
    setCancelError(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel || !user?.email) return;

    setIsCancelling(true);
    setCancelError(null);

    try {
      const result = await cancelBooking(
        selectedBookingForCancel._id,
        user.email,
      );

      if (result.success) {
        setBookings((prev) =>
          prev.map((item) =>
            item._id === selectedBookingForCancel._id
              ? { ...item, status: "Cancelled" }
              : item,
          ),
        );

        closeCancelModal();
      } else {
        setCancelError(result.message || "Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Cancellation error:", err);
      setCancelError("An error occurred while processing your request.");
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusBadge = (status) => {
    const formatted = status ? status.toLowerCase() : "pending";
    switch (formatted) {
      case "accepted":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
            Rejected
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            Cancelled
          </span>
        );
      case "paid":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            Paid
          </span>
        );
      case "pending":
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Pending
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg max-w-md mx-auto my-8">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
          My Booked Tickets
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          View your upcoming trips, status, and payment details.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <p className="text-lg text-slate-500 dark:text-slate-400">
            No ticket bookings found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const statusLower = booking.status?.toLowerCase() || "pending";
            const isPendingStatus = statusLower === "pending";
            const isAccepted = statusLower === "accepted";
            const isRejected = statusLower === "rejected";
            const isCancelled = statusLower === "cancelled";
            const departureTime = new Date(booking.departureDateTime).getTime();
            const isExpired = departureTime <= new Date().getTime();

            return (
              <div
                key={booking._id}
                className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Image Section */}
                <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={booking.img || booking.ticketImage}
                    alt={booking.ticketTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(booking.status)}
                  </div>
                  {booking.transportType && (
                    <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm">
                      {booking.transportType}
                    </span>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {booking.ticketTitle}
                    </h3>

                    {/* From -> To */}
                    <div className="flex items-center space-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg">
                      <span>{booking.fromLocation}</span>
                      <span className="text-slate-400">➔</span>
                      <span>{booking.toLocation}</span>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
                      <div className="flex justify-between">
                        <span>Departure:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {new Date(booking.departureDateTime).toLocaleString(
                            "en-US",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booked Quantity:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {booking.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between text-base pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Total Price:
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          ৳
                          {booking.totalPrice ||
                            booking.pricePerUnit * booking.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown & Action Footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    {!isRejected && !isCancelled && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Departure In:
                        </span>
                        <CountdownTimer
                          targetDate={booking.departureDateTime}
                        />
                      </div>
                    )}

                    {isPendingStatus && (
                      <button
                        onClick={() => openCancelModal(booking)}
                        className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                      >
                        Cancel Booking
                      </button>
                    )}

                    {isCancelled && (
                      <button
                        type="button"
                        disabled
                        className="w-full py-2.5 px-4 bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 font-semibold rounded-xl cursor-not-allowed"
                      >
                        Cancelled
                      </button>
                    )}

                    {isAccepted &&
                      !isExpired &&
                      booking.paymentStatus !== "paid" && (
                        <button
                          type="button"
                          onClick={() => handlePayNow(booking)}
                          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Pay Now
                        </button>
                      )}

                    {isAccepted && booking.paymentStatus === "paid" && (
                      <div className="w-full py-2.5 px-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-semibold rounded-xl text-center">
                        Payment Completed ✓
                      </div>
                    )}

                    {isAccepted &&
                      isExpired &&
                      booking.paymentStatus !== "paid" && (
                        <p className="text-xs text-center text-red-500 font-medium">
                          Payment unavailable — Departure date has passed.
                        </p>
                      )}

                    {isAccepted && isExpired && (
                      <p className="text-xs text-center text-red-500 font-medium">
                        Payment unavailable — Departure date has passed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 transform transition-all">
            <div className="flex items-center space-x-3 text-rose-600 mb-4">
              <div className="p-2 bg-rose-100 dark:bg-rose-950/50 rounded-full">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cancel Booking?
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
              Are you sure you want to cancel your booking for{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedBookingForCancel.ticketTitle}
              </span>
              ?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              This action cannot be undone. Once cancelled, this ticket card
              will be updated in your dashboard.
            </p>

            {cancelError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-xs rounded-lg border border-red-200 dark:border-red-900">
                {cancelError}
              </div>
            )}

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={closeCancelModal}
                disabled={isCancelling}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center min-w-[120px]"
              >
                {isCancelling ? (
                  <span className="flex items-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Cancelling...</span>
                  </span>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookedTickets;
