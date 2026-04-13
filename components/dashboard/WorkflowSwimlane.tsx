'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { WorkflowStep, StepItem, ItemType } from '@/lib/types'
import { cn } from '@/lib/utils'

// ── Swimlane row definitions ───────────────────────────────────────────────

const LANES: {
  key: ItemType
  label: string
  shortLabel: string
  noteColor: string      // sticky-note fill
  rowBg: string          // row background tint
  headerBg: string       // left-side label bg
}[] = [
  {
    key: 'ai_skill',
    label: 'AI Skills',
    shortLabel: 'AI Skills',
    noteColor: 'bg-yellow-200 border-yellow-300 text-yellow-900',
    rowBg: 'bg-yellow-50/40',
    headerBg: 'bg-yellow-100 border-r-yellow-200',
  },
  {
    key: 'non_ai_infrastructure',
    label: 'Non-AI Infrastructure',
    shortLabel: 'Non-AI Infra',
    noteColor: 'bg-emerald-200 border-emerald-300 text-emerald-900',
    rowBg: 'bg-emerald-50/40',
    headerBg: 'bg-emerald-100 border-r-emerald-200',
  },
  {
    key: 'orchestration_component',
    label: 'Orchestration / Workflow',
    shortLabel: 'Orchestration',
    noteColor: 'bg-orange-200 border-orange-300 text-orange-900',
    rowBg: 'bg-orange-50/40',
    headerBg: 'bg-orange-100 border-r-orange-200',
  },
]

// ── Sticky note card ────────────────────────────────────────────────────────

function StickyNote({ title, colorClass }: { title: string; colorClass: string }) {
  return (
    <div
      title={title}
      className={cn(
        'w-[86px] h-[64px] rounded-sm border shadow-sm p-1.5',
        'text-[10px] font-medium leading-tight',
        'flex items-start overflow-hidden',
        colorClass,
      )}
    >
      <span className="line-clamp-4 break-words">{title}</span>
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

export function WorkflowSwimlane() {
  const [steps, setSteps] = useState<WorkflowStep[]>([])
  const [items, setItems] = useState<Pick<StepItem, 'id' | 'workflow_step_id' | 'title' | 'item_type' | 'order_index'>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('workflow_steps').select('*').order('order_index'),
      supabase
        .from('step_items')
        .select('id, workflow_step_id, title, item_type, order_index')
        .order('order_index'),
    ]).then(([stepsRes, itemsRes]) => {
      setSteps(stepsRes.data ?? [])
      setItems(itemsRes.data ?? [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="h-72 rounded-xl border border-slate-200 bg-slate-50 animate-pulse" />
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
      {/* minWidth keeps the grid readable; users scroll horizontally on smaller screens */}
      <div style={{ minWidth: '1020px' }}>

        {/* ── Column headers (step names) ───────────────────────────────── */}
        <div className="flex border-b-2 border-slate-200 bg-slate-50">
          {/* Spacer for the row-label column */}
          <div className="w-[136px] min-w-[136px] border-r border-slate-200" />

          {steps.map((step, i) => (
            <Link
              key={step.id}
              href={`/${step.slug}`}
              className={cn(
                'flex-1 min-w-[148px] px-3 py-2.5 text-center group transition-colors',
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
                    'flex-1 min-w-[148px] p-2 flex flex-wrap gap-1.5 content-start min-h-[110px]',
                    stepIdx < steps.length - 1 && 'border-r border-slate-200',
                  )}
                >
                  {cellItems.map((item) => (
                    <StickyNote
                      key={item.id}
                      title={item.title}
                      colorClass={lane.noteColor}
                    />
                  ))}
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
  )
}
