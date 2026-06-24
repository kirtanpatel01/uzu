export function MailboxSkeleton() {
  return (
    <div className="flex h-full w-full flex-col lg:flex-row gap-6 p-4 pt-16 animate-pulse">
      {/* Left List Skeleton */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="h-8 w-24 rounded-lg bg-muted" />
          <div className="h-8 w-8 rounded-lg bg-muted" />
        </div>
        <div className="flex-1 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 border border-border bg-card rounded-2xl flex gap-3">
              <div className="size-8 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-1/3 rounded bg-muted" />
                  <div className="h-2 w-10 rounded bg-muted" />
                </div>
                <div className="h-3.5 w-3/4 rounded bg-muted" />
                <div className="h-2.5 w-5/6 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Right Detail Skeleton */}
      <div className="hidden lg:flex flex-1 flex-col bg-card border border-border rounded-2xl overflow-hidden p-6 space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-1/4 rounded bg-muted" />
          <div className="h-7 w-3/4 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-3.5 pb-4 border-b border-border">
          <div className="size-10 rounded-full bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-3.5 w-32 rounded bg-muted" />
            <div className="h-2.5 w-48 rounded bg-muted" />
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
          <div className="h-3 w-2/3 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
