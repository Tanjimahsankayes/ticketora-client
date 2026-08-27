import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID is required",
        },
        {
          status: 400,
        },
      );
    }

    console.log("🔍 Verifying Stripe session:", sessionId);

    // Get Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Stripe session:", {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    });

    // Make sure payment was actually successful
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          success: false,
          error: "Payment has not been completed",
        },
        {
          status: 400,
        },
      );
    }

    // Get booking ID from Stripe metadata
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          error: "Booking ID not found in Stripe session",
        },
        {
          status: 400,
        },
      );
    }

    console.log("✅ Payment verified for booking:", bookingId);

    // Update MongoDB through existing backend endpoint
    const updateResponse = await fetch(
      `${backendUrl}/api/bookings/${bookingId}/payment`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          paymentStatus: "paid",

          stripeSessionId: session.id,

          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
        }),
      },
    );

    const updateResult = await updateResponse.json();

    console.log("MongoDB payment update:", {
      status: updateResponse.status,
      result: updateResult,
    });

    if (!updateResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error: updateResult?.message || "Failed to update booking payment",
        },
        {
          status: updateResponse.status,
        },
      );
    }

    return NextResponse.json({
      success: true,

      message: "Payment verified and booking updated",

      bookingId,

      stripeSessionId: session.id,

      paymentStatus: "paid",
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to verify payment",
      },
      {
        status: 500,
      },
    );
  }
}
