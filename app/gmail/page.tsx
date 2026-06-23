import UserDropdown from "./components/user-dropdown"
import { getUser } from "./actions"
import Mailbox from "./components/mail-box"

export default async function GmailCloneHomePage() {
  const user = await getUser()

  return (
    <div className="relative flex h-screen w-screen flex-col justify-center overflow-hidden bg-background">
      <Mailbox />
      <UserDropdown user={user} />
    </div>
  )
}
