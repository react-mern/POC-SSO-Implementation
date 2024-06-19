import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  // Import current client app's and authentication handler app's url
  const currentClientAppUrl = import.meta.env.VITE_CURRENT_CLIENT_APP_URL;
  const authHandlerAppUrl = import.meta.env.VITE_AUTH_HANDLER_APP_URL;

  return (
    // Here we pass the current client app's url as search param in "next" as we want the auth handler app
    // to redirect back to the current client app after the logout action is successful
    <Link
      to={`${authHandlerAppUrl}/auth/signout?next=${currentClientAppUrl}`}
      className="cursor-pointer"
    >
      <Button>{children}</Button>
    </Link>
  );
};
