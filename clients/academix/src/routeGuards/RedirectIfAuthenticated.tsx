import { Navigate, Outlet } from "react-router-dom";
import useAuthentication from "@/hooks/useAuthentication";
import Loader from "@/components/shared/Loader";

/**
 * Component for redirecting users if they are already authenticated.
 * This Higher Order Component (HOC) prevents the user from accessing authentication routes if they're already authenticated.
 */
const RedirectIfAuthenticated = () => {
  // Check authentication status using the useAuthentication hook
  const [isAuthenticated] = useAuthentication();

  // Display a loading spinner while authentication status is being checked
  if (isAuthenticated === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  // If authentication status is defined, render the appropriate content based on authentication status
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default RedirectIfAuthenticated;
