import React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex h-[calc(100vh-1rem)] flex-col overflow-hidden">
        <SiteHeader />
        <main className="relative flex flex-1 flex-col overflow-hidden bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Layout
