"use server"

import { getSession } from "@/lib/auth/auth-server"
import { google } from "googleapis"
import { db } from "@/lib/db"

export const getCalendarEvents = async (year: number, month: number) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  const googleAccount = await db.account.findFirst({
    where: { userId: data.user.id, providerId: "google" },
  })

  if (!googleAccount) {
    return {
      success: false,
      message: "Google account connection not found. Please sign in again.",
    }
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken,
    expiry_date: googleAccount.accessTokenExpiresAt
      ? new Date(googleAccount.accessTokenExpiresAt).getTime()
      : undefined,
  })

  try {
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    })

    // Calculate ISO boundary strings for the selected month
    const startOfMonth = new Date(year, month, 1)
    const endOfMonth = new Date(year, month + 1, 1)

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: startOfMonth.toISOString(),
      timeMax: endOfMonth.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    })

    const events = response.data.items || []

    const formattedEvents = events.map((event) => {
      const startStr = event.start?.dateTime || event.start?.date || ""
      const endStr = event.end?.dateTime || event.end?.date || ""

      // Generate standard YYYY-MM-DD date key matching local timezone calculations
      const d = new Date(startStr)
      const yr = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      const dateKey = `${yr}-${m}-${day}`

      // Format time string to 12-hour AM/PM format (e.g. 09:00 AM)
      let timeStr = "All Day"
      if (startStr.includes("T")) {
        const hours = d.getHours()
        const minutes = String(d.getMinutes()).padStart(2, "0")
        const ampm = hours >= 12 ? "PM" : "AM"
        const hours12 = hours % 12 || 12
        timeStr = `${String(hours12).padStart(2, "0")}:${minutes} ${ampm}`
      }

      return {
        id: event.id || "",
        title: event.summary || "Untitled Event",
        description: event.description || "",
        time: timeStr,
        date: dateKey,
        location: event.location || "",
        start: startStr,
        end: endStr,
      }
    })

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

  const googleAccount = await db.account.findFirst({
    where: { userId: data.user.id, providerId: "google" },
  })

  if (!googleAccount) {
    return {
      success: false,
      message: "Google account connection not found. Please sign in again.",
    }
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken,
    expiry_date: googleAccount.accessTokenExpiresAt
      ? new Date(googleAccount.accessTokenExpiresAt).getTime()
      : undefined,
  })

  try {
    const calendar = google.calendar({
      version: "v3",
      auth: oauth2Client,
    })

    // Construct start and end dates in the environment's local timezone
    const startStr = `${eventData.date}T${eventData.startTime}:00`
    const endStr = `${eventData.date}T${eventData.endTime}:00`
    const startDate = new Date(startStr)
    const endDate = new Date(endStr)

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
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
      data: response.data,
    }
  } catch (error: any) {
    console.error("Google Calendar Create Event Error:", error)
    return {
      success: false,
      message: error.message || "Failed to create calendar event.",
    }
  }
}
