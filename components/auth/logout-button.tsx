"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export const LogoutButton = () => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSignOut = async () => {
    setIsPending(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/login"),
      },
    })
    setIsPending(false)
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleSignOut}
      type="button"
      variant="destructive"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  )
}
