"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  const pathname = usePathname()

  const getPageName = () => {
    if (!pathname) return "Dashboard"

    // Split the pathname segments and remove empty ones
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length === 0) return "Dashboard"

    // Format the first segment as the main page name
    const mainSegment = segments[0]
    return mainSegment.charAt(0).toUpperCase() + mainSegment.slice(1)
  }

  return (
    <header className="flex items-center gap-2 border-b border-border bg-background px-4 py-2">
      <SidebarTrigger className="-ml-1 cursor-pointer" />
      <Separator orientation="vertical" className="mr-2 h-5" />
      <h1 className="text-sm font-semibold tracking-tight text-foreground select-none">
        {getPageName()}
      </h1>
    </header>
  )
}
