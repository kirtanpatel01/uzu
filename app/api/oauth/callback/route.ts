import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { corsair } from "@/lib/corsair"

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")

  if (error) {
    return new NextResponse(
      `<html><body><h2>Authorization failed</h2><p>${escapeHtml(error)}</p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    )
  }

  if (!code || !state) {
    return new NextResponse("<p>Missing code or state.</p>", { status: 400 })
  }

  try {
    const result = await corsair.manage.connect.oauthCallback({ code, state })
    console.log(result)
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    url.searchParams.set("connected", encodeURIComponent(result.plugin))
    return NextResponse.redirect(url)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new NextResponse(
      `<html><body><h2>OAuth error</h2><p>${escapeHtml(message)}</p></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } }
    )
  }
}
