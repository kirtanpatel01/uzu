"use server"

import { getSession } from "@/lib/auth/auth-server"
import { User } from "better-auth"
import { google } from "googleapis"
import { db } from "@/lib/db"

export const getUser = async (): Promise<User | undefined> => {
  const session = await getSession()
  return session.data?.user
}

function getEmailBody(payload: any): { body: string; isHtml: boolean } {
  let html = "";
  let text = "";

  function parsePart(part: any) {
    if (!part) return;

    if (part.body && part.body.data) {
      const decoded = Buffer.from(
        part.body.data.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf-8");

      const mime = part.mimeType?.toLowerCase();
      if (mime === "text/html") {
        html += decoded;
      } else if (mime === "text/plain") {
        text += decoded;
      }
    }

    if (part.parts) {
      for (const subPart of part.parts) {
        parsePart(subPart);
      }
    }
  }

  parsePart(payload);

  if (html) {
    return { body: html, isHtml: true };
  }
  return { body: text || payload?.snippet || "", isHtml: false };
}

export const getEmails = async () => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Unauthenticated!",
    }
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  const googleAccount = await db.account.findFirst({
    where: { userId: data.user.id, providerId: "google" },
  })

  if (!googleAccount) {
    return {
      success: false,
      message: "Google account connection not found. Please sign in again.",
    }
  }

  oauth2Client.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken,
    expiry_date: googleAccount.accessTokenExpiresAt
      ? new Date(googleAccount.accessTokenExpiresAt).getTime()
      : undefined,
  })

  // console.log("oauth2Client", oauth2Client)

  // 4. Initialize Gmail API client
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    const listResponse = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    })

    const messages = listResponse.data.messages || []

    const emailPromises = messages.map(async (msg) => {
      if (!msg.id) return null

      const detailResponse = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      })

      const detail = detailResponse.data
      const headers = detail.payload?.headers || []

      const subject = headers.find((h) => h.name?.toLowerCase() === "subject")?.value || "(No Subject)"
      const from = headers.find((h) => h.name?.toLowerCase() === "from")?.value || "Unknown Sender"
      const date = headers.find((h) => h.name?.toLowerCase() === "date")?.value || ""

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
  } catch (error) {
    console.error("Gmail API Error", error)
    return { success: false, message: "Failed to fetch emails" }
  }
}

export const sendEmail = async (to: string, subject: string, body: string) => {
  const { success, message, data } = await getSession()
  if (!success || !data) {
    return {
      success: false,
      message: message || "Please sign in to access your mailbox.",
    }
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )

  const googleAccount = await db.account.findFirst({
    where: { userId: data.user.id, providerId: "google" },
  })

  if (!googleAccount) {
    return {
      success: false,
      message: "Google account connection not found. Please sign in again.",
    }
  }

  oauth2Client.setCredentials({
    access_token: googleAccount.accessToken,
    refresh_token: googleAccount.refreshToken,
    expiry_date: googleAccount.accessTokenExpiresAt
      ? new Date(googleAccount.accessTokenExpiresAt).getTime()
      : undefined,
  })

  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client })

    // Construct raw MIME email message
    // Base64 encode the subject to safely handle Unicode/non-ASCII characters
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
    const messageParts = [
      `To: ${to}`,
      `Subject: ${utf8Subject}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      "",
      body,
    ];
    const rawMessage = messageParts.join("\n");
    
    // Base64url encode the entire email
    const encodedMessage = Buffer.from(rawMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    })

    return { success: true, message: "Email sent successfully!" }
  } catch (error: any) {
    console.error("Gmail API Send Error", error)
    return { success: false, message: error.message || "Failed to send email" }
  }
}
