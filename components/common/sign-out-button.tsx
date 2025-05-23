'use client';
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function SignOutButton({className}: {className: string}) {
  const router = useRouter();
  const pathname = usePathname()

  const handleSignOut = async () => {
    await supabase.auth.signOut(); // Signs out the user and clears session[1][2][7]
    if (pathname !== "/") {
      router.push("/"); // Redirect to home or login page after sign out
    }
  };

  return (
    <Button onClick={handleSignOut} className={cn("btn", className)}>
      Sign out
    </Button>
  );
}
