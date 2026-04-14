'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { WorkflowStep, StepItem, Person, ItemType, Status } from '@/lib/types'
import { cn } from '@/lib/utils'

// ── Plain-text extractor for detail_json (TipTap format) ─────────────────────
function docToText(node: unknown): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: string; content?: unknown[] }
  if (typeof n.text === 'string') return n.text
  if (!Array.isArray(n.content)) return ''
  return n.content.map(docToText).join(' ').replace(/\s+/g, ' ').trim()
}

// ── Swimlane row definitions ───────────────────────────────────────────────

const LANES: {
  key: ItemType
  label: string
  shortLabel: string
  noteColor: string      // sticky-note fill
  rowBg: string          // row background tint
  headerBg: string       // left-side label bg
  ownerPillBg: string    // owner pill — contrasts with note
  builderPillBg: string  // builder pill — contrasts with note
  priorityPillBg: string // priority pill — contrasts with note
}[] = [
  {
    key: 'ai_skill',
    label: 'AI Skills',
    shortLabel: 'AI Skills',
    noteColor: 'bg-yellow-200 border-yellow-300 text-yellow-900',
    rowBg: 'bg-yellow-50/40',
    headerBg: 'bg-yellow-100 border-r-yellow-200',
    ownerPillBg: 'bg-indigo-100 text-indigo-800',
    builderPillBg: 'bg-emerald-100 text-emerald-800',
    priorityPillBg: 'bg-slate-700 text-white',
  },
  {
    key: 'non_ai_infrastructure',
    label: 'Non-AI Infrastructure',
    shortLabel: 'Non-AI Infra',
    noteColor: 'bg-emerald-200 border-emerald-300 text-emerald-900',
    rowBg: 'bg-emerald-50/40',
    headerBg: 'bg-emerald-100 border-r-emerald-200',
    ownerPillBg: 'bg-blue-100 text-blue-800',
    builderPillBg: 'bg-violet-100 text-violet-800',
    priorityPillBg: 'bg-slate-700 text-white',
  },
  {
    key: 'orchestration_component',
    label: 'Orchestration / Workflow',
    shortLabel: 'Orchestration',
    noteColor: 'bg-orange-200 border-orange-300 text-orange-900',
    rowBg: 'bg-orange-50/40',
    headerBg: 'bg-orange-100 border-r-orange-200',
    ownerPillBg: 'bg-purple-100 text-purple-800',
    builderPillBg: 'bg-cyan-100 text-cyan-800',
    priorityPillBg: 'bg-slate-700 text-white',
  },
]

// ── Sticky note card ────────────────────────────────────────────────────────

type StickyItem = Pick<StepItem,
  'id' | 'workflow_step_id' | 'title' | 'item_type' | 'order_index' |
  'owner_person_id' | 'builder_person_id' | 'priority_major' | 'priority_sub' |
  'status' | 'detail_json'
>

function formatPriority(major: number | null, sub: string | null): string | null {
  if (major === null || major === undefined) return null
  return `${major}${sub ?? ''}`
}

const statusPillClass: Record<Status, string> = {
  'Pending':        'bg-amber-500 text-white',
  'In Development': 'bg-indigo-600 text-white',
  'Complete':       'bg-emerald-600 text-white',
  'Ignore':         'bg-slate-500 text-white',
}

const statusShortLabel: Record<Status, string> = {
  'Pending':        'Pending',
  'In Development': 'In Dev',
  'Complete':       'Complete',
  'Ignore':         'Ignore',
}

function StickyNote({
  title,
  ownerName,
  builderName,
  priority,
  status,
  detailText,
  href,
  colorClass,
  ownerPillClass,
  builderPillClass,
  priorityPillClass,
}: {
  title: string
  ownerName: string | null
  builderName: string | null
  priority: string | null
  status: Status
  detailText: string
  href: string
  colorClass: string
  ownerPillClass: string
  builderPillClass: string
  priorityPillClass: string
}) {
  const tooltipLines = [
    title,
    `Status: ${status}`,
    `Priority: ${priority ? `P - ${priority}` : '—'}`,
    `O - ${ownerName ?? 'Unassigned'}`,
    `B - ${builderName ?? 'Unassigned'}`,
    detailText ? `\nDetail:\n${detailText}` : null,
  ].filter(Boolean).join('\n')

  return (
    <Link
      href={href}
      title={tooltipLines}
      className="block w-full"
    >
      <div
        className={cn(
          'w-full h-[124px] rounded-sm border shadow-sm p-1.5',
          'text-[10px] font-medium leading-tight',
          'flex flex-col justify-between overflow-hidden',
          'hover:brightness-95 hover:shadow-md transition-all',
          colorClass,
        )}
      >
        {/* Title */}
        <span className="line-clamp-2 break-words">{title}</span>

        {/* Pills: Status → Priority → O-Owner → B-Builder */}
        <div className="flex flex-col gap-0.5">
          {/* Status pill */}
          <span className={cn(
            'rounded px-1 py-0.5 text-[8.5px] font-bold leading-none',
            statusPillClass[status],
          )}>
            {statusShortLabel[status]}
          </span>
          {/* Priority pill */}
          <span className={cn(
            'rounded px-1 py-0.5 text-[8.5px] font-bold leading-none',
            priorityPillClass,
          )}>
            {priority ? `P - ${priority}` : 'P - —'}
          </span>
          {/* Owner pill */}
          <span className={cn(
            'rounded px-1 py-0.5 text-[8.5px] font-medium leading-none truncate',
            ownerPillClass,
          )}>
            O - {ownerName ?? 'Unassigned'}
          </span>
          {/* Builder pill */}
          <span className={cn(
            'rounded px-1 py-0.5 text-[8.5px] font-medium leading-none truncate',
            builderPillClass,
          )}>
            B - {builderName ?? 'Unassigned'}
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export function WorkflowSwimlane() {
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [items, setItems] = useState<StickyItem[]>([])
  const [people, setPeople] = useState<Pick<Person, 'id' | 'first_name' | 'last_name'>[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('workflow_steps').select('*').order('order_index'),
      supabase
        .from('step_items')
        .select('id, workflow_step_id, title, item_type, order_index, owner_person_id, builder_person_id, priority_major, priority_sub, status, detail_json')
        .order('order_index'),
      supabase.from('people').select('id, first_name, last_name'),
    ]).then(([stepsRes, itemsRes, peopleRes]) => {
      setSteps(stepsRes.data ?? [])
      setItems(itemsRes.data ?? [])
      setPeople(peopleRes.data ?? [])
      setLoading(false)
    })
  }, [])

  return (
    <div>
      {/* Collapsible header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 mb-3 group"
      >
        {open
          ? <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-600" />
          : <ChevronRight size={13} className="text-slate-400 group-hover:text-slate-600" />
        }
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
          Workflow Overview
        </span>
      </button>

      {open && (loading ? (
        <div className="h-72 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
          <div>

            {/* ── Column headers (step names) ───────────────────────────────── */}
            <div className="flex border-b-2 border-slate-200 bg-slate-50">
              {/* Spacer for the row-label column */}
              <div className="w-[136px] min-w-[136px] border-r border-slate-200" />

              {steps.map((step, i) => (
                <Link
                  key={step.id}
                  href={`/${step.slug}`}
                  className={cn(
                    'flex-1 min-w-0 px-3 py-2.5 text-center group transition-colors',
                    'hover:bg-indigo-50',
                    i < steps.length - 1 && 'border-r border-slate-200',
                  )}
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-400">
                    Step {step.order_index}
                  </p>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5 leading-tight group-hover:text-indigo-700">
                    {step.title}
                  </p>
                </Link>
              ))}
            </div>

            {/* ── Swimlane rows ──────────────────────────────────────────────── */}
            {LANES.map((lane, laneIdx) => (
              <div
                key={lane.key}
                className={cn(
                  'flex',
                  lane.rowBg,
                  laneIdx < LANES.length - 1 && 'border-b border-slate-200',
                )}
              >
                {/* Row label */}
                <div
                  className={cn(
                    'w-[136px] min-w-[136px] flex items-center justify-center px-2 py-3',
                    'border-r',
                    lane.headerBg,
                  )}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 text-center leading-snug">
                    {lane.label}
                  </span>
                </div>

                {/* Cells — one per step */}
                {steps.map((step, stepIdx) => {
                  const cellItems = items.filter(
                    (i) => i.workflow_step_id === step.id && i.item_type === lane.key,
                  )
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        'flex-1 min-w-0 p-[5px] flex flex-col gap-[5px]',
                        stepIdx < steps.length - 1 && 'border-r border-slate-200',
                      )}
                    >
                      {cellItems.map((item) => {
                        const owner = people.find((p) => p.id === item.owner_person_id)
                        const builderPerson = people.find((p) => p.id === item.builder_person_id)
                        const ownerName = owner ? `${owner.first_name} ${owner.last_name}` : null
                        const builderName = builderPerson ? `${builderPerson.first_name} ${builderPerson.last_name}` : null
                        const priority = formatPriority(item.priority_major, item.priority_sub)
                        const detailText = docToText(item.detail_json as object | null | undefined)
                        return (
                          <StickyNote
                            key={item.id}
                            title={item.title}
                            ownerName={ownerName}
                            builderName={builderName}
                            priority={priority}
                            status={item.status}
                            detailText={detailText}
                            href={`/${step.slug}#item-${item.id}`}
                            colorClass={lane.noteColor}
                            ownerPillClass={lane.ownerPillBg}
                            builderPillClass={lane.builderPillBg}
                            priorityPillClass={lane.priorityPillBg}
                          />
                        )
                      })}
                      {cellItems.length === 0 && (
                        <div className="w-full flex items-center justify-center">
                          <span className="text-[11px] text-slate-300">—</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}

            {/* ── Legend ────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-200 bg-slate-50">
              {LANES.map((lane) => (
                <span key={lane.key} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <span className={cn('inline-block w-3 h-3 rounded-sm border', lane.noteColor)} />
                  {lane.shortLabel}
                </span>
              ))}
              <span className="ml-auto text-[10px] text-slate-400">Click a step header to open it</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
