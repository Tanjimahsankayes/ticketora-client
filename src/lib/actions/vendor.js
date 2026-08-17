"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  console.warn("NEXT_PUBLIC_BASE_URL is not defined in environment variables");
}

// GET VENDOR REQUESTED BOOKINGS
export const getVendorBookings = async (vendorEmail) => {
  if (!vendorEmail) return [];

  try {
    const res = await fetch(
      `${baseUrl}/api/vendor-bookings?vendorEmail=${vendorEmail}`,
      {
        cache: "no-store",
      },
    );

    const data = await res.json().catch(() => []);

    if (!res.ok) {
      console.error("Failed to fetch vendor bookings:", data);

      return [];
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching vendor bookings:", error);

    return [];
  }
};

// ACCEPT / REJECT BOOKING
export const updateBookingStatus = async (bookingId, status, vendorEmail) => {
  try {
    if (!bookingId || !status || !vendorEmail) {
      return {
        success: false,
        message: "Missing required fields",
      };
    }

    const res = await fetch(
      `${baseUrl}/api/vendor-bookings/status/${bookingId}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,
          vendorEmail,
        }),
      },
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update booking status",
      };
    }

    return data;
  } catch (error) {
    console.error("Update booking status error:", error);

    return {
      success: false,
      message: error.message || "Server error",
    };
  }
};
