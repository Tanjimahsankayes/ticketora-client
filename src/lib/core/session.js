import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export async function getUserSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session.user || null;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export const getUserToken = async() => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session?.session?.token || null;
}

export const recuireRole = (role) => {
  const user = getUserSession()
  if(!user){
    redirect('/auth/signin')
  }
  if(user?.role !== role){
    redirect('/unauthorized')
  }

  return user;
}