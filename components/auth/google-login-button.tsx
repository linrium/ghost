"use client"

import { IconBrandGoogle, IconLock, IconSparkles } from "@tabler/icons-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

const DASHBOARD_PATH = "/dashboard"

export const GoogleLoginButton = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

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
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Button
        className="h-12 w-full justify-center rounded-full"
        disabled={isPending}
        onClick={handleSignIn}
        size="lg"
        type="button"
      >
        <IconBrandGoogle data-icon="inline-start" />
        {isPending ? "Redirecting to Google..." : "Continue with Google"}
      </Button>

      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <IconLock className="size-3.5" />
        <p>Protected by Google OAuth and your existing Better Auth setup.</p>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <IconSparkles className="size-3.5" />
        <p>One click to access your dashboard without a password flow.</p>
      </div>

      {errorMessage ? (
        <p className="text-destructive text-sm" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
