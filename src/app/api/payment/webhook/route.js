import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function POST(request) {
  const body = await request.text();

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("🔔 Stripe webhook received:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata?.bookingId;

      console.log("💳 Payment completed:", {
        sessionId: session.id,
        bookingId,
        paymentIntent: session.payment_intent,
      });

      if (!bookingId) {
        console.error("❌ bookingId missing from Stripe metadata");

        return NextResponse.json(
          { error: "bookingId missing" },
          { status: 400 },
        );
      }

      // Update MongoDB through Express backend
      const response = await fetch(
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

      const result = await response.json();

      console.log("✅ MongoDB payment update:", {
        status: response.status,
        result,
      });

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update booking payment");
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("❌ Stripe webhook error:", error);

    return NextResponse.json(
      {
        error: error.message || "Webhook error",
      },
      { status: 400 },
    );
  }
} 