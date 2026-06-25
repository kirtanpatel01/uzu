"use client"

import React from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarHeaderProps {
  currentDate: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onNewEventClick: () => void
}

export function CalendarHeader({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onNewEventClick,
}: CalendarHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onPrevMonth}
            title="Previous Month"
          >
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm" onClick={onToday}>
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNextMonth}
            title="Next Month"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div>
        <Button onClick={onNewEventClick}>
          <Plus data-icon="inline-start" />
          New Event
        </Button>
      </div>
    </header>
  )
}
