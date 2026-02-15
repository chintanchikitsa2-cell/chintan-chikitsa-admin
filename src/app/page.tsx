import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Button><Link href="auth/sign-in">Login</Link></Button>
    </>
  );
}
