import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const LoginPage = () => {
  // Import current client app's and authentication handler app's url
  const authHandlerAppUrl = import.meta.env.VITE_AUTH_HANDLER_APP_URL;
  const currentClientAppUrl = import.meta.env.VITE_CURRENT_CLIENT_APP_URL;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <h1 className="text-white text-3xl">Academix Login Page</h1>
      {/* Here we pass the current client app's url as search param in "next" as we want the auth handler app
      to redirect back to the current client app's "/identity" route after it generates the guid if the token exists */}
      <Link
        to={`${authHandlerAppUrl}/auth/login?next=${currentClientAppUrl}/identity`}
      >
        <Button variant="secondary">Login with Learn-Lounge</Button>
      </Link>
    </div>
  );
};

export default LoginPage;
