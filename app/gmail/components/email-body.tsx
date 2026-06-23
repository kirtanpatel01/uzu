"use client"
import { useEffect, useState, useRef } from "react"

interface EmailBodyProps {
  content: string
  isHtml: boolean
}

export function EmailBody({ content, isHtml }: EmailBodyProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState("200px")

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleResize = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (doc && doc.body) {
          // Temporarily shrink height to measure true scrollHeight without growing indefinitely
          iframe.style.height = "0px"
          const newHeight =
            doc.documentElement.scrollHeight || doc.body.scrollHeight
          iframe.style.height = `${newHeight + 24}px`
          setHeight(`${newHeight + 24}px`)
        }
      } catch (err) {
        console.error("Failed to resize iframe:", err)
      }
    }

    iframe.addEventListener("load", handleResize)

    // Also try running it after a small timeout to let dynamic resources/images load
    const timer = setTimeout(handleResize, 500)

    return () => {
      iframe.removeEventListener("load", handleResize)
      clearTimeout(timer)
    }
  }, [content])

  if (!isHtml) {
    return (
      <div className="rounded-xl border border-border bg-muted/40 p-4 font-sans text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-foreground/90">
        {content}
      </div>
    )
  }

  const hasHtmlTags = content.includes("<html") || content.includes("<!DOCTYPE")

  const styledContent = hasHtmlTags
    ? `${content}
       <style>
         img { max-width: 100% !important; height: auto !important; }
         a { color: #2563eb !important; text-decoration: underline !important; }
       </style>`
    : `<!DOCTYPE html>
       <html>
         <head>
           <meta charset="utf-8">
           <style>
             body {
               font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
               margin: 0;
               padding: 0px;
               font-size: 14px;
               line-height: 1.5;
               color: #1f2937;
               background-color: #ffffff;
             }
             @media (min-width: 640px) {
               body {
                 padding: 12px;
               }
             }
             img {
               max-width: 100%;
               height: auto;
             }
             a {
               color: #2563eb;
               text-decoration: underline;
             }
           </style>
         </head>
         <body>
           ${content}
         </body>
       </html>`

  return (
    <div className="w-full overflow-hidden rounded-none border-0 bg-transparent shadow-none sm:rounded-xl sm:border sm:border-border sm:bg-white sm:shadow-sm">
      <iframe
        ref={iframeRef}
        srcDoc={styledContent}
        style={{ height, width: "100%", border: "none", overflow: "hidden" }}
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        className="w-full transition-all duration-300"
      />
    </div>
  )
}
