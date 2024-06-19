"use client";

import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useSearchParams } from "next/navigation";

export const Social = () => {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  // Function to handle social login button click
  const onClick = (provider: "google" | "github") => {
    // Sign in with the provider and redirect the user to corresponding app that made the signin request
    signIn(provider, {
      redirectTo: next || DEFAULT_LOGIN_REDIRECT,
    })
  };
  return (
    <div className="flex items-center w-full gap-x-2">

      {/* Google login button */}
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>

      {/* Github login button */}
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
