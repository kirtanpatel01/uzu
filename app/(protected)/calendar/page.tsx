"use client"

import React, { useState, useEffect } from "react"
import { getCalendarEvents, createCalendarEvent } from "@/features/calendar/actions"
import { Spinner } from "@/components/ui/spinner"
import { AlertCircle } from "lucide-react"
import { CalendarHeader } from "@/features/calendar/components/calendar-header"
import { CalendarGrid } from "@/features/calendar/components/calendar-grid"
import { CalendarSidebar } from "@/features/calendar/components/calendar-sidebar"
import { AddEventDialog } from "@/features/calendar/components/add-event-dialog"

interface CalendarEvent {
  id: string
  title: string
  time: string
  description?: string
  date: string // YYYY-MM-DD
  location?: string
  start?: string
  end?: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [events, setEvents] = useState<Record<string, CalendarEvent[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    let active = true

    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() // 0-indexed
        const res = await getCalendarEvents(year, month)

        if (!active) return

        if (res.success && res.data) {
          // Group events by date key YYYY-MM-DD
          const grouped: Record<string, CalendarEvent[]> = {}
          res.data.forEach((evt) => {
            const dateKey = evt.date
            if (!grouped[dateKey]) {
              grouped[dateKey] = []
            }
            grouped[dateKey].push(evt)
          })
          setEvents(grouped)
        } else {
          setError(res.message || "Failed to retrieve calendar events.")
        }
      } catch (err: any) {
        if (active) {
          setError("An error occurred while loading your calendar events.")
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchEvents()

    return () => {
      active = false
    }
  }, [currentDate.getFullYear(), currentDate.getMonth()])

  const changeMonth = (offset: number) => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + offset,
      1
    )
    setCurrentDate(nextDate)
    setSelectedDate(nextDate)
    setSelectedEvent(null)
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
  }

  const handleAddEvent = async (eventData: {
    title: string
    description: string
    date: string
    startTime: string
    endTime: string
    location: string
  }) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await createCalendarEvent(eventData)
      if (res.success) {
        setIsDialogOpen(false)
        // Refresh local events list for current viewed month
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const fetchRes = await getCalendarEvents(year, month)
        if (fetchRes.success && fetchRes.data) {
          const grouped: Record<string, CalendarEvent[]> = {}
          fetchRes.data.forEach((evt) => {
            const dateKey = evt.date
            if (!grouped[dateKey]) {
              grouped[dateKey] = []
            }
            grouped[dateKey].push(evt)
          })
          setEvents(grouped)
        }
      } else {
        setError(res.message || "Failed to create calendar event.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : ""
  const selectedDateEvents = selectedDateKey
    ? events[selectedDateKey] || []
    : []

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-background text-foreground">
      {/* Header */}
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={() => changeMonth(-1)}
        onNextMonth={() => changeMonth(1)}
        onToday={() => {
          const today = new Date()
          setCurrentDate(today)
          setSelectedDate(today)
          setSelectedEvent(null)
        }}
        onNewEventClick={() => setIsDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Calendar Grid */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
              <Spinner className="size-8" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 border-b border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <CalendarGrid
            currentDate={currentDate}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            events={events}
            onSelectEvent={setSelectedEvent}
          />
        </div>

        {/* Right Sidebar */}
        <CalendarSidebar
          selectedDate={selectedDate}
          events={selectedDateEvents}
          onAddEventClick={() => setIsDialogOpen(true)}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>

      {/* Event creation Dialog */}
      <AddEventDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedDate={selectedDate}
        onAddEvent={handleAddEvent}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
