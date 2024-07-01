import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookie";
import { useNavigate, useSearchParams } from "react-router-dom";

interface AuthData {
  token: string;
  provider: string;
}

const useAuthentication = (): Array<boolean | undefined> => {
  const [isAuthenticated, setisAuthenticated] = useState<boolean | undefined>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Import the current client app's server url and the authentication handler app's url from environment variables
  const currentClientAppServerUrl = import.meta.env
    .VITE_CURRENT_CLIENT_APP_SERVER_URL;
  const authHandlerAppUrl = import.meta.env.VITE_AUTH_HANDLER_APP_URL;

  // Extract the error from search params if it exists
  const error = searchParams.get("error");

  // Extract the auth cookie if it exists
  const authCookie = getCookie("auth");

  let token: string | null = null;
  let provider: string | null = null;

  if (authCookie) {
    // If authCookie exists, extract the token and provider
    const authData: AuthData = JSON.parse(authCookie);
    token = authData.token;
    provider = authData.provider;
  }

  // Send the token and provider to authentication server for verification
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch(
            `${currentClientAppServerUrl}/api/verify-token`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ provider }),
            }
          );

          // If response is ok, set the isAuthenticated state to true
          if (response.ok) {
            setisAuthenticated(true);
          } else {
            if (error) {
              // If an error is returned from the main app, redirect the user to the home page
              setisAuthenticated(false);
              navigate("/");
            }
            // If token is not verified, check if the authentication handler app has a new access token
            const checkNewAccessTokenUrl = new URL(
              `${authHandlerAppUrl}/auth/login`
            );

            // Set the search parameters
            const params = new URLSearchParams();
            params.set("next", window.location.href);
            params.set("refreshedAccessTokenCheck", "true");

            checkNewAccessTokenUrl.search = params.toString();

            window.location.href = checkNewAccessTokenUrl.href;
          }
        } catch (error) {
          setisAuthenticated(false);
        }
      } else {
        setisAuthenticated(false);
      }
    };
    verifyToken();
  }, []);

  return [isAuthenticated];
};

export default useAuthentication;
