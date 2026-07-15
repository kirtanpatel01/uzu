import { Button } from "@/components/ui/button"
import { LoginButton } from "@/features/auth/components/login-button"
import { getSession } from "@/lib/auth/auth-server"
import { SquareArrowOutUpRight } from "lucide-react"
import Link from "next/link"

export default async function Page() {
  const session = await getSession()

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-x-hidden bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground shadow-sm">
            U
          </div>
          <span className="text-base font-bold tracking-tight">uzu</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto flex max-w-5xl flex-1 flex-col items-center justify-center gap-12 px-6 py-12 text-center md:py-24">
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            A unified workspace for your inbox & calendar
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Integrate your Google account to manage Gmail syncs and calendar
            agendas in a premium, high-performance interface.
          </p>
        </div>

        {session ? (
          <Link href="/dashboard">
            <Button>
              <SquareArrowOutUpRight />
              Dashboard
            </Button>
          </Link>
        ) : (
          <LoginButton text="Continue with Google" />
        )}

        {/* Feature Grid */}
        <div className="mt-8 grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/30 p-6 text-left transition-colors hover:bg-card/50">
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary">
              📊
            </div>
            <h3 className="text-lg font-bold">Intuitive Dashboard</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Get a centralized view of your account status, sync schedules, and
              daily event volumes.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/30 p-6 text-left transition-colors hover:bg-card/50">
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-500">
              📨
            </div>
            <h3 className="text-lg font-bold">Gmail Client</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Read, draft, and organize emails inside a high-speed, modern
              layout built for productivity.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card/30 p-6 text-left transition-colors hover:bg-card/50">
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 font-bold text-emerald-500">
              📅
            </div>
            <h3 className="text-lg font-bold">Interactive Calendar</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Schedule meetings, manage events, and track agendas with smooth
              animations and layout states.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-card/20 px-6 py-6 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Uzu. All rights reserved.</p>
      </footer>
    </div>
  )
}
