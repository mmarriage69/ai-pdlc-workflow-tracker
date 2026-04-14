'use client'

import { useState, useEffect, useRef } from 'react'
import { StepItem, Person, ITEM_TYPE_LABELS, USAGE_MODE_LABELS } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { ItemForm } from './ItemForm'
import { RichTextEditor, RichTextDisplay } from '@/components/editor/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChevronDown, ChevronRight, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const itemTypeBadgeClass: Record<string, string> = {
  ai_skill: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  non_ai_infrastructure: 'bg-slate-100 text-slate-600 border-slate-200 font-semibold',
  orchestration_component: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
}

function docToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; content?: unknown[] }
  if (typeof n.text === 'string') return n.text
  if (!Array.isArray(n.content)) return ''
  return n.content.map(docToText).join(' ').replace(/\s+/g, ' ').trim()
}

function formatPriority(major: number | null, sub: string | null): string | null {
  if (major === null || major === undefined) return null
  return `${major}${sub ?? ''}`
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{value}</p>
    </div>
  )
}

interface ItemCardProps {
  item: StepItem
  people: Person[]
  isFirst: boolean
  isLast: boolean
  initialExpanded?: boolean
  hideReorder?: boolean
  onUpdate: (data: Partial<StepItem>) => Promise<void>
  onDelete: () => Promise<void>
  onMoveUp: () => Promise<void>
  onMoveDown: () => Promise<void>
  onPersonAdded?: (person: Person) => void
}

export function ItemCard({ item, people, isFirst, isLast, initialExpanded, hideReorder, onUpdate, onDelete, onMoveUp, onMoveDown, onPersonAdded }: ItemCardProps) {
  const [expanded, setExpanded] = useState(initialExpanded ?? false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Scroll into view when navigated to from the swimlane
  useEffect(() => {
    if (initialExpanded && cardRef.current) {
      setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150)
    }
  }, [initialExpanded])
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Detailed explanation sub-section
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailEditing, setDetailEditing] = useState(false)
  const [detailDraft, setDetailDraft] = useState<object>(item.detail_json ?? {})
  const [detailSaving, setDetailSaving] = useState(false)

  // Skill creation prompt sub-section
  const [promptOpen, setPromptOpen] = useState(false)
  const [promptEditing, setPromptEditing] = useState(false)
  const [promptDraft, setPromptDraft] = useState(item.prompt_text ?? '')
  const [promptSaving, setPromptSaving] = useState(false)

  const owner = people.find((p) => p.id === item.owner_person_id)
  const builder = people.find((p) => p.id === item.builder_person_id)
  const priority = formatPriority(item.priority_major, item.priority_sub)

  async function handleDelete() {
    if (!confirm('Delete this item?')) return
    setDeleting(true)
    await onDelete()
    setDeleting(false)
  }

  async function saveDetail() {
    setDetailSaving(true)
    await onUpdate({ detail_json: detailDraft })
    setDetailSaving(false)
    setDetailEditing(false)
  }

  async function savePrompt() {
    setPromptSaving(true)
    await onUpdate({ prompt_text: promptDraft })
    setPromptSaving(false)
    setPromptEditing(false)
  }

  return (
    <>
      <div id={`item-${item.id}`} ref={cardRef} className="border border-slate-200 rounded-xl bg-white shadow-sm">
        {/* Card header row */}
        <div
          className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="mt-0.5 text-slate-400 shrink-0">
            {expanded ? <ChevronDown size={15} className="text-indigo-400" /> : <ChevronRight size={15} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority badge — always visible */}
              <span
                className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded border shrink-0 tabular-nums',
                  priority
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-300 border-slate-200'
                )}
              >
                {priority ?? '—'}
              </span>
              <span className="text-sm font-semibold text-slate-800">{item.title}</span>
              <Badge
                variant="outline"
                className={cn('text-xs', itemTypeBadgeClass[item.item_type])}
              >
                {ITEM_TYPE_LABELS[item.item_type]}
              </Badge>
              <StatusBadge status={item.status} />
            </div>
            {/* Second row: usage mode + O-owner + B-builder (always shown) */}
            <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{USAGE_MODE_LABELS[item.usage_mode]}</span>
              <span className={cn('font-medium', owner ? 'text-indigo-600' : 'text-slate-300')}>
                O - {owner ? `${owner.first_name} ${owner.last_name}` : 'Unassigned'}
              </span>
              <span className={cn('font-medium', builder ? 'text-emerald-600' : 'text-slate-300')}>
                B - {builder ? `${builder.first_name} ${builder.last_name}` : 'Unassigned'}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {!hideReorder && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                  onClick={onMoveUp}
                  disabled={isFirst}
                  title="Move up"
                >
                  <ArrowUp size={13} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                  onClick={onMoveDown}
                  disabled={isLast}
                  title="Move down"
                >
                  <ArrowDown size={13} />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"
              onClick={() => setEditing(true)}
              title="Edit"
            >
              <Pencil size={13} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        </div>

        {/* Expanded body */}
        {expanded && (
          <div className="border-t border-slate-100">
            {/* Main fields grid */}
            <div className="px-4 pt-3 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Priority — always shown, major + sub on same line */}
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Priority</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Major</span>
                    <span className={cn(
                      'text-xs font-bold px-1.5 py-0.5 rounded border tabular-nums',
                      item.priority_major !== null && item.priority_major !== undefined
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    )}>
                      {item.priority_major ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400">Sub</span>
                    <span className={cn(
                      'text-xs font-bold px-1.5 py-0.5 rounded border',
                      item.priority_sub
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-50 text-slate-300 border-slate-200'
                    )}>
                      {item.priority_sub ?? '—'}
                    </span>
                  </div>
                </div>
              </div>

              <Field label="Description" value={docToText(item.description_json)} />
              <Field label="Usage Mode" value={USAGE_MODE_LABELS[item.usage_mode]} />
              <Field label="Inputs" value={docToText(item.inputs_json)} />
              <Field label="Outputs" value={docToText(item.outputs_json)} />
              <Field label="Owner" value={owner ? `${owner.first_name} ${owner.last_name}` : 'Unassigned'} />
              {builder && <Field label="Builder / Resource" value={`${builder.first_name} ${builder.last_name}`} />}
              <Field label="Notes" value={docToText(item.notes_json)} />
            </div>

            {/* AI-skill-only sub-sections */}
            {item.item_type === 'ai_skill' && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">

                {/* Detailed Explanation */}
                <div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => setDetailOpen(!detailOpen)}
                  >
                    <div className="flex items-center gap-2">
                      {detailOpen
                        ? <ChevronDown size={13} className="text-indigo-400 shrink-0" />
                        : <ChevronRight size={13} className="text-slate-400 shrink-0" />}
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Detailed Explanation
                      </span>
                    </div>
                    {!detailEditing && (
                      <span
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDetailDraft(item.detail_json ?? {})
                          setDetailOpen(true)
                          setDetailEditing(true)
                        }}
                      >
                        Edit
                      </span>
                    )}
                  </button>
                  {detailOpen && (
                    <div className="px-4 pb-3">
                      {detailEditing ? (
                        <>
                          <RichTextEditor
                            content={detailDraft}
                            onChange={setDetailDraft}
                            className="mb-2"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={saveDetail}
                              disabled={detailSaving}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              {detailSaving ? 'Saving…' : 'Save'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setDetailEditing(false)
                                setDetailDraft(item.detail_json ?? {})
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="text-sm">
                          {item.detail_json && Object.keys(item.detail_json).length > 0
                            ? <RichTextDisplay content={item.detail_json} />
                            : <p className="text-slate-400 italic py-1">No detailed explanation yet.</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Skill Creation Prompt */}
                <div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
                    onClick={() => setPromptOpen(!promptOpen)}
                  >
                    <div className="flex items-center gap-2">
                      {promptOpen
                        ? <ChevronDown size={13} className="text-indigo-400 shrink-0" />
                        : <ChevronRight size={13} className="text-slate-400 shrink-0" />}
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        Skill Creation Prompt
                      </span>
                    </div>
                    {!promptEditing && (
                      <span
                        className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPromptDraft(item.prompt_text ?? '')
                          setPromptOpen(true)
                          setPromptEditing(true)
                        }}
                      >
                        Edit
                      </span>
                    )}
                  </button>
                  {promptOpen && (
                    <div className="px-4 pb-3">
                      {promptEditing ? (
                        <>
                          <textarea
                            value={promptDraft}
                            onChange={(e) => setPromptDraft(e.target.value)}
                            className="w-full border border-slate-200 rounded-md p-2.5 text-sm font-mono text-slate-800 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2 resize-y"
                            placeholder="Paste your Claude Code prompt here…"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={savePrompt}
                              disabled={promptSaving}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              {promptSaving ? 'Saving…' : 'Save'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPromptEditing(false)
                                setPromptDraft(item.prompt_text ?? '')
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div>
                          {item.prompt_text
                            ? (
                              <pre className="text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-3 whitespace-pre-wrap overflow-x-auto">
                                {item.prompt_text}
                              </pre>
                            )
                            : <p className="text-sm text-slate-400 italic py-1">No prompt yet.</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit modal — same dialog as Add */}
      <Dialog open={editing} onOpenChange={(isOpen) => { if (!isOpen) setEditing(false) }}>
        <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Skill / Component</DialogTitle>
          </DialogHeader>
          <ItemForm
            item={item}
            people={people}
            onSave={async (data) => {
              await onUpdate(data)
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
            onPersonAdded={onPersonAdded}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
