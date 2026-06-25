"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { useEffect } from "react"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link2,
  Undo2,
  Redo2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EmailEditorProps {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
}

export function EmailEditor({
  value,
  onChange,
  disabled = false,
}: EmailEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer hover:text-primary/80",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Synchronize external value changes (e.g. form resets)
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  // Synchronize disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Enter link URL:", previousUrl)

    if (url === null) return

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // Simple protocol validation
    let href = url
    if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
      href = `https://${url}`
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href }).run()
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border transition-all duration-200 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10",
        disabled && "pointer-events-none bg-muted/20 opacity-60"
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/20 p-1.5 select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95",
            editor.isActive("bold") &&
              "bg-primary/10 text-primary hover:bg-primary/15"
          )}
          title="Bold"
        >
          <Bold className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95",
            editor.isActive("italic") &&
              "bg-primary/10 text-primary hover:bg-primary/15"
          )}
          title="Italic"
        >
          <Italic className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95",
            editor.isActive("underline") &&
              "bg-primary/10 text-primary hover:bg-primary/15"
          )}
          title="Underline"
        >
          <UnderlineIcon className="size-4" />
        </button>

        <div className="mx-1 h-4 w-px bg-border" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95",
            editor.isActive("bulletList") &&
              "bg-primary/10 text-primary hover:bg-primary/15"
          )}
          title="Bullet List"
        >
          <List className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95",
            editor.isActive("orderedList") &&
              "bg-primary/10 text-primary hover:bg-primary/15"
          )}
          title="Numbered List"
        >
          <ListOrdered className="size-4" />
        </button>

        <button
          type="button"
          onClick={setLink}
          className={cn(
            "rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95",
            editor.isActive("link") &&
              "bg-primary/10 text-primary hover:bg-primary/15"
          )}
          title="Add Link"
        >
          <Link2 className="size-4" />
        </button>

        <div className="mx-1 ml-auto h-4 w-px bg-border" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          title="Undo"
        >
          <Undo2 className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted/70 hover:text-foreground active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          title="Redo"
        >
          <Redo2 className="size-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent
        editor={editor}
        className="max-h-[350px] min-h-[220px] cursor-text overflow-y-auto p-4 text-sm leading-relaxed"
      />
    </div>
  )
}
