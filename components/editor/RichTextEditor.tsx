'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Link as LinkIcon, Highlighter, Palette
} from 'lucide-react'

interface RichTextEditorProps {
  content: object
  onChange?: (json: object) => void
  editable?: boolean
  className?: string
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      title={title}
      className={cn(
        'p-1.5 rounded text-sm transition-colors',
        active
          ? 'bg-gray-200 text-gray-900'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({ content, onChange, editable = true, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: content && Object.keys(content).length > 0 ? content : undefined,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2',
          editable && 'border-0'
        ),
      },
    },
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editable)
    }
  }, [editor, editable])

  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      const currentJSON = JSON.stringify(editor.getJSON())
      const newJSON = JSON.stringify(content)
      if (currentJSON !== newJSON && content && Object.keys(content).length > 0) {
        editor.commands.setContent(content)
      }
    }
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div className={cn('rounded-md border border-gray-200 bg-white', className)}>
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </ToolbarButton>

          <span className="w-px h-4 bg-gray-300 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet list"
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered list"
          >
            <ListOrdered size={14} />
          </ToolbarButton>

          <span className="w-px h-4 bg-gray-300 mx-1" />

          <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Add link">
            <LinkIcon size={14} />
          </ToolbarButton>

          <span className="w-px h-4 bg-gray-300 mx-1" />

          <div className="relative flex items-center" title="Text color">
            <Palette size={14} className="text-gray-600 mr-0.5" />
            <input
              type="color"
              className="w-5 h-5 cursor-pointer opacity-0 absolute inset-0"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              title="Text color"
            />
            <Palette size={14} className="text-gray-600 pointer-events-none" />
          </div>

          <div className="relative flex items-center ml-0.5" title="Highlight">
            <input
              type="color"
              className="w-5 h-5 cursor-pointer opacity-0 absolute inset-0"
              onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
              title="Highlight color"
            />
            <Highlighter size={14} className="text-gray-600 pointer-events-none" />
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  )
}

export function RichTextDisplay({ content, className }: { content: object; className?: string }) {
  return (
    <RichTextEditor content={content} editable={false} className={cn('border-0', className)} />
  )
}
