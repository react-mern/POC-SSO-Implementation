import { LoginForm } from "@/components/auth/LoginForm";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

const LoginPage = async ({ searchParams }: {searchParams:{next:string}}) => {
  // Import Auth handler app's server url
  const authHandlerAppServerUrl =
    process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_SERVER_URL;

  // Extract next URL from query parameters
  const next = searchParams.next;

  // Retrieve user data from the session
  const user = await currentUser();
  const token = user?.accessToken || user?.jwt;
  const provider = user?.provider || "credentials";

  // Redirect to next URL with guid if user exists in session and login request is made from other apps
  if (next && user) {
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
    const guid = data.uuid;

    redirect(`${next}?guid=${guid}`);
  }

  return (
    <div className="h-full flex items-center justify-center">
      <LoginForm next={next} />
    </div>
  );
};

export default LoginPage;
