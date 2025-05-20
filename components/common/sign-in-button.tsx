'use client';
import { supabase } from "@/lib/supabaseClient";
import { Button } from "../ui/button";

export default function SignInButton() {
  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.SITE_URL}/auth/callback`,
      },
    });
    if (error) {
      alert('Error signing in');
      return;
    }
    // Redirect to Google sign-in
    window.location.href = data.url;
  };

  return (
    <Button onClick={handleSignIn} className="btn bg-neutral-700 cursor-pointer">
      Sign in with Google
    </Button>
  );
}
