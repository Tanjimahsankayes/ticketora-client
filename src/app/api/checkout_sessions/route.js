import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

const frontendUrl =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

export async function POST(request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json(
        {
          error: "Booking ID is required",
        },
        {
          status: 400,
        },
      );
    }

    // Get booking from Express backend
    const bookingResponse = await fetch(
      `${backendUrl}/api/bookings/${bookingId}`,
      {
        cache: "no-store",
      },
    );

    if (!bookingResponse.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch booking",
        },
        {
          status: 500,
        },
      );
    }

    const booking = await bookingResponse.json();

    if (!booking) {
      return NextResponse.json(
        {
          error: "Booking not found",
        },
        {
          status: 404,
        },
      );
    }

    // Vendor must accept first
    if (booking.status !== "accepted") {
      return NextResponse.json(
        {
          error: "Booking is not accepted yet",
        },
        {
          status: 400,
        },
      );
    }

    // Already paid
    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        {
          error: "This booking is already paid",
        },
        {
          status: 400,
        },
      );
    }

    // Get ticket from Express backend
    const ticketResponse = await fetch(
      `${backendUrl}/api/tickets/${booking.ticketId}`,
      {
        cache: "no-store",
      },
    );

    if (!ticketResponse.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch ticket",
        },
        {
          status: 500,
        },
      );
    }

    const ticket = await ticketResponse.json();

    if (!ticket) {
      return NextResponse.json(
        {
          error: "Ticket not found",
        },
        {
          status: 404,
        },
      );
    }

    // Price comes from MongoDB through backend
    const ticketPrice = Number(ticket.price);

    if (!Number.isFinite(ticketPrice) || ticketPrice <= 0) {
      return NextResponse.json(
        {
          error: "Invalid ticket price",
        },
        {
          status: 400,
        },
      );
    }

    const quantity = Number(booking.quantity) || 1;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        {
          error: "Invalid quantity",
        },
        {
          status: 400,
        },
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "bdt",

            product_data: {
              name: ticket.title,
            },

            unit_amount: Math.round(ticketPrice * 100),
          },

          quantity,
        },
      ],

      metadata: {
        bookingId: bookingId.toString(),
        userId: booking.userId?.toString() || "",
        ticketId: booking.ticketId?.toString() || "",
      },

      success_url:
        `${frontendUrl}` +
        `/dashboard/user/ticketbook/success` +
        `?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${frontendUrl}` + `/dashboard/user/ticketbook`,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
    });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to create checkout session",
      },
      {
        status: 500,
      },
    );
  }
}
