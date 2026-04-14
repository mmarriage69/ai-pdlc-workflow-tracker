'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { StepItem, Person } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ItemCard } from '@/components/steps/ItemCard'
import { ResourceLevelingModal } from './ResourceLevelingModal'
import { Users } from 'lucide-react'

export type EnrichedItem = StepItem & {
  stepTitle: string
  stepSlug: string
}

const MAJOR_PRIORITIES = [1, 2, 3, 4, 5]
const SUB_PRIORITIES = ['a', 'b', 'c', 'd', 'e', 'f']

export function PrioritizationPage() {
  const [items, setItems] = useState<EnrichedItem[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [resourceModalOpen, setResourceModalOpen] = useState(false)
  const [dragOverKey, setDragOverKey] = useState<string | null>(null)
  const dragItemIdRef = useRef<string | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('workflow_steps').select('id, slug, title').order('order_index'),
      supabase.from('step_items').select('*').order('order_index'),
      supabase.from('people').select('*'),
    ]).then(([stepsRes, itemsRes, peopleRes]) => {
      const steps = stepsRes.data ?? []
      const rawItems = itemsRes.data ?? []
      const enriched: EnrichedItem[] = rawItems.map((item) => {
        const step = steps.find((s) => s.id === item.workflow_step_id)
        return {
          ...item,
          stepTitle: step?.title ?? 'Unknown Step',
          stepSlug: step?.slug ?? '',
        }
      })
      setItems(enriched)
      setPeople(peopleRes.data ?? [])
      setLoading(false)
    })
  }, [])

  /* ── Drag handlers ────────────────────────────────────────────── */

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    dragItemIdRef.current = itemId
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDragOverKey(null)
    dragItemIdRef.current = null
  }

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverKey(key)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverKey(null)
    }
  }

  const handleDrop = async (
    e: React.DragEvent,
    major: number | null,
    sub: string | null,
  ) => {
    e.preventDefault()
    setDragOverKey(null)
    const itemId = dragItemIdRef.current
    if (!itemId) return
    dragItemIdRef.current = null

    await supabase
      .from('step_items')
      .update({ priority_major: major, priority_sub: sub })
      .eq('id', itemId)

    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, priority_major: major, priority_sub: sub } : i,
      ),
    )
  }

  /* ── Item mutation handlers ───────────────────────────────────── */

  const handleUpdateItem = useCallback(
    async (itemId: string, data: Partial<StepItem>) => {
      await supabase.from('step_items').update(data).eq('id', itemId)
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, ...data } : i)),
      )
    },
    [],
  )

  const handleDeleteItem = useCallback(async (itemId: string) => {
    await supabase.from('step_items').delete().eq('id', itemId)
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }, [])

  const handlePersonAdded = useCallback((person: Person) => {
    setPeople((prev) => [...prev, person])
  }, [])

  /* ── Derived data ─────────────────────────────────────────────── */

  const gridItems = (major: number, sub: string) =>
    items.filter((i) => i.priority_major === major && i.priority_sub === sub)

  // Items with no major priority (or major but no sub) go to unprioritized
  const unprioritized = items.filter(
    (i) =>
      i.priority_major === null ||
      i.priority_major === undefined ||
      !i.priority_sub,
  )

  /* ── Loading ──────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="p-6">
        <div className="h-96 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
      </div>
    )
  }

  /* ── Render ───────────────────────────────────────────────────── */

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Prioritization</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setResourceModalOpen(true)}
        >
          <Users size={14} />
          Resource Leveling
        </Button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-yellow-200 border border-yellow-300" />
          AI Skills
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-200 border border-emerald-300" />
          Non-AI Infrastructure
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-orange-200 border border-orange-300" />
          Orchestration / Workflow
        </span>
        <span className="ml-auto text-slate-400">
          Drag tiles to assign priority
        </span>
      </div>

      {/* Priority grid */}
      <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
        {/* Column headers (sub-priorities) */}
        <div
          className="grid border-b-2 border-slate-200 bg-slate-50"
          style={{ gridTemplateColumns: '68px repeat(6, 1fr)' }}
        >
          <div className="border-r border-slate-200" />
          {SUB_PRIORITIES.map((sub) => (
            <div
              key={sub}
              className="px-2 py-2.5 text-center border-r last:border-r-0 border-slate-200"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {sub}
              </span>
            </div>
          ))}
        </div>

        {/* Rows: P1–P5 */}
        {MAJOR_PRIORITIES.map((major, majorIdx) => (
          <div
            key={major}
            className={cn(
              'grid',
              majorIdx < MAJOR_PRIORITIES.length - 1 && 'border-b border-slate-200',
            )}
            style={{ gridTemplateColumns: '68px repeat(6, 1fr)' }}
          >
            {/* Row label */}
            <div className="flex items-start justify-center px-2 py-3 border-r border-slate-200 bg-slate-50 shrink-0">
              <span className="text-sm font-bold text-slate-600 mt-1">
                P{major}
              </span>
            </div>

            {/* Cells */}
            {SUB_PRIORITIES.map((sub, subIdx) => {
              const key = `${major}-${sub}`
              const cellItemList = gridItems(major, sub)
              const isDragOver = dragOverKey === key

              return (
                <div
                  key={sub}
                  className={cn(
                    'p-2 flex flex-col gap-2 min-h-[80px] transition-colors',
                    subIdx < SUB_PRIORITIES.length - 1 && 'border-r border-slate-200',
                    isDragOver
                      ? 'bg-indigo-50 ring-2 ring-inset ring-indigo-300'
                      : 'bg-white',
                  )}
                  onDragOver={(e) => handleDragOver(e, key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, major, sub)}
                >
                  {cellItemList.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5 px-1 truncate">
                        {item.stepTitle}
                      </p>
                      <ItemCard
                        item={item}
                        people={people}
                        isFirst={false}
                        isLast={false}
                        hideReorder={true}
                        onUpdate={async (data) => handleUpdateItem(item.id, data)}
                        onDelete={async () => handleDeleteItem(item.id)}
                        onMoveUp={async () => {}}
                        onMoveDown={async () => {}}
                        onPersonAdded={handlePersonAdded}
                      />
                    </div>
                  ))}
                  {cellItemList.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-[11px] text-slate-200">—</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Not Yet Prioritized */}
      <div
        className={cn(
          'rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 min-h-[120px] transition-colors',
          dragOverKey === 'unprioritized'
            ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200'
            : '',
        )}
        onDragOver={(e) => handleDragOver(e, 'unprioritized')}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, null, null)}
      >
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Not Yet Prioritized ({unprioritized.length})
        </p>
        {unprioritized.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {unprioritized.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing"
              >
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5 px-1 truncate">
                  {item.stepTitle}
                </p>
                <ItemCard
                  item={item}
                  people={people}
                  isFirst={false}
                  isLast={false}
                  hideReorder={true}
                  onUpdate={async (data) => handleUpdateItem(item.id, data)}
                  onDelete={async () => handleDeleteItem(item.id)}
                  onMoveUp={async () => {}}
                  onMoveDown={async () => {}}
                  onPersonAdded={handlePersonAdded}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">
            All items have been prioritized.
          </p>
        )}
      </div>

      {/* Resource Leveling Modal */}
      <ResourceLevelingModal
        open={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        items={items}
        people={people}
        onItemUpdate={handleUpdateItem}
      />
    </div>
  )
}
