"use server";

import { protectedFetch, serverMutation } from "../core/server";


export const getUserProfileByUserId = async (userId) => {
  if (!userId) return null;

  try {
    const res = await protectedFetch(`/api/users/${userId}`);

    return await res.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const saveUserProfile = async (newUserData) => {
  try {
    const res = await serverMutation("/api/users", newUserData, "POST");

    return await res.json();
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};

export const getTransactionsByUser = async (userEmail) => {
  if (!userEmail) return [];

  try {
    const res = await protectedFetch(
      `/api/bookings?email=${encodeURIComponent(userEmail)}`,
    );

    const data = await res.json();

    const bookings = Array.isArray(data) ? data : data?.bookings || [];

    return bookings.filter((booking) => booking.paymentStatus === "paid");
  } catch (error) {
    console.error("Error fetching transaction history:", error);

    throw error;
  }
};