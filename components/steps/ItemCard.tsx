'use client'

import { useState } from 'react'
import { StepItem, Person, ITEM_TYPE_LABELS, USAGE_MODE_LABELS } from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { ItemForm } from './ItemForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronRight, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const itemTypeBadgeClass: Record<string, string> = {
  ai_skill: 'bg-blue-50 text-blue-700 border-blue-200',
  non_ai_infrastructure: 'bg-gray-100 text-gray-700 border-gray-200',
  orchestration_component: 'bg-purple-50 text-purple-700 border-purple-200',
}

function docToText(doc: object): string {
  const d = doc as { content?: { content?: { content?: { text?: string }[] }[] }[] }
  try {
    return d.content?.map(b => b.content?.map(i => i.content?.map(t => t.text ?? '').join('') ?? '').join('\n') ?? '').join('\n') ?? ''
  } catch {
    return ''
  }
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-gray-700 mt-0.5">{value}</p>
    </div>
  )
}

interface ItemCardProps {
  item: StepItem
  people: Person[]
  isFirst: boolean
  isLast: boolean
  onUpdate: (data: Partial<StepItem>) => Promise<void>
  onDelete: () => Promise<void>
  onMoveUp: () => Promise<void>
  onMoveDown: () => Promise<void>
}

export function ItemCard({ item, people, isFirst, isLast, onUpdate, onDelete, onMoveUp, onMoveDown }: ItemCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const owner = people.find((p) => p.id === item.owner_person_id)
  const builder = people.find((p) => p.id === item.builder_person_id)

  async function handleDelete() {
    if (!confirm('Delete this item?')) return
    setDeleting(true)
    await onDelete()
    setDeleting(false)
  }

  if (editing) {
    return (
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
        <ItemForm
          item={item}
          people={people}
          onSave={async (data) => {
            await onUpdate(data)
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div
        className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="mt-0.5 text-gray-400">
          {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{item.title}</span>
            <Badge
              variant="outline"
              className={cn('text-xs', itemTypeBadgeClass[item.item_type])}
            >
              {ITEM_TYPE_LABELS[item.item_type]}
            </Badge>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {USAGE_MODE_LABELS[item.usage_mode]}
            {owner && ` · ${owner.first_name} ${owner.last_name}`}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700"
            onClick={onMoveUp}
            disabled={isFirst}
            title="Move up"
          >
            <ArrowUp size={13} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700"
            onClick={onMoveDown}
            disabled={isLast}
            title="Move down"
          >
            <ArrowDown size={13} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-red-400 hover:text-red-600"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Description" value={docToText(item.description_json)} />
          <Field label="Usage Mode" value={USAGE_MODE_LABELS[item.usage_mode]} />
          <Field label="Inputs" value={docToText(item.inputs_json)} />
          <Field label="Outputs" value={docToText(item.outputs_json)} />
          {owner && <Field label="Owner" value={`${owner.first_name} ${owner.last_name}`} />}
          {builder && <Field label="Builder / Resource" value={`${builder.first_name} ${builder.last_name}`} />}
          <Field label="Notes" value={docToText(item.notes_json)} />
        </div>
      )}
    </div>
  )
}
