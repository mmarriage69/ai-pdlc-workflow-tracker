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

export function ItemForm({ item, people, onSave, onCancel }: ItemFormProps) {
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
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
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

        <div>
          <Label>Owner</Label>
          <OwnerSelect
            people={people}
            value={ownerId}
            onChange={setOwnerId}
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label>Builder / Resource</Label>
          <OwnerSelect
            people={people}
            value={builderId}
            onChange={setBuilderId}
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
