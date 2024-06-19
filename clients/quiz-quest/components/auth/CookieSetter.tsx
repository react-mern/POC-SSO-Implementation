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
}

/**
 * CookieSetter component sets a cookie and redirects the user to the dashboard.
 */

const CookieSetter = ({ cookie }: CookieSetterProps) => {
  const router = useRouter();

  useEffect(() => {
    const setCookieAndRedirect = async () => {
      // Set the cookie using the setCookie action
      await setCookie(cookie.name, JSON.stringify(cookie.value));

      // Redirect the user to the dashboard after setting the cookie
      router.push("/dashboard");
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
