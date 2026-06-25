export interface FormattedCalendarEvent {
  id: string
  title: string
  description: string
  time: string
  date: string
  location: string
  start: string
  end: string
}

export function formatCalendarEvent(event: any): FormattedCalendarEvent {
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
}

export function parseLocalTimes(date: string, startTime: string, endTime: string) {
  const startStr = `${date}T${startTime}:00`
  const endStr = `${date}T${endTime}:00`
  return {
    startDate: new Date(startStr),
    endDate: new Date(endStr),
  }
}
