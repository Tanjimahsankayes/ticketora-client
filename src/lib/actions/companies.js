"use server";

import { serverFetch, serverMutation } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  console.warn("backend url missing");
}

export const getCompanyByUserId = async (userId) => {
  if (!userId) return null;

  try {
    const res = await serverFetch(`/api/companies/${userId}`, {
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return null;
  }
};

export const saveCompany = async (newCompanyData) => {
  try {
    const res = await serverMutation("/api/companies", newCompanyData, "POST");

    return await res.json();
  } catch (error) {
    console.error("Error saving company profile:", error);
    throw error;
  }
};