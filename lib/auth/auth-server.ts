"use server"

import { headers } from "next/headers"
import { auth } from "."

export type SessionData = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>

interface GetSession {
  success: boolean
  message: string
  data?: SessionData
}

export const getSession = async (): Promise<GetSession> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session)
    return {
      success: false,
      message: "Please sign in to access your mailbox.",
    }
  return {
    success: true,
    message: "Session found successfully.",
    data: session,
  }
}

export async function getSessionTenantId(): Promise<string | null> {
  const session = await getSession();
  if(!session) return null;
  return session?.data?.user?.id || null;
}