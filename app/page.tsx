import { getSession } from "@/lib/auth/auth-server";
import { LoginButton } from "@/components/login-button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import DashboardPage from "./(protected)/dashboard/page";

export default async function Page() {
  const session = await getSession();

  if (session.success) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col h-[calc(100vh-1rem)] overflow-hidden">
          <SiteHeader />
          <main className="flex-1 overflow-hidden relative flex flex-col bg-background">
            <DashboardPage />
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <div className="flex min-h-screen w-screen flex-col bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <header className="flex h-16 w-full items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow-sm">
            U
          </div>
          <span className="font-bold text-base tracking-tight">uzu</span>
        </div>
        <div>
          <LoginButton className="px-4 py-2 text-sm" text="Login" />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 md:py-24 gap-12 text-center">
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-linear-to-r from-foreground via-foreground/90 to-foreground/70">
            A unified workspace for your inbox & calendar
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Integrate your Google account to manage Gmail syncs and calendar agendas in a premium, high-performance interface.
          </p>
        </div>

        <div className="w-full max-w-sm">
          <LoginButton className="w-full py-6 text-base" text="Continue with Google" />
        </div>

        {/* Feature Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full mt-8">
          <div className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card/30 hover:bg-card/50 transition-colors text-left">
            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-2">
              📊
            </div>
            <h3 className="font-bold text-lg">Intuitive Dashboard</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get a centralized view of your account status, sync schedules, and daily event volumes.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card/30 hover:bg-card/50 transition-colors text-left">
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold mb-2">
              📨
            </div>
            <h3 className="font-bold text-lg">Gmail Client</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Read, draft, and organize emails inside a high-speed, modern layout built for productivity.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-6 rounded-2xl border border-border bg-card/30 hover:bg-card/50 transition-colors text-left">
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mb-2">
              📅
            </div>
            <h3 className="font-bold text-lg">Interactive Calendar</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Schedule meetings, manage events, and track agendas with smooth animations and layout states.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-border bg-card/20 text-center text-xs text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Uzu. All rights reserved.</p>
      </footer>
    </div>
  );
}
