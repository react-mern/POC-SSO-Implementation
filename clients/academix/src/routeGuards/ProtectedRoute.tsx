import Loader from "@/components/shared/Loader";
import useAuthentication from "@/hooks/useAuthentication";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Component for rendering protected routes.
 * This Higher Order Component (HOC) allows the user to access private routes only if they're authenticated.
 */
const ProtectedRoute = () => {
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
  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
