import { Button } from "@/components/ui/button"
import { getSession } from "../lib/auth/auth-server"

export default async function page() {
  const session = await getSession()
  const user = session.data?.user
  return (
    <div>
      {session.success ? (
        <div>
          <p>{JSON.stringify(user, null, 2)}</p>
          <Button>Logout</Button>
        </div>
      ) : (
        <div>
          <p>Not Logged in</p>
          <Button>Login</Button>
        </div>
      )}
    </div>
  )
}
