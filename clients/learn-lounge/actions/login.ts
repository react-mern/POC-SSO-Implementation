"use server";

import { LoginSchema } from "@/schemas";
import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { revalidateTag } from "next/cache";

/**
 * Handles user login with provided email and password.
 * @param values An object containing email and password fields.
 * @param next Optional. The URL to redirect to after successful login if the login request is made by other connected apps.
 */

export const login = async (
  values: z.infer<typeof LoginSchema>,
  next?: string | null
) => {
  // Validate fields
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;
  try {
    // Attempt to sign in using provided credentials
    await signIn("credentials", {
      email,
      password,
      redirectTo: next ? `/auth/login?next=${next}` : DEFAULT_LOGIN_REDIRECT,
    });

    // Revalidate user data cache
    revalidateTag("user");
  } catch (error) {
    // Handle authentication errors
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
