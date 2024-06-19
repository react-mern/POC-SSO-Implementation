import { auth } from "@/auth";

/**
 * Retrieves the current user's session information.
*/

export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};
