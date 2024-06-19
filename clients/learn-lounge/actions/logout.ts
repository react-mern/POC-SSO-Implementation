"use server";

import { signOut } from "@/auth";
import { currentUser } from "@/lib/auth";

/**
 * Handles user logout by revoking authentication tokens and redirecting to the specified URL.
 * @param next Optional. The URL to redirect to after successful logout.
 */

export const logout = async (next?: string) => {
  // Import Auth handler app's server url
  const authHandlerAppServerUrl =
    process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;

  // Retrieve user data from the session
  const user = await currentUser();
  const token = user?.accessToken || user?.jwt;
  const provider = user?.provider || "credentials";

  // Call authentication server's logout endpoint
  await fetch(`${authHandlerAppServerUrl}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ provider }),
  });

  // Sign out the user and redirect to the specified URL
  await signOut({ redirectTo: next ? `/?next=${next}` : "/" });
};
