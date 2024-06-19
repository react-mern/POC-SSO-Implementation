"use client";

import { logout } from "@/actions/logout";
import { useEffect } from "react";
import Loader from "@/components/Loader";
import { deleteCookie } from "@/actions/cookie";

const Logout = ({ next }: { next: string }) => {
  useEffect(() => {
    const logoutAndDeleteCookie = async () => {
      try {
        // Delete the authentication cookie
        await deleteCookie("auth");

        // Log the user out
        logout(next);
      } catch (error) {
        console.error("Error deleting cookie:", error);
      }
    };
    logoutAndDeleteCookie();
  }, [next]);

  return (
    <div className="flex flex-col h-full items-center justify-center gap-5 text-white">
      <Loader />
      <p>Logging Out...</p>
    </div>
  );
};

export default Logout;
