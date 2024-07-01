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
