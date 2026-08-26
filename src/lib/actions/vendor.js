"use server";

import { protectedFetch, serverMutation } from "../core/server";


// GET VENDOR REQUESTED BOOKINGS
export const getVendorBookings = async (vendorEmail) => {
  if (!vendorEmail) return [];

  try {
    const res = await protectedFetch(
      `/api/vendor-bookings?vendorEmail=${encodeURIComponent(vendorEmail)}`,
      {
        cache: "no-store",
      },
    );

    const data = await res.json();

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

    // Always use lowercase status
    const normalizedStatus = status.toString().toLowerCase();

    if (!["accepted", "rejected"].includes(normalizedStatus)) {
      return {
        success: false,
        message: "Invalid booking status",
      };
    }

    const data = await serverMutation(
      `/api/vendor-bookings/status/${bookingId}`,
      {
        status: normalizedStatus,
        vendorEmail,
      },
      "PATCH",
    );

    return await data.json();
  } catch (error) {
    console.error("Update booking status error:", error);

    return {
      success: false,
      message: error?.message || "Server error",
    };
  }
};

// GET VENDOR REVENUE TREND
export const getVendorRevenueTrend = async (
  vendorEmail,
  year = new Date().getFullYear(),
) => {
  if (!vendorEmail) {
    return {
      success: false,
      data: [],
      message: "Vendor email is required",
    };
  }

  try {
    const queryParams = new URLSearchParams({
      vendorEmail,
      period: "monthly",
      year: String(year),
    });

    const res = await protectedFetch(
      `/api/vendor-revenue-trend?${queryParams.toString()}`,
      {
        cache: "no-store",
      },
    );

    return await res.json();
  } catch (error) {
    console.error("getVendorRevenueTrend error:", error);

    return {
      success: false,
      data: [],
      message: error?.message || "Failed to fetch revenue trend",
    };
  }
};