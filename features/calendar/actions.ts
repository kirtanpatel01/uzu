"use server"

import { getSession } from "@/lib/auth/auth-server"
import { corsair } from "@/lib/corsair"
import { formatCalendarEvent, parseLocalTimes } from "./utils"

export const getCalendarEvents = async (year: number, month: number) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  try {
    const client = corsair.withTenant(data.user.id)

    // Calculate ISO boundary strings for the selected month
    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 1)

    const response = await client.googlecalendar.api.events.getMany({
      calendarId: "primary",
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    })

    const events = response.items || []
    const formattedEvents = events.map(formatCalendarEvent)

    return {
      success: true,
      data: formattedEvents,
    }
  } catch (error: any) {
    console.error("Google Calendar Events List Error:", error)
    return {
      success: false,
      message: error.message || "Failed to retrieve calendar events.",
    }
  }
}

export const createCalendarEvent = async (eventData: {
  title: string
  description?: string
  date: string // YYYY-MM-DD
  startTime: string // HH:MM
  endTime: string // HH:MM
  location?: string
}) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  try {
    const client = corsair.withTenant(data.user.id)
    const { startDate, endDate } = parseLocalTimes(
      eventData.date,
      eventData.startTime,
      eventData.endTime
    )

    const response = await client.googlecalendar.api.events.create({
      calendarId: "primary",
      event: {
        summary: eventData.title,
        description: eventData.description || "",
        location: eventData.location || "",
        start: {
          dateTime: startDate.toISOString(),
        },
        end: {
          dateTime: endDate.toISOString(),
        },
      },
    })

    return {
      success: true,
      data: response,
    }
  } catch (error: any) {
    console.error("Google Calendar Create Event Error:", error)
    return {
      success: false,
      message: error.message || "Failed to create calendar event.",
    }
  }
}

export const getCalendarAvailability = async (year: number, month: number) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  try {
    const client = corsair.withTenant(data.user.id)

    // Calculate ISO boundary strings for the selected month
    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 1)

    const response = await client.googlecalendar.api.calendar.getAvailability({
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      items: [{ id: "primary" }],
    })

    const busyTimes = response.calendars?.primary?.busy || []

    return {
      success: true,
      data: busyTimes,
    }
  } catch (error: any) {
    console.error("Google Calendar Availability Error:", error)
    return {
      success: false,
      message: error.message || "Failed to retrieve calendar availability.",
    }
  }
}

export const deleteCalendarEvent = async (eventId: string) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  try {
    const client = corsair.withTenant(data.user.id)

    await client.googlecalendar.api.events.delete({
      calendarId: "primary",
      id: eventId,
    })

    return {
      success: true,
      message: "Event deleted successfully!",
    }
  } catch (error: any) {
    console.error("Google Calendar Delete Event Error:", error)
    return {
      success: false,
      message: error.message || "Failed to delete calendar event.",
    }
  }
}

export const updateCalendarEvent = async (
  eventId: string,
  eventData: {
    title: string
    description?: string
    date: string // YYYY-MM-DD
    startTime: string // HH:MM
    endTime: string // HH:MM
    location?: string
  }
) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  try {
    const client = corsair.withTenant(data.user.id)
    const { startDate, endDate } = parseLocalTimes(
      eventData.date,
      eventData.startTime,
      eventData.endTime
    )

    const response = await client.googlecalendar.api.events.update({
      calendarId: "primary",
      id: eventId,
      event: {
        summary: eventData.title,
        description: eventData.description || "",
        location: eventData.location || "",
        start: {
          dateTime: startDate.toISOString(),
        },
        end: {
          dateTime: endDate.toISOString(),
        },
      },
    })

    return {
      success: true,
      data: response,
    }
  } catch (error: any) {
    console.error("Google Calendar Update Event Error:", error)
    return {
      success: false,
      message: error.message || "Failed to update calendar event.",
    }
  }
}


