"use server";

import { protectedFetch, serverFetch, serverMutation } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  console.warn("NEXT_PUBLIC_BASE_URL is not defined in environment variables");
}

export const getAdminProfileByUserId = async (userId) => {
  if (!userId) return null;
  try {
    const res = await protectedFetch(`/api/admin/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return null;
  }
};

export const saveAdminProfile = async (newAdminData) => {
  try {
    const res = await serverMutation("/api/admin", newAdminData, "POST");

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to save admin profile");
    }

    return data;
  } catch (error) {
    console.error("Error saving admin profile:", error);

    return {
      success: false,
      message: error.message || "Failed to save admin profile",
    };
  }
};

export const getAllVendorTickets = async () => {
  try {
    const res = await protectedFetch(`/api/admin/tickets`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching vendor tickets:", error);
    return [];
  }
};

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const res = await serverMutation(
      `/api/admin/tickets/${ticketId}`,
      { status },
      "PATCH",
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || `Failed to ${status} ticket`);
    }

    return data;
  } catch (error) {
    console.error(`Error updating ticket status to ${status}:`, error);

    return {
      success: false,
      message: error.message || "Failed to update ticket",
    };
  }
};

export const getApprovedTickets = async () => {
  try {
    const res = await protectedFetch("/api/admin/approved-tickets", {
      cache: "no-store",
    });

    console.log("STATUS:", res.status);
    console.log("OK:", res.ok);

    const text = await res.text();

    console.log("RAW APPROVED TICKETS RESPONSE:", text);

    if (!res.ok) {
      return [];
    }

    const data = JSON.parse(text);

    console.log("PARSED APPROVED TICKETS:", data);

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.tickets)) {
      return data.tickets;
    }

    return [];
  } catch (error) {
    console.error("getApprovedTickets error:", error);
    return [];
  }
};

// TOGGLE ADVERTISEMENT
export const toggleAdvertiseTicket = async (ticketId) => {
  try {
    if (!ticketId) {
      return {
        success: false,
        message: "Ticket ID is required",
      };
    }

    const res = await serverMutation(
      `/api/admin/advertise-ticket/${ticketId}`,
      {},
      "PATCH",
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to update advertisement status",
      };
    }

    return data;
  } catch (error) {
    console.error("Error toggling advertise status:", error);

    return {
      success: false,
      message: error.message || "Server error",
    };
  }
};

export const getAdvertisedTickets = async () => {
  try {
    const res = await serverFetch("/api/advertised-tickets", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch advertised tickets");
      return [];
    }

    const data = await res.json().catch(() => []);

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching advertised tickets:", error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const res = await protectedFetch("/api/users", {
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch users: ${res.status} ${res.statusText} - ${errorText}`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const makeUserAdmin = async (userId) => {
  try {
    const res = await serverMutation(
      `/api/users/${userId}/role`,
      {
        role: "admin",
      },
      "PATCH",
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to make user admin");
    }

    return data;
  } catch (error) {
    console.error("Error making user admin:", error);

    return {
      success: false,
      message: error.message || "Failed to make user admin",
    };
  }
};

export const makeUserVendor = async (userId) => {
  try {
    const res = await serverMutation(
      `/api/users/${userId}/role`,
      {
        role: "vendor",
      },
      "PATCH",
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to make user vendor");
    }

    return data;
  } catch (error) {
    console.error("Error making user vendor:", error);

    return {
      success: false,
      message: error?.message || "Failed to make user vendor",
    };
  }
};

// Mark vendor as fraud
export const markUserAsFraud = async (userId) => {
  try {
    const res = await serverMutation(
      `/api/users/${userId}/fraud`,
      {
        isFraud: true,
      },
      "PATCH",
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to mark user as fraudulent");
    }

    return data;
  } catch (error) {
    console.error("Error marking user as fraud:", error);

    return {
      success: false,
      message: error?.message || "Failed to mark user as fraud",
    };
  }
};