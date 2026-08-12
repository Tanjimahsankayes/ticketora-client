"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getCompanyByUserId = async (userId) => {
  if (!userId) return null;
  try {
    const res = await fetch(`${baseUrl}/api/companies/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
};


export const saveCompany = async (newCompanyData) => {
  const res = await fetch(`${baseUrl}/api/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCompanyData),
  });

  if (!res.ok) {
    throw new Error("Failed to save company profile");
  }

  return await res.json();
};