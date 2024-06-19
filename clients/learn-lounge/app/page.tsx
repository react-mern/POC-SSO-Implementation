import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function Home({
  searchParams,
}: {
  searchParams: { next: string };
}) {
  // After logout operation, the default redirect is to the Home Page
  // If the logout request is made by other apps, we append that app's url in query params in order to redirect to that app after logout
  if (searchParams.next) {
    redirect(searchParams.next);
  }

  return (
    <main className="flex flex-col space-y-16 h-full items-center justify-center">
      <p
        className={cn(
          "text-4xl font-semibold text-white drop-shadow-md",
          font.className
        )}
      >
        SSO
      </p>
      <Link href="/auth/login">
        <Button size="lg" className="text-white">
          Proceed to Login
        </Button>
      </Link>
    </main>
  );
}
