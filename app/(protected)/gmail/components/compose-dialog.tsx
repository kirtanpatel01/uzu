"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { sendEmail } from "../actions"
import { EmailEditor } from "./email-editor"

interface ComposeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComposeDialog({ open, onOpenChange }: ComposeDialogProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const plainText = body.replace(/<[^>]*>/g, "").trim()
    if (!to || !subject || !plainText) {
      setError("Please fill in all fields.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await sendEmail(to, subject, body)
      if (res && res.success) {
        setSuccess(true)
        // Reset form
        setTo("")
        setSubject("")
        setBody("")
        // Close dialog after a short delay so user sees the success state
        setTimeout(() => {
          onOpenChange(false)
          setSuccess(false)
        }, 1000)
      } else {
        setError(res?.message || "Failed to send email. Please try again.")
      }
    } catch (err: any) {
      console.error(err)
      setError("An unexpected error occurred while sending the email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="to"
              className="text-xs font-semibold text-muted-foreground"
            >
              To
            </label>
            <Input
              id="to"
              type="email"
              placeholder="recipient@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="subject"
              className="text-xs font-semibold text-muted-foreground"
            >
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="body"
              className="text-xs font-semibold text-muted-foreground"
            >
              Message
            </label>
            <EmailEditor value={body} onChange={setBody} disabled={loading} />
          </div>

          {error && (
            <p className="text-xs font-medium text-destructive">{error}</p>
          )}

          {success && (
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
              Email sent successfully!
            </p>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  Sending...
                </>
              ) : (
                "Send"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
