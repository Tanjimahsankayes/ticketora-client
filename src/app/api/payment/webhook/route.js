// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";

// const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// export async function POST(request) {

//   const body = await request.text();
//   const signature = request.headers.get("stripe-signature");

//   if (!signature) {
//     return new NextResponse("Missing Stripe signature", {
//       status: 400,
//     });
//   }

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (error) {
//     console.error("Webhook signature verification failed:", error.message);

//     return new NextResponse(`Webhook Error: ${error.message}`, {
//       status: 400,
//     });
//   }

//   try {
//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;

//       const bookingId = session.metadata?.bookingId;

//       // Only bookingId is required for MongoDB update
//       if (!bookingId) {
//         console.error("Booking ID missing from Stripe metadata");

//         return NextResponse.json(
//           {
//             error: "Booking ID missing",
//           },
//           {
//             status: 400,
//           },
//         );
//       }

//       // Make sure payment is actually completed
//       if (session.payment_status !== "paid") {
//         console.log(
//           "Checkout session completed but payment_status is:",
//           session.payment_status,
//         );

//         return NextResponse.json({
//           received: true,
//           message: "Payment is not marked as paid yet",
//         });
//       }

//       const paymentIntentId =
//         typeof session.payment_intent === "string"
//           ? session.payment_intent
//           : null;

//       console.log("Updating MongoDB booking:", bookingId);

//       const bookingResponse = await fetch(
//         `${backendUrl}/api/bookings/${bookingId}/payment`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             paymentStatus: "paid",
//             stripeSessionId: session.id,
//             stripePaymentIntentId: paymentIntentId,
//           }),
//         },
//       );

//       const responseText = await bookingResponse.text();

//       console.log("Backend response:", {
//         status: bookingResponse.status,
//         ok: bookingResponse.ok,
//         body: responseText,
//       });

//       if (!bookingResponse.ok) {
//         console.error("Backend payment update failed:", responseText);

//         return new NextResponse("Failed to update booking", {
//           status: 500,
//         });
//       }

//     }

//     return NextResponse.json({
//       received: true,
//     });
//   } catch (error) {
//     console.error("Webhook processing error:", error);

//     return NextResponse.json(
//       {
//         error: "Webhook processing failed",
//         message: error.message,
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";

// const backendUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

// export async function POST(request) {

//   onsole.log("🔥 STRIPE WEBHOOK HIT");

//   console.log("Stripe signature exists:", !!signature);

//   const body = await request.text();
//   const signature = request.headers.get("stripe-signature");

//   if (!signature) {
//     return new NextResponse("Missing Stripe signature", { status: 400 });
//   }

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET,
//     );
//   } catch (error) {
//     console.error("Webhook signature failed:", error.message);
//     return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
//   }

//   console.log("🔥 Stripe event:", event.type);

//   if (event.type === "checkout.session.completed") {

//     const session = event.data.object;
//     const bookingId = session.metadata?.bookingId;

//     console.log("🔥 CHECKOUT SESSION:", {
//       id: session.id,
//       payment_status: session.payment_status,
//       metadata: session.metadata,
//       payment_intent: session.payment_intent,
//     });

//     if (!bookingId) {
//       console.error("Booking ID missing from metadata");
//       return NextResponse.json(
//         { error: "Booking ID missing" },
//         { status: 400 },
//       );
//     }

//     if (session.payment_status === "paid") {
//       const paymentIntentId =
//         typeof session.payment_intent === "string"
//           ? session.payment_intent
//           : null;

//       // Call Express server to update DB
//       const bookingResponse = await fetch(
//         `${backendUrl}/api/bookings/${bookingId}/payment`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             paymentStatus: "paid",
//             stripeSessionId: session.id,
//             stripePaymentIntentId: paymentIntentId,
//           }),
//         },
//       );

//       if (!bookingResponse.ok) {
//         const errorText = await bookingResponse.text();
//         console.error("MongoDB Update Failed via API:", errorText);
//         return new NextResponse("Failed to update DB", { status: 500 });
//       }

//       console.log(`Booking ${bookingId} updated to paid successfully.`);
//     }
//   }

//   console.log("🔥 BACKEND PAYMENT RESPONSE:", {
//     status: bookingResponse.status,
//     ok: bookingResponse.ok,
//     body: responseText,
//   });

//   return NextResponse.json({ received: true });
// }

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