import { Inbox, MailOpen, RefreshCw, SquarePen } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

export function MailboxSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-stretch lg:flex-row">
      {/* Left List Skeleton */}
      <div className="flex h-full w-full shrink-0 flex-col overflow-hidden border-r lg:w-[350px] xl:w-[400px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex size-7 items-center justify-center rounded-md bg-muted/60 text-muted-foreground/30">
              <Inbox className="size-4" />
            </div>
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </div>

          <div className="flex items-center gap-1">
            <div className="flex size-8 items-center justify-center rounded-lg">
              <SquarePen className="size-4 text-muted-foreground/20" />
            </div>
            <div className="flex size-8 items-center justify-center rounded-lg">
              <RefreshCw className="size-4 text-muted-foreground/20" />
            </div>
          </div>
        </div>

        {/* Tabs Switcher Skeleton */}
        <div className="w-full p-3 pb-1.5">
          <div className="flex h-9 w-full gap-1 rounded-lg bg-muted p-1">
            <div className="h-full flex-1 rounded-md bg-background/80 shadow-xs" />
            <div className="h-full flex-1 rounded-md" />
          </div>
        </div>

        {/* Email list container */}
        <ScrollArea className="flex-1 min-h-0 overflow-hidden">
          <div className="space-y-2.5 pl-3 pr-7 pt-1.5 pb-3">
            {/* Skeleton Items with varying widths to look realistic */}
            {[
              {
                nameWidth: "w-20",
                subWidth: "w-36",
                snip1Width: "w-full",
                snip2Width: "w-4/5",
              },
              {
                nameWidth: "w-16",
                subWidth: "w-28",
                snip1Width: "w-[92%]",
                snip2Width: "w-[60%]",
              },
              {
                nameWidth: "w-24",
                subWidth: "w-40",
                snip1Width: "w-full",
                snip2Width: "w-[75%]",
              },
              {
                nameWidth: "w-18",
                subWidth: "w-32",
                snip1Width: "w-[88%]",
                snip2Width: "w-[50%]",
              },
              {
                nameWidth: "w-22",
                subWidth: "w-44",
                snip1Width: "w-full",
                snip2Width: "w-2/3",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-border bg-card p-3.5 select-none"
              >
                {/* Avatar Skeleton */}
                <Skeleton className="size-8 shrink-0 rounded-full" />

                {/* Content Skeleton */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className={`h-3 ${item.nameWidth}`} />
                    <Skeleton className="h-2.5 w-10" />
                  </div>
                  <Skeleton className={`h-3.5 ${item.subWidth} mt-1`} />
                  <div className="mt-1.5 space-y-1">
                    <Skeleton className={`h-3 ${item.snip1Width}`} />
                    <Skeleton className={`h-3 ${item.snip2Width}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Detail Skeleton (shows the 'No message selected' view exactly, which matches standard loading state) */}
      <div className="hidden flex-1 flex-col items-center justify-center overflow-hidden bg-card p-8 text-center text-muted-foreground lg:flex">
        <div className="my-auto flex flex-col items-center justify-center space-y-3.5">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <MailOpen className="size-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              No message selected
            </h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Select an email from the list on the left to read its contents and
              attachments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
