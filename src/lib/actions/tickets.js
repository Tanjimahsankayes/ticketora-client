"use server";

import { revalidatePath } from "next/cache";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

if (!process.env.NEXT_PUBLIC_BASE_URL) {
  console.warn(
    "NEXT_PUBLIC_BASE_URL is not defined, using fallback: http://localhost:5000",
  );
}

export const createTicket = async (newTicket) => {
  try {
    const res = await fetch(`${baseUrl}/api/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTicket),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Server responded with status ${res.status}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Create ticket error:", error);
    return { success: false, error: error.message };
  }
};

export const getTickets = async (vendorEmail) => {
  try {
    const url = vendorEmail
      ? `${baseUrl}/api/tickets?vendorEmail=${encodeURIComponent(vendorEmail)}`
      : `${baseUrl}/api/tickets`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`API Error Status: ${res.status}`);
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("API did not return JSON response");
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Get tickets action error:", error);
    return [];
  }
};

export const getTicketById = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/api/tickets/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Fetch ticket error:", error);
    return null;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const res = await fetch(`${baseUrl}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Booking failed");
    }

    return await res.json();
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: error.message };
  }
};

export const getBookingsByEmail = async (email) => {
  try {
    const res = await fetch(`${baseUrl}/api/bookings?email=${email}`);

    if (!res.ok) {
      console.error(`API Error Status: ${res.status}`);
      return [];
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("API did not return JSON response");
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch user bookings error:", error);
    return [];
  }
};

export async function cancelBooking(bookingId, userEmail) {
  try {
    const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "cancelled",
        email: userEmail,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to cancel booking",
      };
    }

    revalidatePath("/dashboard/user/ticketbook");

    return {
      success: true,
      message: "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Cancel booking error:", error);

    return {
      success: false,
      message: error.message || "An error occurred while cancelling booking",
    };
  }
}

export const deleteTicket = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/api/tickets/${id}`, {
      method: "DELETE",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete ticket",
      };
    }

    return {
      success: true,
      message: "Ticket deleted successfully",
    };
  } catch (error) {
    console.error("Delete ticket error:", error);
    return {
      success: false,
      message: error.message || "An error occurred while deleting ticket",
    };
  }
};

export const updateTicket = async (id, updatedData) => {
  try {
    const res = await fetch(`${baseUrl}/api/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update ticket",
      };
    }

    return {
      success: true,
      message: "Ticket updated successfully",
      data,
    };
  } catch (error) {
    console.error("Update ticket error:", error);
    return {
      success: false,
      message: error.message || "An error occurred while updating ticket",
    };
  }
};