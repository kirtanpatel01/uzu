"use client"

import React from "react"
import { Plus, Clock, MapPin, AlignLeft, ArrowLeft, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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

interface CalendarSidebarProps {
  selectedDate: Date | null
  events: CalendarEvent[]
  onAddEventClick: () => void
  selectedEvent: CalendarEvent | null
  onSelectEvent: (event: CalendarEvent | null) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (eventId: string) => Promise<void>
}

const renderTextWithLinks = (text: string) => {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      const href = part.startsWith("http") ? part : `https://${part}`
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium break-all text-primary underline transition-colors hover:text-primary/80"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export function CalendarSidebar({
  selectedDate,
  events,
  onAddEventClick,
  selectedEvent,
  onSelectEvent,
  onEditEvent,
  onDeleteEvent,
}: CalendarSidebarProps) {
  if (selectedEvent) {
    return (
      <aside className="hidden h-full w-80 shrink-0 flex-col border-l border-border bg-card md:flex">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSelectEvent(null)}
              title="Back to list"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground">
              Event Details
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg hover:bg-muted hover:text-primary"
              onClick={() => onEditEvent(selectedEvent)}
              title="Edit Event"
            >
              <Pencil className="size-3.5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg hover:bg-muted hover:text-destructive"
              onClick={() => onDeleteEvent(selectedEvent.id)}
              title="Delete Event"
            >
              <Trash2 className="size-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-4 p-4">
            <div>
              <h3 className="text-base leading-snug font-semibold tracking-tight text-foreground">
                {selectedEvent.title}
              </h3>
            </div>

            <Separator />

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-2.5 text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">
                    {selectedEvent.time}
                  </p>
                  <p className="text-[10px]">
                    {new Date(
                      selectedEvent.start || selectedEvent.date
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {selectedEvent.location && (
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="text-foreground">
                    {renderTextWithLinks(selectedEvent.location)}
                  </span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <AlignLeft className="mt-0.5 size-4 shrink-0" />
                  <div className="flex-1 space-y-1">
                    <span className="block text-[10px] font-semibold tracking-wider text-foreground uppercase">
                      Description
                    </span>
                    <p className="text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground">
                      {renderTextWithLinks(selectedEvent.description)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </aside>
    )
  }

  return (
    <aside className="hidden h-full w-80 shrink-0 flex-col border-l border-border bg-card md:flex">
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-semibold text-foreground">
          {selectedDate?.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-4">
          {events.length > 0 ? (
            events.map((event) => (
              <Card
                key={event.id}
                size="sm"
                className="cursor-pointer border border-border bg-muted/30 transition-colors hover:bg-muted/50"
                onClick={() => onSelectEvent(event)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-sm font-medium">
                      {event.title}
                    </CardTitle>
                    <span className="flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] whitespace-nowrap text-muted-foreground">
                      <Clock className="size-3 text-muted-foreground" />
                      {event.time}
                    </span>
                  </div>
                  {event.description && (
                    <CardDescription className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {event.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 p-4 py-12 text-center">
              <span className="text-sm text-muted-foreground">
                No events scheduled
              </span>
            </div>
          )}

          <Separator className="my-2" />

          <Button
            variant="outline"
            className="w-full"
            onClick={onAddEventClick}
          >
            <Plus data-icon="inline-start" />
            Add Event
          </Button>
        </div>
      </ScrollArea>
    </aside>
  )
}
