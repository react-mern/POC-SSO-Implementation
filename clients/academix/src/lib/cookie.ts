/**
 * Sets a cookie with the specified name, value, and optional expiration date.
 * @param name The name of the cookie.
 * @param value The value of the cookie.
 * @param days Optional. The number of days until the cookie expires.
 */
export const setCookie = (name: string, value: string, days?: number) => {
  if (!name || !value) {
    throw new Error("Cookie name and value are required.");
  }

  // Construct the expiration string if days parameter is provided
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  // Set the cookie in the document's cookie string
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

/**
 * Retrieves the value of the cookie with the specified name.
 * @param name The name of the cookie to retrieve.
 * @returns The value of the cookie if found, otherwise null.
 */
export const getCookie = (name: string): string | null => {
  if (!name) {
    throw new Error("Cookie name is required.");
  }

  // Get the document's cookie string
  const value = `; ${document.cookie}`;

  // Split the cookie string into parts using the provided name
  const parts: string[] = value.split(`; ${name}=`);
  
  // If the cookie is found, return its value
  if (parts.length === 2) {
    const cookieValue = parts.pop();
    if (cookieValue) {
      // Decode the cookie value and return it
      return decodeURIComponent(cookieValue.split(";").shift() || "");
    }
  }

  // If the cookie is not found, return null
  return null;
};
