"use server";

export const getAccessTokenByRefreshToken = async (
  refreshToken: string,
  provider: string
) => {
  if (provider === "credentials") {
    // Import Auth handler app's server url from environment variables
    const authHandlerAppServerUrl =
      process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;
    try {
      const refreshResponse = await fetch(
        `${authHandlerAppServerUrl}/api/token/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        }
      );

      // If the token refresh fails, throw an error
      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh access token");
      }

      // Parse the refreshed token data
      const refreshedTokenData = await refreshResponse.json();
      return refreshedTokenData;
    } catch (error) {
      return error;
    }
  } else {
    // Provider is Google
    // Retrieve OAuth client ID and client secret from environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    try {
      const refreshResponse = await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "refresh_token",
          }),
        }
      );

      // If the token refresh fails, throw an error
      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh access token");
      }

      // Parse the refreshed token data
      const refreshedTokenData = await refreshResponse.json();
      return refreshedTokenData;
    } catch (error) {
      return error;
    }
  }
};
