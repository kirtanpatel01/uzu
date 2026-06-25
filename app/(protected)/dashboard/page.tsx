import { getSession } from "@/lib/auth/auth-server"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Mail, Calendar, LayoutDashboard } from "lucide-react"

export default async function DashboardPage() {
  const session = await getSession()
  const user = session.data?.user

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Welcome back,{" "}
          <span className="font-semibold text-foreground">
            {user?.name || "User"}
          </span>
          ! Here is an overview of your Uzu hub.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Google Account
            </CardTitle>
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <LayoutDashboard className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="truncate text-lg font-bold">
              {user?.name || "Connected"}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gmail Sync</CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-1.5 text-blue-500">
              <Mail className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Mailbox Ready</div>
            <p className="text-xs text-muted-foreground">
              Access your synchronized inbox
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Calendar Events
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-500">
              <Calendar className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Active Agenda</div>
            <p className="text-xs text-muted-foreground">
              Manage schedules and events
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
