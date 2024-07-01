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
import { redirect } from "next/navigation";

export async function middleware(req: NextRequest) {
  // Import Auth handler app's url and it's server url from environment variables
  const authHandlerAppUrl = process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_URL;
  const authHandlerAppServerUrl =
    process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;

  let token, provider;

  const cookieStore = cookies();
  const authCookie = cookieStore.has("auth") ? cookieStore.get("auth") : null;

  const { nextUrl } = req;
  const error = nextUrl.searchParams.get("error");
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isIdentityRoute = nextUrl.pathname.startsWith(identityRoutePrefix);
  const isApiRoute = nextUrl.pathname.startsWith(apiRoutesPrefix);

  // Do not run middleware for API routes
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
        if (error) {
          // If there's no refreshed access token,the token is invalid, remove it from the cookies and redirect to home page
          const response = NextResponse.redirect(new URL("/", nextUrl));
          response.headers.set("Set-Cookie", `auth=; Max-Age=0`);
          response.headers.set("Set-Cookie", `guid=; Max-Age=0`);
          return response;
        }

        // If token verification fails, check if the authentication handler app has refreshed the access token
        const checkNewAccessTokenUrl = new URL(
          `${authHandlerAppUrl}/auth/login`
        );
        checkNewAccessTokenUrl.searchParams.set("next", nextUrl.href);
        checkNewAccessTokenUrl.searchParams.set(
          "refreshedAccessTokenCheck",
          "true"
        );

        return NextResponse.redirect(new URL(checkNewAccessTokenUrl, nextUrl));
      }
      return;
    }
  }
  return;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
