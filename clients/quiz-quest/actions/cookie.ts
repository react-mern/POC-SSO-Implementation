"use server";

import { cookies } from "next/headers";

/**
 * Sets a cookie
 * @param {string} cookieName - The name of the cookie to set.
 * @param {string} cookieValue - The value to set for the cookie.
 */

export const setCookie = async (cookieName: string, cookieValue: string) => {
  const cookieStore = cookies();

  // Set the cookie with the provided name and value
  cookieStore.set(cookieName, cookieValue);
};
