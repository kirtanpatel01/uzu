"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "better-auth"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signIn, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Spinner } from "@/components/ui/spinner"

function UserDropdown({ user }: { user: User | undefined }) {
  const [loggingIn, setLoggingIn] = useState(false)
  const [loggingOut, setLogginOut] = useState(false)

  const router = useRouter()
  const logout = async () => {
    setLogginOut(true)
    await signOut()
    router.refresh()
    setLogginOut(false)
  }

  const login = async () => {
    setLoggingIn(true)
    await signIn.social({ provider: "google", callbackURL: "/gmail" })
    setLoggingIn(false)
  }
  return (
    <div className="absolute top-4 right-4">
      {!user ? (
        <Button onClick={login} disabled={loggingIn}>
          {loggingIn ? <Spinner /> : <span>Login</span>}
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <img
              src={user?.image || ""}
              alt={user?.name}
              className="size-8 rounded-full"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={12} align="end" className="w-fit">
            <div className="p-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout} disabled={loggingOut}>
              {loggingOut ? (
                <Spinner />
              ) : (
                <>
                  <LogOut />
                  Logout
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default UserDropdown
