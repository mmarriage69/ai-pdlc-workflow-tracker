'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import {
  WorkflowStep, StepSection, StepItem, Person, STATUSES, Status,
  ITEM_TYPE_LABELS, USAGE_MODE_LABELS,
} from '@/lib/types'
import { StatusBadge } from './StatusBadge'
import { OwnerSelect } from './OwnerSelect'
import { SectionAccordion } from './SectionAccordion'
import { ItemCard } from './ItemCard'
import { ItemForm } from './ItemForm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, FileDown } from 'lucide-react'
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

interface StepDetailPageProps {
  slug: string
}

export function StepDetailPage({ slug }: StepDetailPageProps) {
  const [step, setStep] = useState<WorkflowStep | null>(null)
  const [sections, setSections] = useState<StepSection[]>([])
  const [items, setItems] = useState<StepItem[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [addingSection, setAddingSection] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState('')
  const [addingItem, setAddingItem] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const loadData = useCallback(async () => {
    const [stepRes, peopleRes] = await Promise.all([
      supabase.from('workflow_steps').select('*').eq('slug', slug).single(),
      supabase.from('people').select('*').order('first_name'),
    ])

    if (!stepRes.data) { setLoading(false); return }

    const [sectionsRes, itemsRes] = await Promise.all([
      supabase.from('step_sections').select('*').eq('workflow_step_id', stepRes.data.id).order('order_index'),
      supabase.from('step_items').select('*').eq('workflow_step_id', stepRes.data.id).order('order_index'),
    ])

    setStep(stepRes.data)
    setSections(sectionsRes.data ?? [])
    setItems(itemsRes.data ?? [])
    setPeople(peopleRes.data ?? [])
    setLoading(false)
  }, [slug])

  useEffect(() => { loadData() }, [loadData])

  // Auto-complete step when all non-ignored items are complete
  const checkAutoComplete = useCallback(async (stepId: string, currentItems: StepItem[]) => {
    const activeItems = currentItems.filter((i) => i.status !== 'Ignore')
    if (activeItems.length > 0 && activeItems.every((i) => i.status === 'Complete')) {
      const { data } = await supabase.from('workflow_steps').update({ status: 'Complete' }).eq('id', stepId).select().single()
      if (data) setStep(data)
    }
  }, [])

  async function updateStepOwner(field: 'owner_person_id' | 'metric_owner_person_id', personId: string | null) {
    if (!step) return
    const { data } = await supabase.from('workflow_steps').update({ [field]: personId }).eq('id', step.id).select().single()
    if (data) setStep(data)
  }

  async function updateStepStatus(value: string | null) {
    if (!step || !value) return
    const status = value as Status
    const { data } = await supabase.from('workflow_steps').update({ status }).eq('id', step.id).select().single()
    if (data) setStep(data)
  }

  async function updateSection(sectionId: string, data: Partial<StepSection>) {
    if (!step) return
    // Handle reorder
    if ('order_index' in data && !('content_json' in data)) {
      const section = sections.find((s) => s.id === sectionId)!
      const newIdx = data.order_index!
      const currentIdx = section.order_index

      // Swap with adjacent
      const swapSection = sections.find((s) => s.order_index === currentIdx + Math.sign(newIdx - currentIdx))
      if (!swapSection) return

      await Promise.all([
        supabase.from('step_sections').update({ order_index: swapSection.order_index }).eq('id', section.id),
        supabase.from('step_sections').update({ order_index: section.order_index }).eq('id', swapSection.id),
      ])

      setSections((prev) =>
        prev.map((s) => {
          if (s.id === section.id) return { ...s, order_index: swapSection.order_index }
          if (s.id === swapSection.id) return { ...s, order_index: section.order_index }
          return s
        }).sort((a, b) => a.order_index - b.order_index)
      )
      return
    }

    const { data: updated } = await supabase.from('step_sections').update(data).eq('id', sectionId).select().single()
    if (updated) {
      setSections((prev) => prev.map((s) => s.id === sectionId ? updated : s))
    }
  }

  async function deleteSection(sectionId: string) {
    await supabase.from('step_sections').delete().eq('id', sectionId)
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
  }

  async function addSection() {
    if (!step || !newSectionTitle.trim()) return
    const maxOrder = sections.reduce((m, s) => Math.max(m, s.order_index), 0)
    const { data } = await supabase.from('step_sections').insert({
      workflow_step_id: step.id,
      title: newSectionTitle.trim(),
      order_index: maxOrder + 1,
      content_json: {},
      is_default: false,
      is_collapsed_default: false,
    }).select().single()
    if (data) {
      setSections((prev) => [...prev, data])
      setNewSectionTitle('')
      setAddingSection(false)
    }
  }

  async function updateItem(itemId: string, data: Partial<StepItem>) {
    if (!step) return
    if ('order_index' in data && Object.keys(data).length === 1) {
      // Reorder
      const item = items.find((i) => i.id === itemId)!
      const newIdx = data.order_index!
      const swapItem = items.find((i) => i.order_index === newIdx)
      if (!swapItem) return
      await Promise.all([
        supabase.from('step_items').update({ order_index: swapItem.order_index }).eq('id', item.id),
        supabase.from('step_items').update({ order_index: item.order_index }).eq('id', swapItem.id),
      ])
      setItems((prev) =>
        prev.map((i) => {
          if (i.id === item.id) return { ...i, order_index: swapItem.order_index }
          if (i.id === swapItem.id) return { ...i, order_index: item.order_index }
          return i
        }).sort((a, b) => a.order_index - b.order_index)
      )
      return
    }
    const { data: updated } = await supabase.from('step_items').update(data).eq('id', itemId).select().single()
    if (updated) {
      const newItems = items.map((i) => i.id === itemId ? updated : i)
      setItems(newItems)
      await checkAutoComplete(step.id, newItems)
    }
  }

  async function deleteItem(itemId: string) {
    if (!step) return
    await supabase.from('step_items').delete().eq('id', itemId)
    const newItems = items.filter((i) => i.id !== itemId)
    setItems(newItems)
    await checkAutoComplete(step.id, newItems)
  }

  async function addItem(data: Partial<StepItem>) {
    if (!step) return
    const maxOrder = items.reduce((m, i) => Math.max(m, i.order_index), 0)
    const { data: created } = await supabase.from('step_items').insert({
      workflow_step_id: step.id,
      title: data.title ?? 'New Item',
      item_type: data.item_type ?? 'ai_skill',
      status: data.status ?? 'Pending',
      usage_mode: data.usage_mode ?? 'standalone',
      owner_person_id: data.owner_person_id ?? null,
      builder_person_id: data.builder_person_id ?? null,
      description_json: data.description_json ?? {},
      inputs_json: data.inputs_json ?? {},
      outputs_json: data.outputs_json ?? {},
      notes_json: data.notes_json ?? {},
      order_index: maxOrder + 1,
    }).select().single()
    if (created) {
      const newItems = [...items, created]
      setItems(newItems)
      setAddingItem(false)
      await checkAutoComplete(step.id, newItems)
    }
  }

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-slate-100 rounded-xl animate-pulse w-48" />
        <div className="h-4 bg-slate-100 rounded-xl animate-pulse w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!step) {
    return (
      <div className="p-6">
        <p className="text-slate-400">Step not found.</p>
      </div>
    )
  }

  const owner = people.find((p) => p.id === step.owner_person_id)
  const metricOwner = people.find((p) => p.id === step.metric_owner_person_id)

  return (
    <div className="p-6 max-w-4xl" ref={printRef}>
      {/* Print header */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{step.title}</h1>
        <div className="flex gap-4 mt-2 text-sm text-gray-600">
          <span>Status: {step.status}</span>
          {owner && <span>Owner: {owner.first_name} {owner.last_name}</span>}
          {metricOwner && <span>Metric Owner: {metricOwner.first_name} {metricOwner.last_name}</span>}
        </div>
      </div>

      {/* Interactive header */}
      <div className="print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-900">{step.title}</h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Step {step.order_index} of 6</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={step.status} onValueChange={updateStepStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
              <FileDown size={14} />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Owner row */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
          <div className="flex-1 min-w-48">
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">Accountable Owner</p>
            <OwnerSelect
              people={people}
              value={step.owner_person_id}
              onChange={(id) => updateStepOwner('owner_person_id', id)}
              placeholder="Unassigned"
              className="w-full bg-white"
            />
          </div>
          <div className="flex-1 min-w-48">
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">Metric Owner</p>
            <OwnerSelect
              people={people}
              value={step.metric_owner_person_id}
              onChange={(id) => updateStepOwner('metric_owner_person_id', id)}
              placeholder="Unassigned"
              className="w-full bg-white"
            />
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Status', value: <StatusBadge status={step.status} />, accent: 'top-0 left-0 right-0 h-0.5 bg-indigo-400' },
            { label: 'AI Skills', value: items.filter((i) => i.item_type === 'ai_skill').length, accent: 'top-0 left-0 right-0 h-0.5 bg-blue-400' },
            { label: 'Non-AI Components', value: items.filter((i) => i.item_type === 'non_ai_infrastructure').length, accent: 'top-0 left-0 right-0 h-0.5 bg-slate-400' },
            { label: 'Orchestration', value: items.filter((i) => i.item_type === 'orchestration_component').length, accent: 'top-0 left-0 right-0 h-0.5 bg-purple-400' },
          ].map(({ label, value, accent }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm relative overflow-hidden">
              <div className={`absolute ${accent}`} />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
              <div className="mt-1.5 text-sm font-semibold text-slate-900">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2 mb-6">
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 print:hidden">Sections</h2>
        {sections.map((section, idx) => (
          <SectionAccordion
            key={section.id}
            section={section}
            isFirst={idx === 0}
            isLast={idx === sections.length - 1}
            onUpdate={(data) => updateSection(section.id, data)}
            onDelete={section.is_default ? undefined : () => deleteSection(section.id)}
          />
        ))}
      </div>

      {/* Add section */}
      <div className="mb-8 print:hidden">
        {addingSection ? (
          <div className="flex gap-2 items-center">
            <Input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Section title…"
              className="max-w-xs"
              onKeyDown={(e) => e.key === 'Enter' && addSection()}
              autoFocus
            />
            <Button size="sm" onClick={addSection} disabled={!newSectionTitle.trim()}>Add</Button>
            <Button size="sm" variant="outline" onClick={() => { setAddingSection(false); setNewSectionTitle('') }}>Cancel</Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setAddingSection(true)} className="gap-1.5">
            <Plus size={14} />
            Add Section
          </Button>
        )}
      </div>

      {/* Skills / Components */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Skills &amp; Components ({items.length})
          </h2>
          <div className="flex gap-3 text-xs text-slate-400 print:hidden">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400" /> AI: {items.filter((i) => i.item_type === 'ai_skill').length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-400" /> Non-AI: {items.filter((i) => i.item_type === 'non_ai_infrastructure').length}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-400" /> Orch: {items.filter((i) => i.item_type === 'orchestration_component').length}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <ItemCard
              key={item.id}
              item={item}
              people={people}
              isFirst={idx === 0}
              isLast={idx === items.length - 1}
              onUpdate={(data) => updateItem(item.id, data)}
              onDelete={() => deleteItem(item.id)}
              onMoveUp={() => updateItem(item.id, { order_index: item.order_index - 1 })}
              onMoveDown={() => updateItem(item.id, { order_index: item.order_index + 1 })}
            />
          ))}

          {items.length === 0 && !addingItem && (
            <p className="text-sm text-slate-400 py-6 text-center border border-dashed border-slate-200 rounded-xl">
              No skills or components yet.
            </p>
          )}

          {/* Print-only full item details */}
          <div className="hidden print:block space-y-4 mt-4">
            {items.map((item) => {
              const owner = people.find((p) => p.id === item.owner_person_id)
              const builder = people.find((p) => p.id === item.builder_person_id)
              return (
                <div key={item.id} className="border border-gray-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{item.title}</span>
                    <span className="text-xs text-gray-500">{ITEM_TYPE_LABELS[item.item_type]}</span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">{item.status}</span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">{USAGE_MODE_LABELS[item.usage_mode]}</span>
                  </div>
                  {docToText(item.description_json) && (
                    <p className="text-sm text-gray-700 mb-1">{docToText(item.description_json)}</p>
                  )}
                  {docToText(item.inputs_json) && (
                    <p className="text-xs text-gray-600"><strong>Inputs:</strong> {docToText(item.inputs_json)}</p>
                  )}
                  {docToText(item.outputs_json) && (
                    <p className="text-xs text-gray-600"><strong>Outputs:</strong> {docToText(item.outputs_json)}</p>
                  )}
                  {owner && <p className="text-xs text-gray-600"><strong>Owner:</strong> {owner.first_name} {owner.last_name}</p>}
                  {builder && <p className="text-xs text-gray-600"><strong>Builder:</strong> {builder.first_name} {builder.last_name}</p>}
                  {docToText(item.notes_json) && (
                    <p className="text-xs text-gray-600 mt-1"><strong>Notes:</strong> {docToText(item.notes_json)}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Add item */}
        <div className="mt-3 print:hidden">
          {addingItem ? (
            <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/30 shadow-sm mt-2">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Add Skill / Component</h3>
              <ItemForm
                people={people}
                onSave={addItem}
                onCancel={() => setAddingItem(false)}
              />
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setAddingItem(true)} className="gap-1.5 mt-2">
              <Plus size={14} />
              Add Skill / Component
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
