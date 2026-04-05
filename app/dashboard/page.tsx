import { headers } from "next/headers"
import { LogoutButton } from "@/components/auth/logout-button"
import { auth } from "@/lib/auth"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return <div>Not logged in</div>
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hello, {session.user.name}!</p>
      <LogoutButton />
    </div>
  )
}
