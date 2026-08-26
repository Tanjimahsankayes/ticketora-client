import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export async function POST(request) {

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", {
      status: 400,
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);

    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 400,
    });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata?.bookingId;

      // Only bookingId is required for MongoDB update
      if (!bookingId) {
        console.error("Booking ID missing from Stripe metadata");

        return NextResponse.json(
          {
            error: "Booking ID missing",
          },
          {
            status: 400,
          },
        );
      }

      // Make sure payment is actually completed
      if (session.payment_status !== "paid") {
        console.log(
          "Checkout session completed but payment_status is:",
          session.payment_status,
        );

        return NextResponse.json({
          received: true,
          message: "Payment is not marked as paid yet",
        });
      }

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      console.log("Updating MongoDB booking:", bookingId);

      const bookingResponse = await fetch(
        `${backendUrl}/api/bookings/${bookingId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId: paymentIntentId,
          }),
        },
      );

      const responseText = await bookingResponse.text();

      console.log("Backend response:", {
        status: bookingResponse.status,
        ok: bookingResponse.ok,
        body: responseText,
      });

      if (!bookingResponse.ok) {
        console.error("Backend payment update failed:", responseText);

        return new NextResponse("Failed to update booking", {
          status: 500,
        });
      }

      
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
