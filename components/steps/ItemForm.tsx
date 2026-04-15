'use client'

import { useState, useEffect, useMemo } from 'react'
import { StepItem, Person, STATUSES, ITEM_TYPE_LABELS, USAGE_MODE_LABELS, ItemType, UsageMode, Status } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { OwnerSelect } from './OwnerSelect'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

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

function docToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; content?: unknown[] }
  if (typeof n.text === 'string') return n.text
  if (!Array.isArray(n.content)) return ''
  return n.content.map(docToText).join(' ').replace(/\s+/g, ' ').trim()
}

const SUB_PRIORITY_OPTIONS = ['', 'a', 'b', 'c', 'd', 'e', 'f']

const itemTypeDot: Record<string, string> = {
  ai_skill: 'bg-yellow-400',
  non_ai_infrastructure: 'bg-emerald-400',
  orchestration_component: 'bg-orange-400',
}

type PickerItem = {
  id: string
  title: string
  item_type: string
  stepTitle: string
}

function LinkPicker({
  label,
  selectedIds,
  onChange,
  items,
}: {
  label: string
  selectedIds: string[]
  onChange: (ids: string[]) => void
  items: PickerItem[]
}) {
  const grouped = useMemo(() => {
    const map: Record<string, { stepTitle: string; items: PickerItem[] }> = {}
    for (const i of items) {
      if (!map[i.stepTitle]) map[i.stepTitle] = { stepTitle: i.stepTitle, items: [] }
      map[i.stepTitle].items.push(i)
    }
    return Object.values(map)
  }, [items])

  function toggle(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id],
    )
  }

  return (
    <div>
      <Label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{label}</Label>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 mt-1 italic">No other items available.</p>
      ) : (
        <div className="mt-1 border border-slate-200 rounded-md max-h-44 overflow-y-auto bg-white">
          {grouped.map((group) => (
            <div key={group.stepTitle}>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 py-1 bg-slate-50 border-b border-slate-100 sticky top-0">
                {group.stepTitle}
              </p>
              {group.items.map((i) => (
                <label
                  key={i.id}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(i.id)}
                    onChange={() => toggle(i.id)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span
                    className={cn('inline-block w-2 h-2 rounded-full shrink-0', itemTypeDot[i.item_type] ?? 'bg-slate-300')}
                  />
                  <span className="text-xs text-slate-700 truncate">{i.title}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 ml-auto">{ITEM_TYPE_LABELS[i.item_type as ItemType] ?? i.item_type}</span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
      {selectedIds.length > 0 && (
        <p className="text-[11px] text-indigo-600 mt-1">{selectedIds.length} selected</p>
      )}
    </div>
  )
}

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
  const [githubUrl, setGithubUrl] = useState(item?.github_url ?? '')
  const [priorityMajor, setPriorityMajor] = useState<string>(
    item?.priority_major !== null && item?.priority_major !== undefined ? String(item.priority_major) : ''
  )
  const [prioritySub, setPrioritySub] = useState<string>(item?.priority_sub ?? '')
  const [saving, setSaving] = useState(false)

  // Link picker state (edit mode only)
  const isEditMode = Boolean(item?.id)
  const [linkedInputIds, setLinkedInputIds] = useState<string[]>([])
  const [linkedOutputIds, setLinkedOutputIds] = useState<string[]>([])
  const [pickerItems, setPickerItems] = useState<PickerItem[]>([])

  useEffect(() => {
    if (!item?.id) return

    Promise.all([
      supabase.from('step_item_links').select('*').eq('source_item_id', item.id),
      supabase.from('step_items').select('id, title, item_type, workflow_step_id').neq('id', item.id),
      supabase.from('workflow_steps').select('id, title').order('order_index'),
    ]).then(([linksRes, itemsRes, stepsRes]) => {
      const links = linksRes.data ?? []
      const allItems = itemsRes.data ?? []
      const allSteps = stepsRes.data ?? []

      setLinkedInputIds(links.filter((l) => l.link_type === 'input').map((l) => l.target_item_id))
      setLinkedOutputIds(links.filter((l) => l.link_type === 'output').map((l) => l.target_item_id))

      setPickerItems(
        allItems.map((i) => ({
          id: i.id,
          title: i.title,
          item_type: i.item_type,
          stepTitle: allSteps.find((s) => s.id === i.workflow_step_id)?.title ?? 'Unknown Step',
        })),
      )
    })
  }, [item?.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    // Save links first (only in edit mode — we need the item id)
    if (item?.id) {
      await supabase.from('step_item_links').delete().eq('source_item_id', item.id)
      const newLinks = [
        ...linkedInputIds.map((id) => ({ source_item_id: item.id!, target_item_id: id, link_type: 'input' as const })),
        ...linkedOutputIds.map((id) => ({ source_item_id: item.id!, target_item_id: id, link_type: 'output' as const })),
      ]
      if (newLinks.length > 0) {
        await supabase.from('step_item_links').insert(newLinks)
      }
    }

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
      github_url: githubUrl.trim() || null,
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

        {/* Priority */}
        <div className="md:col-span-2">
          <Label>Priority</Label>
          <div className="flex items-end gap-3 mt-1">
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 mb-1">Major (1–5)</p>
              <Input
                type="number"
                min={1}
                max={5}
                value={priorityMajor}
                onChange={(e) => {
                  setPriorityMajor(e.target.value)
                  if (e.target.value.trim() === '') setPrioritySub('')
                }}
                placeholder="1–5"
              />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 mb-1">Sub (a–f)</p>
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
          <Label htmlFor="github-url">GitHub URL</Label>
          <Input
            id="github-url"
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/…"
            className="mt-1"
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

        {/* Input / Output item links — edit mode only */}
        {isEditMode ? (
          <>
            <div className="md:col-span-2">
              <LinkPicker
                label="Linked Inputs"
                selectedIds={linkedInputIds}
                onChange={setLinkedInputIds}
                items={pickerItems}
              />
            </div>
            <div className="md:col-span-2">
              <LinkPicker
                label="Linked Outputs"
                selectedIds={linkedOutputIds}
                onChange={setLinkedOutputIds}
                items={pickerItems}
              />
            </div>
          </>
        ) : (
          <p className="md:col-span-2 text-[11px] text-slate-400 italic">
            Save the item first, then re-open it to add linked inputs / outputs.
          </p>
        )}
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
