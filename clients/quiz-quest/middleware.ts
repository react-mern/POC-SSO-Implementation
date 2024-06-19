import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  authRoutes,
  identityRoutePrefix,
  apiRoutesPrefix,
} from "@/routes";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  // Import Auth handler app's server url
  const authHandlerAppServerUrl =
    process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;

  let token, provider;

  const cookieStore = cookies();
  const authCookie = cookieStore.has("auth") ? cookieStore.get("auth") : null;

  const { nextUrl } = req;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isIdentityRoute = nextUrl.pathname.startsWith(identityRoutePrefix);
  const isApiRoute = nextUrl.pathname.startsWith(apiRoutesPrefix);

  if (isApiRoute) return;

  // Redirect User to the home page when cookie doesn't exist
  if (!authCookie && !isPublicRoute && !isAuthRoute && !isIdentityRoute) {
    return Response.redirect(new URL("/", nextUrl));
  }

  // Decode the cookie if it exists
  if (authCookie) {
    const decodedCookie = JSON.parse(authCookie.value);
    token = decodedCookie.token;
    provider = decodedCookie.provider;
  }

  // If cookie already exists, prevent user from accessing auth routes
  if (isAuthRoute && authCookie) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  // Verify token when user visits any private route
  if (!isPublicRoute && !isIdentityRoute && authCookie) {
    // Check if token is valid or not for subsequent requests
    if (token && provider) {
      const response = await fetch(
        `${authHandlerAppServerUrl}/api/token/verify-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ provider }),
        }
      );

      if (!response.ok) {
        // If token is invalid or has expired, remove it from the cookies and redirect to home page
        const response = NextResponse.redirect(new URL("/", nextUrl));
        response.headers.set("Set-Cookie", `auth=; Max-Age=0`);
        return response;
      }
      return;
    }
  }
  return;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
