import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen items-center justify-center">
      <Button>
        <Link href="auth/sign-in">Login</Link>
      </Button>
    </div>
  );
}
