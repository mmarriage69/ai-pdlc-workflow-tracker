'use client'

import { useState } from 'react'
import { StepItem, Person, STATUSES, ITEM_TYPE_LABELS, USAGE_MODE_LABELS, ItemType, UsageMode, Status } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OwnerSelect } from './OwnerSelect'
import { Textarea } from '@/components/ui/textarea'

interface ItemFormProps {
  item?: Partial<StepItem>
  people: Person[]
  onSave: (data: Partial<StepItem>) => Promise<void>
  onCancel: () => void
  onPersonAdded?: (person: Person) => void
}

function textToDoc(text: string): object {
  return {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
  }
}

function docToText(doc: object): string {
  const d = doc as { content?: { content?: { content?: { text?: string }[] }[] }[] }
  try {
    return d.content?.map(b => b.content?.map(i => i.content?.map(t => t.text ?? '').join('') ?? '').join('') ?? '').join('\n') ?? ''
  } catch {
    return ''
  }
}

const SUB_PRIORITY_OPTIONS = ['', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

export function ItemForm({ item, people, onSave, onCancel, onPersonAdded }: ItemFormProps) {
  const [title, setTitle] = useState(item?.title ?? '')
  const [itemType, setItemType] = useState<ItemType>(item?.item_type ?? 'ai_skill')
  const [status, setStatus] = useState<Status>(item?.status ?? 'Pending')
  const [usageMode, setUsageMode] = useState<UsageMode>(item?.usage_mode ?? 'standalone')
  const [ownerId, setOwnerId] = useState<string | null>(item?.owner_person_id ?? null)
  const [builderId, setBuilderId] = useState<string | null>(item?.builder_person_id ?? null)
  const [description, setDescription] = useState(docToText(item?.description_json ?? {}))
  const [inputs, setInputs] = useState(docToText(item?.inputs_json ?? {}))
  const [outputs, setOutputs] = useState(docToText(item?.outputs_json ?? {}))
  const [notes, setNotes] = useState(docToText(item?.notes_json ?? {}))
  const [priorityMajor, setPriorityMajor] = useState<string>(
    item?.priority_major !== null && item?.priority_major !== undefined ? String(item.priority_major) : ''
  )
  const [prioritySub, setPrioritySub] = useState<string>(item?.priority_sub ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const major = priorityMajor.trim() !== '' ? parseInt(priorityMajor, 10) : null
    await onSave({
      title,
      item_type: itemType,
      status,
      usage_mode: usageMode,
      owner_person_id: ownerId,
      builder_person_id: builderId,
      description_json: description ? textToDoc(description) : {},
      inputs_json: inputs ? textToDoc(inputs) : {},
      outputs_json: outputs ? textToDoc(outputs) : {},
      notes_json: notes ? textToDoc(notes) : {},
      priority_major: major,
      priority_sub: major !== null && prioritySub ? prioritySub : null,
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label>Item Type</Label>
          <Select value={itemType} onValueChange={(v) => setItemType(v as ItemType)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ITEM_TYPE_LABELS) as [ItemType, string][]).map(([v, label]) => (
                <SelectItem key={v} value={v}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Usage Mode</Label>
          <Select value={usageMode} onValueChange={(v) => setUsageMode(v as UsageMode)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(USAGE_MODE_LABELS) as [UsageMode, string][]).map(([v, label]) => (
                <SelectItem key={v} value={v}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority — Major + Sub on the same line */}
        <div className="md:col-span-2">
          <Label>Priority</Label>
          <div className="flex items-end gap-3 mt-1">
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 mb-1">Major (1, 2, 3…)</p>
              <Input
                type="number"
                min={1}
                max={99}
                value={priorityMajor}
                onChange={(e) => {
                  setPriorityMajor(e.target.value)
                  if (e.target.value.trim() === '') setPrioritySub('')
                }}
                placeholder="e.g. 1"
              />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 mb-1">Sub (a, b, c…)</p>
              <Select
                value={prioritySub}
                onValueChange={(v) => setPrioritySub(v ?? '')}
                disabled={priorityMajor.trim() === ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {SUB_PRIORITY_OPTIONS.map((v) => (
                    <SelectItem key={v === '' ? '__none__' : v} value={v}>
                      {v === '' ? 'None' : v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {priorityMajor.trim() !== '' && (
              <div className="shrink-0 pb-0.5">
                <p className="text-[11px] text-slate-400 mb-1">Preview</p>
                <span className="inline-flex items-center px-2 py-1.5 rounded border bg-amber-50 text-amber-700 border-amber-200 text-sm font-bold tabular-nums">
                  {priorityMajor}{prioritySub}
                </span>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>Owner</Label>
          <OwnerSelect
            people={people}
            value={ownerId}
            onChange={setOwnerId}
            onPersonAdded={onPersonAdded}
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label>Builder / Resource</Label>
          <OwnerSelect
            people={people}
            value={builderId}
            onChange={setBuilderId}
            onPersonAdded={onPersonAdded}
            placeholder="Unassigned"
            className="mt-1 w-full"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="inputs">Inputs</Label>
          <Textarea
            id="inputs"
            value={inputs}
            onChange={(e) => setInputs(e.target.value)}
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="outputs">Outputs</Label>
          <Textarea
            id="outputs"
            value={outputs}
            onChange={(e) => setOutputs(e.target.value)}
            rows={2}
            className="mt-1"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving || !title.trim()} size="sm">
          {saving ? 'Saving…' : 'Save'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
