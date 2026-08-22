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

      // Get metadata

      const bookingId = session.metadata?.bookingId;
      const userId = session.metadata?.userId;
      const ticketId = session.metadata?.ticketId;

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

      if (!userId) {
        console.error("User ID missing from Stripe metadata");

        return NextResponse.json(
          {
            error: "User ID missing",
          },
          {
            status: 400,
          },
        );
      }

      if (!ticketId) {
        console.error("Ticket ID missing from Stripe metadata");

        return NextResponse.json(
          {
            error: "Ticket ID missing",
          },
          {
            status: 400,
          },
        );
      }

      // Stripe Payment Intent
  
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;


      // Update Booking

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

      if (!bookingResponse.ok) {
        const errorData = await bookingResponse.json().catch(() => ({}));

        console.error("Backend payment update failed:", errorData);

        return new NextResponse("Failed to update booking", {
          status: 500,
        });
      }


      console.log("Payment completed successfully:", {
        bookingId,
        userId,
        ticketId,
        transactionId: `TXN-${session.id.slice(-8).toUpperCase()}`,
        amount: session.amount_total ? session.amount_total / 100 : 0,
      });
    }
    // Response
 
    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      {
        status: 500,
      },
    );
  }
}
