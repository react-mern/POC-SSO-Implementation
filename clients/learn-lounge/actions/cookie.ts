"use server";

import { cookies } from "next/headers";

/**
 * Deletes a cookie with the specified name.
 * @param cookieName The name of the cookie to delete.
 */

export const deleteCookie = async (cookieName: string) => {
  const cookieStore = cookies();
  if (cookieStore.has(cookieName)) {
    cookieStore.delete(cookieName);
  }
};
