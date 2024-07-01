"use server";

import { signOut } from "@/auth";
import { currentUser } from "@/lib/auth";
import { deleteCookie } from "./cookie";

/**
 * Handles user logout by revoking authentication tokens and redirecting to the specified URL.
 * @param next Optional. The URL to redirect to after successful logout.
 */

export const logout = async (next?: string) => {
  // Import Auth handler app's server url from environment variables
  const authHandlerAppServerUrl =
    process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;

  // Retrieve user data from the session
  const user = await currentUser();
  const token = user?.accessToken;
  const provider = user?.provider;

  // Call authentication server's logout endpoint
  await fetch(`${authHandlerAppServerUrl}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ provider }),
  });

  // Delete cookies
  await deleteCookie("auth");
  await deleteCookie("guid");
  // Sign out the user and redirect to the specified URL
  await signOut({ redirectTo: next ? `/?next=${next}` : "/" });
};
