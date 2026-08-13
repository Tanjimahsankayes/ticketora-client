"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

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
  const res = await fetch(`${baseUrl}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUserData),
  });

  if (!res.ok) {
    throw new Error("Failed to save user profile");
  }

  return await res.json();
};
