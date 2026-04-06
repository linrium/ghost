import { headers } from "next/headers"
import Link from "next/link"
import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <div>Not logged in</div>
  }

  return (
    <div className="p-3">
      <h1>Dashboard</h1>
      <p>
        Hello,{" "}
        <span className="font-medium text-orange-400">{session.user.name}</span>
        !
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href="/chat">Go to Chat</Link>
        </Button>
        <LogoutButton />
      </div>
    </div>
  )
}
