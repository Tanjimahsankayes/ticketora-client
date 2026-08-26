import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/auth/signin", request.url));
}

export const config = {
  matcher: [
    "/dashboard/vendor/tickets/new",
    "/dashboard/vendor/tickets/reqbook",
    "/dashboard/vendor/tickets/revenue",
    "/dashboard/vendor/tickets",
    "/dashboard/vendor",
    "/dashboard/admin",
    "/dashboard/admin/manage",
    "/dashboard/admin/manage/manage-users",
    "/dashboard/admin/manage/manage-users/advertise",
    "/dashboard/user",
    "/dashboard/user/ticketbook",
    "/dashboard/user/ticketbook/transactions",
    "/profile",
    "/all-tickets/:path",
  ],
};
