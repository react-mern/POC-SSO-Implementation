import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <h1 className="text-white text-3xl">Welcome to Quiz-Quest</h1>
      <Link href="/auth/login">
        <Button variant="secondary">Proceed to Login</Button>
      </Link>
    </div>
  );
}
