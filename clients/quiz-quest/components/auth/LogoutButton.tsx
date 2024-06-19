"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  // Import Auth handler app's url and current app's url
  const authHandlerAppUrl = process.env.NEXT_PUBLIC_AUTH_HANDLER_APP_URL;
  const currentAppUrl = process.env.NEXT_PUBLIC_CURRENT_APP_URL;

  return (
    <Link
      href={`${authHandlerAppUrl}/auth/signout?next=${currentAppUrl}`}
      className="cursor-pointer"
    >
      <Button>{children}</Button>
    </Link>
  );
};
