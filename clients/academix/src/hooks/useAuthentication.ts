import { useEffect, useState } from "react";
import { getCookie } from "@/lib/cookie";

interface AuthData {
  token: string;
  provider: string;
}

const useAuthentication = (): Array<boolean | undefined> => {
  const [isAuthenticated, setisAuthenticated] = useState<boolean | undefined>();

  // Import the current client app's server url
  const currentClientAppServerUrl = import.meta.env
    .VITE_CURRENT_CLIENT_APP_SERVER_URL;

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

          // If response is ok, set the isAuthenticated state to true and in case of error, set it to false
          if (response.ok) {
            setisAuthenticated(true);
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
