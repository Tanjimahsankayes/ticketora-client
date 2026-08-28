"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Ticket, ArrowRight, Home, Loader2 } from "lucide-react";

const Page = () => {
  const [paymentUpdating, setPaymentUpdating] = useState(true);
  const [paymentError, setPaymentError] = useState("");

  // Prevent duplicate API call
  const paymentProcessed = useRef(false);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      // Prevent duplicate execution
      if (paymentProcessed.current) return;

      const params = new URLSearchParams(window.location.search);

      const sessionId = params.get("session_id");
      const bookingId = params.get("booking_id");

      console.log("Success page payment data:", {
        sessionId,
        bookingId,
      });

      if (!sessionId || !bookingId) {
        console.error("Missing session_id or booking_id");

        setPaymentError("Payment information is missing.");
        setPaymentUpdating(false);

        return;
      }

      paymentProcessed.current = true;

      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

        const response = await fetch(
          `${backendUrl}/api/bookings/${bookingId}/payment`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              paymentStatus: "paid",
              stripeSessionId: sessionId,
              stripePaymentIntentId: null,
            }),
          },
        );

        const data = await response.json();

        console.log("Payment update response:", {
          status: response.status,
          data,
        });

        if (!response.ok) {
          throw new Error(data?.message || "Failed to update payment status");
        }

        console.log("✅ Payment status successfully updated");

        setPaymentUpdating(false);
      } catch (error) {
        console.error("Payment update error:", error);

        setPaymentError(error.message || "Failed to update payment status");

        setPaymentUpdating(false);
      }
    };

    updatePaymentStatus();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12 transition-colors">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          {/* Decorative Background */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative px-6 py-12 sm:px-10 sm:py-14 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-7 relative w-fit">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl scale-125" />

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 border-8 border-emerald-50 dark:border-emerald-950">
                {paymentUpdating ? (
                  <Loader2
                    size={52}
                    strokeWidth={1.8}
                    className="text-emerald-600 dark:text-emerald-400 animate-spin"
                  />
                ) : (
                  <CheckCircle2
                    size={52}
                    strokeWidth={1.8}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                )}
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 px-4 py-1.5 mb-5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-xs font-semibold tracking-wide text-emerald-700 dark:text-emerald-400 uppercase">
                {paymentUpdating ? "Confirming Payment" : "Payment Completed"}
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {paymentUpdating
                ? "Confirming Your Payment..."
                : "Payment Successful!"}
            </h1>

            <p className="mt-4 max-w-lg mx-auto text-sm sm:text-base leading-7 text-slate-600 dark:text-slate-400">
              {paymentUpdating
                ? "Your payment was completed. We are confirming your booking information."
                : "Your payment has been successfully processed. Your ticket booking is now confirmed and ready for your journey."}
            </p>

            {/* Booking Info */}
            <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-5 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/50">
                  <Ticket
                    size={20}
                    className="text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Booking Confirmed
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    {paymentUpdating
                      ? "Confirming your payment..."
                      : "Your ticket is ready"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800" />

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  Payment Status
                </span>

                {paymentUpdating ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <Loader2 size={14} className="animate-spin" />
                    Confirming
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={14} />
                    Paid
                  </span>
                )}
              </div>

              {/* Error */}
              {paymentError && (
                <p className="mt-4 text-xs text-red-500">{paymentError}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/dashboard/user/ticketbook"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:-translate-y-0.5"
              >
                View My Bookings
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Home size={17} />
                Back to Home
              </Link>
            </div>

            {/* Footer Note */}
            <p className="mt-7 text-xs text-slate-400 dark:text-slate-500">
              Thank you for choosing Ticketora. Have a safe journey! ✈️
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
