import React from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { SiteHeader } from '@/components/site-header'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col h-[calc(100vh-1rem)] overflow-hidden">
          <SiteHeader />
          <main className="flex-1 overflow-hidden relative flex flex-col bg-background">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default Layout