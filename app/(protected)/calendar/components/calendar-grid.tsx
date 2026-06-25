"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalendarEvent {
  id: string
  title: string
  time: string
  description?: string
  date: string
  location?: string
  start?: string
  end?: string
}

interface CalendarGridProps {
  currentDate: Date
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  events: Record<string, CalendarEvent[]>
  onSelectEvent: (event: CalendarEvent) => void
}

export function CalendarGrid({
  currentDate,
  selectedDate,
  onSelectDate,
  events,
  onSelectEvent,
}: CalendarGridProps) {
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    return { days, firstDay }
  }

  const { days, firstDay } = getDaysInMonth(currentDate)

  const daysArray: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : ""

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Day Header Row */}
      <div className="z-10 grid shrink-0 grid-cols-7 gap-2 border-b border-border bg-card px-6 pt-4 pb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-1 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Scrollable Grid Cells */}
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="p-4"></div>
              }

              const cellDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
              )
              const cellDateKey = formatDateKey(cellDate)
              const isSelected = selectedDateKey === cellDateKey
              const isToday = formatDateKey(new Date()) === cellDateKey

              const dayEvents = events[cellDateKey] || []

              return (
                <div
                  key={`day-${day}`}
                  className={`flex h-32 cursor-pointer flex-col justify-between rounded-lg border p-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40 hover:bg-accent"
                  }`}
                  onClick={() => onSelectDate(cellDate)}
                >
                  <div className="flex justify-end">
                    <span
                      className={`flex items-center justify-center text-sm font-medium ${
                        isToday
                          ? "size-6 rounded-full bg-primary text-primary-foreground"
                          : isSelected
                            ? "text-primary"
                            : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                  </div>

                  {/* Event indicators in grid cells */}
                  <div className="mt-1 flex flex-1 flex-col gap-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((event) => (
                      <Badge
                        key={event.id}
                        variant="secondary"
                        className="w-full cursor-pointer justify-start truncate px-1.5 py-0.5 text-[10px] font-medium transition-colors hover:bg-secondary/80"
                        title={`${event.time} - ${event.title}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectDate(cellDate)
                          onSelectEvent(event)
                        }}
                      >
                        {event.title}
                      </Badge>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="pl-1 text-[9px] text-muted-foreground">
                        + {dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
