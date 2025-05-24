"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function SignInButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      })

      if (error) {
        console.error("Error signing in:", error)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Unexpected error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`h-screen flex items-center justify-center `}>
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-light text-neutral-600">Welcome!</h1>

        <Button
          onClick={handleSignIn}
          disabled={isLoading}
          className="bg-neutral-50 text-neutral-500 border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Sign in with Google"
          )}
        </Button>
      </div>
    </div>
  )
}
