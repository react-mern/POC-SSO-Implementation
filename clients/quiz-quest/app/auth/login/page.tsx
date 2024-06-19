import { Button } from "@/components/ui/button";
import Link from "next/link";

const LoginPage = () => {
  // Import Auth handler app's url and current app's url
  const authHandlerAppUrl = process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_URL;
  const currentAppUrl = process.env.NEXT_PUBLIC_CURRENT_APP_URL;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <h1 className="text-white text-3xl">Quiz Quest Login Page</h1>

      {/* Link to redirect user to Auth Handler App's login page with a 'next' parameter */}
      <Link
        href={`${authHandlerAppUrl}/auth/login?next=${currentAppUrl}/identity`}
      >
        <Button variant="secondary">Login with Learn-Lounge</Button>
      </Link>
    </div>
  );
};

export default LoginPage;
