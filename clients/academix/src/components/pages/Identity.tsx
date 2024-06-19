import { useEffect } from "react";
import Loader from "../shared/Loader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCookie } from "@/lib/cookie";

const Identity = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Import current client app's server url
  const currentClientAppServerUrl = import.meta.env
    .VITE_CURRENT_CLIENT_APP_SERVER_URL;

  // Extract the guid from search params
  const guid = searchParams.get("guid");

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
            // If response received, set the cookie and navigate the user to default login redirect route
            setCookie("auth", JSON.stringify(authCookie));
            navigate("/dashboard"); // Here, default login redirect route is dashboard
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
