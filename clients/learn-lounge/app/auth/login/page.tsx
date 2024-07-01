import { LoginForm } from "@/components/auth/LoginForm";
import { currentUser } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginPage = async ({
  searchParams,
}: {
  searchParams: { next: string; refreshedAccessTokenCheck: string };
}) => {
  // Import Auth handler app's server url from environment variables
  const authHandlerAppServerUrl =
    process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;

  // Extract next URL from query parameters
  const { next, refreshedAccessTokenCheck } = searchParams;

  const cookieStore = cookies();

  // Retrieve user data from the session
  const user = await currentUser();
  const token = user?.accessToken;
  const provider = user?.provider;

  let guid;

  if (next && refreshedAccessTokenCheck && !user) {
    redirect(`${next}?error="session expired"`);
  }

  // Redirect to next URL with guid if user exists in session and login request is made from other apps
  if (next && user) {
    // Extract the origin and pathname
    const nextUrl = new URL(next);
    const nextUrlOrigin = nextUrl.origin;
    const nextUrlPathname = nextUrl.pathname;

    if (!refreshedAccessTokenCheck) {
      // When user tries to login for the first time, make request to generate guid
      const response = await fetch(
        `${authHandlerAppServerUrl}/api/token/identity?next=${next}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ provider }),
        }
      );
      const data = await response.json();
      guid = data.uuid;
      redirect(`${nextUrlOrigin}/identity?guid=${guid}`);
    }

    // If the request is from other apps to check if there's a refreshed access token, update the guid with the new access token
    else {
      guid = cookieStore.get("guid")?.value;
      if (guid) guid = JSON.parse(guid);
      const updateGuidResponse = await fetch(
        `${authHandlerAppServerUrl}/api/token/update-identity?next=${next}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ provider, guid }),
        }
      );

      // If the guid is updated with the new access token, redirect the user back to the identity page of the app from where the cookie value will be updated
      if (updateGuidResponse.ok)
        redirect(
          `${nextUrlOrigin}/identity?guid=${guid}&nextUrlPathname=${nextUrlPathname}`
        );
      else {
        redirect(`${nextUrlOrigin}`);
      }
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      <LoginForm next={next} />
    </div>
  );
};

export default LoginPage;
