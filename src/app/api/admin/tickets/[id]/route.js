import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 },
      );
    }

    // DB Update Example:
    // const updatedTicket = await db.ticket.update({
    //   where: { id },
    //   data: { status },
    // });

    return NextResponse.json(
      { success: true, message: `Ticket ${status} successfully` },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update ticket status", error: error.message },
      { status: 500 },
    );
  }
}
