"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AddEventDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  editingEvent: {
    id: string
    title: string
    description?: string
    date: string
    location?: string
    start?: string
    end?: string
  } | null
  onSaveEvent: (
    eventData: {
      title: string
      description: string
      date: string
      startTime: string
      endTime: string
      location: string
    },
    eventId?: string
  ) => Promise<void>
  isSubmitting: boolean
}

export function AddEventDialog({
  isOpen,
  onOpenChange,
  selectedDate,
  editingEvent,
  onSaveEvent,
  isSubmitting,
}: AddEventDialogProps) {
  const [eventTitle, setEventTitle] = useState("")
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined)
  const [eventStartTime, setEventStartTime] = useState("09:00")
  const [eventEndTime, setEventEndTime] = useState("10:00")
  const [eventLocation, setEventLocation] = useState("")
  const [eventDescription, setEventDescription] = useState("")

  // Reset/populate fields when dialog opens
  useEffect(() => {
    if (isOpen) {
      if (editingEvent) {
        setEventTitle(editingEvent.title)
        setEventDate(new Date(editingEvent.start || editingEvent.date))
        setEventLocation(editingEvent.location || "")
        setEventDescription(editingEvent.description || "")

        const startStr = editingEvent.start || ""
        if (startStr.includes("T")) {
          const dStart = new Date(startStr)
          setEventStartTime(
            `${String(dStart.getHours()).padStart(2, "0")}:${String(
              dStart.getMinutes()
            ).padStart(2, "0")}`
          )
        } else {
          setEventStartTime("09:00")
        }

        const endStr = editingEvent.end || ""
        if (endStr.includes("T")) {
          const dEnd = new Date(endStr)
          setEventEndTime(
            `${String(dEnd.getHours()).padStart(2, "0")}:${String(
              dEnd.getMinutes()
            ).padStart(2, "0")}`
          )
        } else {
          setEventEndTime("10:00")
        }
      } else {
        setEventTitle("")
        setEventDate(selectedDate || new Date())
        setEventStartTime("09:00")
        setEventEndTime("10:00")
        setEventLocation("")
        setEventDescription("")
      }
    }
  }, [isOpen, selectedDate, editingEvent])

  const formatDateForSubmit = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle.trim() || !eventDate) return

    await onSaveEvent({
      title: eventTitle,
      description: eventDescription,
      date: formatDateForSubmit(eventDate),
      startTime: eventStartTime,
      endTime: eventEndTime,
      location: eventLocation,
    }, editingEvent?.id)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isSubmitting && onOpenChange(open)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            {editingEvent
              ? "Update this event on your Google Calendar."
              : "Create a new event for your Google Calendar."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="event-title">Event Title</FieldLabel>
              <Input
                id="event-title"
                required
                disabled={isSubmitting}
                placeholder="e.g. Team Sync"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
              />
            </Field>

            <Field className="flex flex-col gap-1.5">
              <FieldLabel>Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="event-date-picker"
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className={cn(
                      "h-10 w-full justify-start border border-input px-3 py-2 text-left font-normal",
                      !eventDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    {eventDate ? (
                      format(eventDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={(d) => d && setEventDate(d)}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="event-start-time">Start Time</FieldLabel>
                <Input
                  id="event-start-time"
                  type="time"
                  required
                  disabled={isSubmitting}
                  value={eventStartTime}
                  onChange={(e) => setEventStartTime(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="event-end-time">End Time</FieldLabel>
                <Input
                  id="event-end-time"
                  type="time"
                  required
                  disabled={isSubmitting}
                  value={eventEndTime}
                  onChange={(e) => setEventEndTime(e.target.value)}
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="event-location">
                Location (Optional)
              </FieldLabel>
              <Input
                id="event-location"
                disabled={isSubmitting}
                placeholder="e.g. Zoom link or conference room"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="event-desc">
                Description (Optional)
              </FieldLabel>
              <Textarea
                id="event-desc"
                disabled={isSubmitting}
                placeholder="e.g. Discuss Q3 roadmap"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !eventTitle.trim() || !eventDate}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <Spinner className="size-3" />
                  Saving...
                </span>
              ) : (
                "Save Event"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
