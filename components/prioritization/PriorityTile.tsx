'use client'

import { useState } from 'react'
import { StepItem, Person, Status } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ItemForm } from '@/components/steps/ItemForm'
import { Pencil, Trash2 } from 'lucide-react'
import type { EnrichedItem } from './PrioritizationPage'

// ── Plain-text extractor for detail_json (TipTap format) ─────────────────────
function docToText(doc: object | null | undefined): string {
  if (!doc) return ''
  const d = doc as { content?: { content?: { content?: { text?: string }[] }[] }[] }
  try {
    return (
      d.content
        ?.map((b) =>
          b.content
            ?.map((i) => i.content?.map((t) => t.text ?? '').join('') ?? '')
            .join('\n') ?? ''
        )
        .join('\n') ?? ''
    )
  } catch {
    return ''
  }
}

// ── Styles ────────────────────────────────────────────────────────────────────

const typeBorderColor: Record<string, string> = {
  ai_skill: 'border-l-yellow-400',
  non_ai_infrastructure: 'border-l-emerald-400',
  orchestration_component: 'border-l-orange-400',
}

const typeBg: Record<string, string> = {
  ai_skill: 'bg-yellow-50/60',
  non_ai_infrastructure: 'bg-emerald-50/60',
  orchestration_component: 'bg-orange-50/60',
}

const statusPillClass: Record<Status, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  'In Development': 'bg-indigo-100 text-indigo-700',
  Complete: 'bg-emerald-100 text-emerald-700',
  Ignore: 'bg-slate-100 text-slate-500',
}

const statusShortLabel: Record<Status, string> = {
  Pending: 'Pending',
  'In Development': 'In Dev',
  Complete: 'Complete',
  Ignore: 'Ignore',
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PriorityTileProps {
  item: EnrichedItem
  people: Person[]
  onUpdate: (data: Partial<StepItem>) => Promise<void>
  onDelete: () => Promise<void>
  onPersonAdded?: (person: Person) => void
}

export function PriorityTile({
  item,
  people,
  onUpdate,
  onDelete,
  onPersonAdded,
}: PriorityTileProps) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const owner = people.find((p) => p.id === item.owner_person_id)
  const builder = people.find((p) => p.id === item.builder_person_id)
  const ownerLabel = owner ? `O - ${owner.first_name} ${owner.last_name}` : 'O - Unassigned'
  const builderLabel = builder ? `B - ${builder.first_name} ${builder.last_name}` : 'B - Unassigned'

  // Detail explanation plain text for hover tooltip
  const detailText = docToText(item.detail_json)

  async function handleDelete() {
    if (!confirm('Delete this item?')) return
    setDeleting(true)
    await onDelete()
    setDeleting(false)
  }

  return (
    <>
      {/* Fixed-size tile: h-[152px] × w-full */}
      <div
        title={detailText || undefined}
        className={cn(
          'w-full h-[152px] rounded-lg border border-slate-200 shadow-sm',
          'border-l-4 flex flex-col p-2 overflow-hidden',
          typeBorderColor[item.item_type],
          typeBg[item.item_type],
        )}
      >
        {/* Title row + action buttons */}
        <div className="flex items-start gap-1">
          <p className="text-[10px] font-semibold text-slate-800 line-clamp-2 flex-1 leading-snug">
            {item.title}
          </p>
          <div className="flex items-center gap-0.5 shrink-0 -mt-0.5">
            <button
              onClick={() => setEditing(true)}
              className="p-0.5 rounded text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
              title="Edit"
            >
              <Pencil size={10} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-0.5 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={10} />
            </button>
          </div>
        </div>

        {/* Step name */}
        <p className="text-[8.5px] text-slate-400 truncate mt-0.5 leading-none">
          {item.stepTitle}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Status + Owner + Builder */}
        <div className="flex flex-col gap-0.5">
          <span
            className={cn(
              'text-[8px] font-bold px-1 py-0.5 rounded-sm w-fit leading-none',
              statusPillClass[item.status],
            )}
          >
            {statusShortLabel[item.status]}
          </span>
          <span
            className={cn(
              'text-[8px] px-1 py-0.5 rounded-sm leading-none truncate',
              owner ? 'text-indigo-700 bg-indigo-50' : 'text-slate-400',
            )}
          >
            {ownerLabel}
          </span>
          <span
            className={cn(
              'text-[8px] px-1 py-0.5 rounded-sm leading-none truncate',
              builder ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400',
            )}
          >
            {builderLabel}
          </span>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editing}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditing(false)
        }}
      >
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
