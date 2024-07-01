import Loader from "@/components/Loader";
import CookieSetter from "@/components/auth/CookieSetter";

const IdentityLoginPage = async ({
  searchParams,
}: {
  searchParams: { guid: string; nextUrlPathname: string };
}) => {
  // Import current app's url from environment variables
  const currentAppUrl = process.env.NEXT_PUBLIC_CURRENT_APP_URL;

  // Extract the GUID and nextUrlPathname from search parameters
  const guid = searchParams.guid;
  const nextUrlPathname = searchParams.nextUrlPathname;

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
      return (
        <CookieSetter
          cookie={authCookie}
          nextUrlPathname={nextUrlPathname}
          guid={guid}
        />
      );
    }
  }

  return (
    <div className="flex items-center justify-center h-full text-white">
      <Loader />
    </div>
  );
};

export default IdentityLoginPage;
