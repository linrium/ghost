"use client"

import { IconBrandGoogleFilled } from "@tabler/icons-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

const DASHBOARD_PATH = "/dashboard"

export default function LoginPage() {
  const [isPending, setIsPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSignIn = async () => {
    setErrorMessage(null)
    setIsPending(true)

    try {
      await authClient.signIn.social({
        callbackURL: `${window.location.origin}${DASHBOARD_PATH}`,
        provider: "google",
      })
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start Google sign in."
      )
      setIsPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-8">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Button
            className="w-72"
            disabled={isPending}
            onClick={handleSignIn}
            size="lg"
            type="button"
          >
            <IconBrandGoogleFilled data-icon="inline-start" />
            {isPending ? "Redirecting to Google..." : "Continue with Google"}
          </Button>

          {errorMessage ? (
            <p className="text-center text-destructive text-sm" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  )
}
