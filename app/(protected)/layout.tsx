import React from "react"
// import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <TooltipProvider>
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="flex h-[calc(100vh-1rem)] flex-col overflow-hidden">
        <SiteHeader />
        <main className="relative flex flex-1 flex-col overflow-hidden bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
    // </TooltipProvider>
  )
}

export default Layout
