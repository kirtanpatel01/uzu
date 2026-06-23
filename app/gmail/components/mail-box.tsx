"use client"
import { useEffect, useState } from "react"
import { getEmails } from "../actions"
import {
  MailOpen,
  AlertCircle,
  RefreshCw,
  Inbox,
  ChevronDown,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { EmailBody } from "./email-body"
import { MailboxSkeleton } from "./mailbox-skeleton"
import {
  getInitials,
  getAvatarColor,
  cleanSender,
  getSenderEmail,
  formatShortDate,
} from "./mail-utils"

interface Email {
  id: string
  subject: string
  from: string
  snippet: string
  body?: string
  isHtml?: boolean
  date?: string
}

export default function Mailbox() {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null)

  const fetchMail = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const res = await getEmails()
      if (res && res.success && res.data) {
        setEmails(res.data)
      } else {
        setError(res?.message || "Failed to load emails")
      }
    } catch (err) {
      console.error(err)
      setError("An unexpected error occurred while contacting the server")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMail()
  }, [])

  const selectedEmail = emails.find((e) => e.id === selectedEmailId)

  if (loading) {
    return <MailboxSkeleton />
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-tight">Sync Failed</h3>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {error}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMail()}
          className="mx-auto flex items-center gap-2"
        >
          <RefreshCw className="size-3.5" />
          <span>Try Again</span>
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-stretch gap-6 lg:flex-row",
        selectedEmailId ? "pt-16 px-0 pb-0 lg:p-4 lg:pt-16" : "p-4 pt-16"
      )}
    >
      {/* Left panel: Mail list */}
      <div
        className={cn(
          "flex h-full w-full shrink-0 flex-col gap-4 lg:w-[350px] xl:w-[400px]",
          selectedEmailId && "hidden lg:flex" // Hide list on mobile if email is open
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-2">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Inbox className="size-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Inbox</h2>
            {emails.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {emails.length}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            disabled={refreshing}
            onClick={() => fetchMail(true)}
            className={cn(
              "rounded-lg hover:bg-muted",
              refreshing && "opacity-75"
            )}
          >
            <RefreshCw
              className={cn(
                "size-4 text-muted-foreground",
                refreshing && "animate-spin"
              )}
            />
          </Button>
        </div>

        {/* Email list container */}
        <div className="flex-1 scrollbar-thin space-y-2.5 overflow-y-auto pr-1">
          {emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <MailOpen className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-semibold">Your inbox is clear</h4>
                <p className="max-w-xs text-sm text-muted-foreground">
                  No new messages found.
                </p>
              </div>
            </div>
          ) : (
            emails.map((email) => {
              const isSelected = selectedEmailId === email.id
              const initials = getInitials(email.from)
              const avatarGrad = getAvatarColor(email.from)
              const cleanName = cleanSender(email.from)

              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={cn(
                    "cursor-pointer rounded-2xl border border-border bg-card p-3.5 transition-all duration-200 select-none",
                    "hover:border-muted-foreground/20 hover:bg-muted/30 hover:shadow-xs",
                    isSelected &&
                      "border-primary/20 bg-primary/5 shadow-xs ring-1 ring-primary/10"
                  )}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-[10px] font-bold text-white shadow-xs",
                        avatarGrad
                      )}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="block truncate text-xs font-semibold text-foreground">
                          {cleanName}
                        </span>
                        {email.date && (
                          <span className="shrink-0 text-[10px] whitespace-nowrap text-muted-foreground">
                            {formatShortDate(email.date)}
                          </span>
                        )}
                      </div>
                      <h4 className="mt-0.5 truncate text-xs font-medium text-foreground/90">
                        {email.subject}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                        {email.snippet}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Right panel: Active Email details */}
      <div
        className={cn(
          "flex h-full flex-1 flex-col overflow-hidden bg-card",
          selectedEmailId
            ? "flex rounded-none border-0 shadow-none lg:rounded-2xl lg:border lg:border-border lg:shadow-xs"
            : "hidden lg:flex lg:rounded-2xl lg:border lg:border-border lg:shadow-xs items-center justify-center p-8 text-center text-muted-foreground"
        )}
      >
        {selectedEmail ? (
          <div className="flex h-full flex-col overflow-hidden">
            {/* Detail Header */}
            <div className="shrink-0 space-y-2 border-b border-border bg-muted/10 p-4 sm:p-5">
              {/* Controls */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEmailId(null)}
                className="-ml-2 flex items-center gap-1.5 text-xs text-muted-foreground lg:hidden"
              >
                <ArrowLeft className="size-4" />
                <span>Back to Inbox</span>
              </Button>

              {/* Subject */}
              <h2 className="text-lg leading-tight font-bold tracking-tight text-foreground lg:text-xl">
                {selectedEmail.subject}
              </h2>

              {/* Sender Details */}
              <div className="flex items-start gap-3.5">
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-xs font-bold text-white shadow-sm",
                    getAvatarColor(selectedEmail.from)
                  )}
                >
                  {getInitials(selectedEmail.from)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="block text-sm font-semibold text-foreground">
                        {cleanSender(selectedEmail.from)}
                      </span>
                      {getSenderEmail(selectedEmail.from) && (
                        <span className="block text-xs text-muted-foreground">
                          {getSenderEmail(selectedEmail.from)}
                        </span>
                      )}
                    </div>
                    {selectedEmail.date && (
                      <span className="shrink-0 self-start text-xs text-muted-foreground sm:self-center">
                        {selectedEmail.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Body Content */}
            <div className="flex-1 overflow-y-auto bg-muted/5 p-2 lg:p-5">
              <EmailBody
                content={selectedEmail.body || selectedEmail.snippet}
                isHtml={!!selectedEmail.isHtml}
              />
            </div>
          </div>
        ) : (
          <div className="my-auto flex flex-col items-center justify-center space-y-3.5 p-8 text-center">
            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <MailOpen className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                No message selected
              </h3>
              <p className="max-w-xs text-sm text-muted-foreground">
                Select an email from the list on the left to read its contents
                and attachments.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
