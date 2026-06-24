import Mailbox from "./components/mail-box"

export default async function GmailCloneHomePage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
      <Mailbox />
    </div>
  )
}
