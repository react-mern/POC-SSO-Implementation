import { useEffect } from "react";
import Loader from "../shared/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCookie } from "@/lib/cookie";

const Identity = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Import current client app's server url from environment variables
  const currentClientAppServerUrl = import.meta.env
    .VITE_CURRENT_CLIENT_APP_SERVER_URL;

  // Extract the guid and nextUrlPathname from search params
  const guid = searchParams.get("guid");
  const nextUrlPathname = searchParams.get("nextUrlPathname");

  useEffect(() => {
    const verifyGuid = async () => {
      if (guid) {
        try {
          // Make a request to the resource server to check if the guid exists
          const response = await fetch(
            `${currentClientAppServerUrl}/api/identity`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ guid }),
            }
          );

          // Extract the token and provider and prepare cookie object
          const { token, provider } = await response.json();
          const authCookie = {
            token,
            provider,
          };

          if (response.ok) {
            // If response received, set the cookie and navigate the user to the path from where the request was made to
            // check for new access token or to the default login redirect route when the user logs in for the first time
            setCookie("auth", JSON.stringify(authCookie));
            setCookie("guid", JSON.stringify(guid));
            navigate(nextUrlPathname || "/dashboard"); // Here, default login redirect route is dashboard
          } else {
            // If guid verification fails, navigate the user to home page
            console.error("GUID verification failed");
            navigate("/");
          }
        } catch (error) {
          console.error("Error during GUID verification:", error);
          navigate("/");
        }
      }
    };

    verifyGuid();
  }, [guid, navigate]);

  return (
    <div className="flex items-center justify-center h-full text-white">
      <Loader />
    </div>
  );
};

export default Identity;
