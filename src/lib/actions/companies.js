"use server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  console.warn("NEXT_PUBLIC_BASE_URL is not defined in environment variables");
}

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
  try {
    const res = await fetch(`${baseUrl}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCompanyData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to save company profile");
    }

    return await res.json();
  } catch (error) {
    console.error("Error saving company profile:", error);
    throw error;
  }
};