"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  console.warn("NEXT_PUBLIC_BASE_URL is not defined in environment variables");
}

// Admin Profile fetch করা
export const getAdminProfileByUserId = async (userId) => {
  if (!userId) return null;
  try {
    const res = await fetch(`${baseUrl}/api/admin/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    return null;
  }
};

// Admin Profile সেভ বা আপডেট করা
export const saveAdminProfile = async (newAdminData) => {
  try {
    const res = await fetch(`${baseUrl}/api/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAdminData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Failed to save admin profile");
    }

    return data;
  } catch (error) {
    console.error("Error saving admin profile:", error);
    return { success: false, message: error.message };
  }
};

// অ্যাডমিন প্যানেলের জন্য সমস্ত টিকিটের তালিকা আনা
export const getAllVendorTickets = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/admin/tickets`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching vendor tickets:", error);
    return [];
  }
};

// টিকিটের স্ট্যাটাস আপডেট করা (approved / rejected)
export const updateTicketStatus = async (ticketId, status) => {
  try {
    const res = await fetch(`${baseUrl}/api/admin/tickets/${ticketId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Failed to ${status} ticket`);
    }

    return data;
  } catch (error) {
    console.error(`Error updating ticket status to ${status}:`, error);
    return { success: false, message: error.message };
  }
};

// শুধু Approved টিকিটের তালিকা ফেচ করা (অ্যাডভার্টাইজমেন্টের জন্য)
export const getApprovedTickets = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/admin/approved-tickets`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching approved tickets:", error);
    return [];
  }
};

// টিকিটের Advertisement Status (isAdvertised) টগল করা
export const toggleAdvertiseTicket = async (ticketId) => {
  try {
    const res = await fetch(
      `${baseUrl}/api/admin/advertise-ticket/${ticketId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update advertisement status",
      };
    }

    return data;
  } catch (error) {
    console.error("Error toggling advertise status:", error);
    return { success: false, message: error.message };
  }
};


export const getAdvertisedTickets = async () => {
  try {
    const res = await fetch(`${baseUrl}/api/advertised-tickets`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Error fetching advertised tickets:", error);
    return [];
  }
};
