import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  // Import Auth handler app's server url from environment variables
  const authHandlerAppServerUrl =
    process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;

  // Extract GUID from request body
  const { guid } = await req.json();

  if (guid) {
    try {
      // Make a request to the authentication server to check if the guid exists
      const response = await fetch(
        `${authHandlerAppServerUrl}/api/token/verify-guid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guid }),
        }
      );

      // If guid verification is successful, authentication server returns token & provider as a response
      const tokenData = await response.json();

      if (tokenData) {
        // If the token is valid, prepare and send a cookie object to be stored from the frontend
        const authCookie = {
          token: tokenData.token,
          provider: tokenData.provider,
        };
        return NextResponse.json(authCookie);
      }
    } catch (error) {
      return NextResponse.json("Couldn't verify GUID!");
    }
  }
};
