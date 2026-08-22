"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  console.warn("NEXT_PUBLIC_BASE_URL is not defined in environment variables");
}

export const getUserProfileByUserId = async (userId) => {
  if (!userId) return null;
  try {
    const res = await fetch(`${baseUrl}/api/users/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const saveUserProfile = async (newUserData) => {
  try {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save user profile");
    }

    return await res.json();
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

export const getTransactionsByUser = async (userId) => {
  if (!userId) return [];

  try {
    const response = await fetch(`${baseUrl}/api/bookings/user/${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `Failed to fetch bookings: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();

    // Only paid bookings
    const bookings = Array.isArray(data) ? data : data.bookings || [];

    return bookings.filter((booking) => booking.paymentStatus === "paid");
  } catch (error) {
    console.error("Error fetching transaction history:", error);

    throw error;
  }
};