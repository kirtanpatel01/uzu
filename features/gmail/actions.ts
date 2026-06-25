"use server"

import { getSession } from "@/lib/auth/auth-server"
import { User } from "better-auth"
import { corsair } from "@/lib/corsair"
import { getEmailBody, encodeMimeMessage } from "./utils"

export const getUser = async (): Promise<User | undefined> => {
  const session = await getSession()
  return session.data?.user
}

export const sendEmail = async (to: string, subject: string, body: string) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Please sign in to access your mailbox.",
    }
  }

  try {
    const client = corsair.withTenant(data.user.id)
    const encodedMessage = encodeMimeMessage(to, subject, body)

    await client.gmail.api.messages.send({
      raw: encodedMessage,
    })

    return { success: true, message: "Email sent successfully!" }
  } catch (error: any) {
    console.error("Gmail Corsair API Send Error", error)
    return { success: false, message: error.message || "Failed to send email" }
  }
}

export const getEmailsUsingCorsair = async () => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  try {
    const client = corsair.withTenant(data.user.id)
    const response = await client.gmail.api.messages.list({
      maxResults: 10,
    })

    const messagesList = response.messages || []

    const emailPromises = messagesList.map(async (msg) => {
      if (!msg.id) return null

      const detail = await client.gmail.api.messages.get({
        id: msg.id,
      })

      const headers = detail.payload?.headers || []

      const subject =
        headers.find((h) => h.name?.toLowerCase() === "subject")?.value ||
        "(No Subject)"
      const from =
        headers.find((h) => h.name?.toLowerCase() === "from")?.value ||
        "Unknown Sender"
      const date =
        headers.find((h) => h.name?.toLowerCase() === "date")?.value || ""

      const { body, isHtml } = getEmailBody(detail.payload)

      return {
        id: msg.id,
        subject,
        from,
        snippet: detail.snippet || "",
        body,
        isHtml,
        date,
        labelIds: detail.labelIds || [],
      }
    })

    const emails = (await Promise.all(emailPromises)).filter(
      (email): email is NonNullable<typeof email> => email !== null
    )

    return { success: true, data: emails }
  } catch (error: any) {
    console.error("Gmail Corsair API Error", error)
    return { success: false, message: error.message || "Failed to fetch emails" }
  }
}