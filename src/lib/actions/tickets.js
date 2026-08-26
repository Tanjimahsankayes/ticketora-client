"use server";

import { revalidatePath } from "next/cache";
import { protectedFetch, serverFetch, serverMutation } from "../core/server";


export const createTicket = async (newTicket) => {
  try {
    const res = await serverMutation("/api/tickets", newTicket, "POST");

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || `Server responded with status ${res.status}`,
      };
    }

    revalidatePath("/dashboard/vendor/add-ticket");
    revalidatePath("/dashboard/vendor/my-tickets");

    return data;
  } catch (error) {
    console.error("Create ticket error:", error);

    return {
      success: false,
      error: error?.message || "Failed to create ticket",
    };
  }
};

export const getTickets = async (vendorEmail) => {
  try {
    const url = vendorEmail
      ? `/api/tickets?vendorEmail=${encodeURIComponent(vendorEmail)}`
      : "/api/tickets";

    const res = vendorEmail
      ? await protectedFetch(url, {
          cache: "no-store",
        })
      : await serverFetch(url, {
          cache: "no-store",
        });

    if (!res.ok) {
      console.error(`Get tickets API error: ${res.status}`);
      return [];
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      console.error("Get tickets API did not return JSON");
      return [];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Get tickets action error:", error);
    return [];
  }
};

export const getTicketById = async (id) => {
  try {
    if (!id) {
      console.error("Ticket ID is required");
      return null;
    }

    const res = await serverFetch(`/api/tickets/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Get ticket API error: ${res.status}`);
      return null;
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      console.error("Get ticket API did not return JSON");
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch ticket error:", error);
    return null;
  }
};

export const deleteTicket = async (id) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Ticket ID is required",
      };
    }

    const res = await serverMutation(`/api/tickets/${id}`, {}, "DELETE");

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete ticket",
      };
    }

    revalidatePath("/dashboard/vendor/my-tickets");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: data.message || "Ticket deleted successfully",
      data,
    };
  } catch (error) {
    console.error("Delete ticket error:", error);

    return {
      success: false,
      message: error?.message || "An error occurred while deleting ticket",
    };
  }
};

export const updateTicket = async (id, updatedData) => {
  try {
    if (!id) {
      return {
        success: false,
        message: "Ticket ID is required",
      };
    }

    const res = await serverMutation(
      `/api/tickets/${id}`,
      updatedData,
      "PATCH",
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update ticket",
      };
    }

    revalidatePath("/dashboard/vendor/my-tickets");
    revalidatePath(`/dashboard/vendor/my-tickets/${id}`);

    return {
      success: true,
      message: data.message || "Ticket updated successfully",
      data,
    };
  } catch (error) {
    console.error("Update ticket error:", error);

    return {
      success: false,
      message: error?.message || "An error occurred while updating ticket",
    };
  }
};

export const getAdvertisedTickets = async () => {
  try {
    const res = await serverFetch("/api/advertised-tickets", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch advertised tickets: ${res.status}`);
      return [];
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      console.error("Advertised tickets API did not return JSON");
      return [];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching advertised tickets:", error);

    return [];
  }
};

export const getLatestTickets = async (limit = 6) => {
  try {
    const safeLimit = Number(limit) || 6;

    const res = await serverFetch(
      `/api/tickets?latest=true&limit=${safeLimit}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error(`Failed to fetch latest tickets: ${res.status}`);
      return [];
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      console.error("Latest tickets API did not return JSON");
      return [];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Get latest tickets error:", error);
    return [];
  }
};

export const createBooking = async (bookingData) => {
  try {
    const res = await serverMutation("/api/bookings", bookingData, "POST");

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Booking failed",
      };
    }

    revalidatePath("/dashboard/user/ticketbook");
    revalidatePath("/dashboard/user");

    return data;
  } catch (error) {
    console.error("Booking error:", error);

    return {
      success: false,
      error: error?.message || "Booking failed",
    };
  }
};

//  Get bookings by user email
export const getBookingsByEmail = async (email) => {
  try {
    if (!email) {
      console.error("User email is required");
      return [];
    }

    const res = await protectedFetch(
      `/api/bookings?email=${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.error(`Get bookings API error: ${res.status}`);
      return [];
    }

    const contentType = res.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      console.error("Bookings API did not return JSON");
      return [];
    }

    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Fetch user bookings error:", error);

    return [];
  }
};

export async function cancelBooking(bookingId, userEmail) {
  try {
    if (!bookingId) {
      return {
        success: false,
        message: "Booking ID is required",
      };
    }

    if (!userEmail) {
      return {
        success: false,
        message: "User email is required",
      };
    }

    const res = await serverMutation(
      `/api/bookings/${bookingId}`,
      {
        status: "cancelled",
        email: userEmail,
      },
      "PATCH",
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to cancel booking",
      };
    }

    revalidatePath("/dashboard/user/ticketbook");
    revalidatePath("/dashboard/user");

    return {
      success: true,
      message: data.message || "Booking cancelled successfully",
    };
  } catch (error) {
    console.error("Cancel booking error:", error);

    return {
      success: false,
      message: error?.message || "An error occurred while cancelling booking",
    };
  }
}