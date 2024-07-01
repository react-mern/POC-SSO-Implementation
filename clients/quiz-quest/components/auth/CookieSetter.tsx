"use client";

import { setCookie } from "@/actions/cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/components/Loader";

interface CookieSetterProps {
  cookie: {
    name: string;
    value: {
      token: string;
      provider: string;
    };
  };
  nextUrlPathname?: string;
  guid?: string;
}

/**
 * CookieSetter component sets a cookie and redirects the user to the default login redirection page/ the page from where
 * request was made to verify if there's a refreshed access token in the authentication handler app.
 */

const CookieSetter = ({ cookie, nextUrlPathname, guid }: CookieSetterProps) => {
  const router = useRouter();

  useEffect(() => {
    const redirectUrl = nextUrlPathname
      ? `${window.location.origin}/${nextUrlPathname}`
      : "/dashboard";

    const setCookieAndRedirect = async () => {
      // Set the cookie using the setCookie action
      await setCookie(cookie.name, JSON.stringify(cookie.value));
      if (guid) await setCookie("guid", JSON.stringify(guid));

      // Redirect the user to the dashboard after setting the cookie
      router.push(redirectUrl);
    };

    setCookieAndRedirect();
  }, [cookie.name, cookie.value, router]);

  return (
    <div className="h-full flex items-center justify-center">
      <Loader />
    </div>
  );
};

export default CookieSetter;
