import Loader from "@/components/Loader";
import CookieSetter from "@/components/auth/CookieSetter";

const IdentityLoginPage = async ({
  searchParams,
}: {
  searchParams: { guid: string };
}) => {
  // Import current app's url
  const currentAppUrl = process.env.NEXT_PUBLIC_CURRENT_APP_URL;

  // Extract the GUID from search parameters
  const guid = searchParams.guid;

  if (guid) {
    // Make a request to the backend to verify guid from the authentication server
    const response = await fetch(`${currentAppUrl}/api/identity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guid }),
    });

    // Parse the response JSON to get the token and provider
    const { token, provider } = await response.json();
    const authCookie = {
      name: "auth",
      value: {
        token,
        provider,
      },
    };

    // If the response is successful, render the CookieSetter component to set the authentication cookie
    if (response.ok) {
      return <CookieSetter cookie={authCookie} />;
    }
  }

  return (
    <div className="flex items-center justify-center h-full text-white">
      <Loader />
    </div>
  );
};

export default IdentityLoginPage;
