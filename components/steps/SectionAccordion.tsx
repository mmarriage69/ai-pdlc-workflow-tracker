'use client'

import { useState } from 'react'
import { StepSection } from '@/lib/types'
import { RichTextEditor, RichTextDisplay } from '@/components/editor/RichTextEditor'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Pencil, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'

interface SectionAccordionProps {
  section: StepSection
  isFirst: boolean
  isLast: boolean
  onUpdate: (data: Partial<StepSection>) => Promise<void>
  onDelete?: () => Promise<void>
}

export function SectionAccordion({ section, isFirst, isLast, onUpdate, onDelete }: SectionAccordionProps) {
  const [collapsed, setCollapsed] = useState(section.is_collapsed_default)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<object>(section.content_json)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await onUpdate({ content_json: draft })
    setSaving(false)
    setEditing(false)
  }

  async function handleMoveUp() {
    await onUpdate({ order_index: section.order_index - 1 })
  }

  async function handleMoveDown() {
    await onUpdate({ order_index: section.order_index + 1 })
  }

  async function handleDelete() {
    if (!confirm(`Delete section "${section.title}"?`)) return
    await onDelete?.()
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white section-accordion">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-t-lg"
        onClick={() => !editing && setCollapsed(!collapsed)}
      >
        <div className="text-gray-400 shrink-0">
          {collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 flex-1">{section.title}</h3>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 print:hidden"
            onClick={handleMoveUp}
            disabled={isFirst}
            title="Move up"
          >
            <ArrowUp size={13} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 print:hidden"
            onClick={handleMoveDown}
            disabled={isLast}
            title="Move down"
          >
            <ArrowDown size={13} />
          </Button>
          {!editing && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 print:hidden"
              onClick={() => {
                setCollapsed(false)
                setEditing(true)
                setDraft(section.content_json)
              }}
              title="Edit section"
            >
              <Pencil size={13} />
            </Button>
          )}
          {!section.is_default && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-400 hover:text-red-600 print:hidden"
              onClick={handleDelete}
              title="Delete section"
            >
              <Trash2 size={13} />
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      {(!collapsed || editing) && (
        <div className="border-t border-gray-100 px-4 py-3">
          {editing ? (
            <div>
              <RichTextEditor
                content={draft}
                onChange={setDraft}
                editable
              />
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(false)
                    setDraft(section.content_json)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <RichTextDisplay content={section.content_json} />
          )}
        </div>
      )}

      {/* Always render for print even if collapsed */}
      {collapsed && !editing && (
        <div className="hidden print:block border-t border-gray-100 px-4 py-3">
          <RichTextDisplay content={section.content_json} />
        </div>
      )}
    </div>
  )
}
