import UserDropdown from "./components/user-dropdown"
import { getUser } from "./actions"

export default async function GmailCloneHomePage() {
  const user = await getUser()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <UserDropdown user={user} />
    </div>
  )
}
