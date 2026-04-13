'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WorkflowStep, StepItem, Person, Status, NAV_STEPS } from '@/lib/types'
import { StatusBadge } from '@/components/steps/StatusBadge'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface DashboardData {
  steps: WorkflowStep[]
  items: StepItem[]
  people: Person[]
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: 'indigo' | 'emerald' | 'amber' | 'slate' | 'blue' | 'purple'
}) {
  const accentBar: Record<string, string> = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-400',
    slate: 'bg-slate-400',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
      {accent && (
        <div className={cn('absolute top-0 left-0 right-0 h-0.5', accentBar[accent])} />
      )}
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1.5 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{children}</h2>
  )
}

export function DashboardCards() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [stepsRes, itemsRes, peopleRes] = await Promise.all([
        supabase.from('workflow_steps').select('*').order('order_index'),
        supabase.from('step_items').select('*'),
        supabase.from('people').select('*'),
      ])
      setData({
        steps: stepsRes.data ?? [],
        items: itemsRes.data ?? [],
        people: peopleRes.data ?? [],
      })
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse h-20 shadow-sm" />
        ))}
      </div>
    )
  }

  if (!data) return null

  const { steps, items } = data

  const statusCounts = (['Pending', 'In Development', 'Complete', 'Ignore'] as Status[]).reduce(
    (acc, s) => ({ ...acc, [s]: steps.filter((st) => st.status === s).length }),
    {} as Record<Status, number>
  )

  const totalItems = items.length
  const aiSkills = items.filter((i) => i.item_type === 'ai_skill').length
  const nonAI = items.filter((i) => i.item_type === 'non_ai_infrastructure').length
  const orchestration = items.filter((i) => i.item_type === 'orchestration_component').length
  const ignoredItems = items.filter((i) => i.status === 'Ignore').length

  const unassignedOwners = steps.filter((s) => !s.owner_person_id).length
  const unassignedMetricOwners = steps.filter((s) => !s.metric_owner_person_id).length
  const unassignedBuilders = items.filter((i) => !i.builder_person_id).length

  const completeSteps = steps.filter((s) => s.status === 'Complete').length
  const completePct = steps.length > 0 ? Math.round((completeSteps / steps.length) * 100) : 0

  const needingAttention = steps.filter(
    (s) => s.status !== 'Complete' && s.status !== 'Ignore'
  )

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-800">Overall Completion</p>
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{completePct}%</p>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completePct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{completeSteps} of {steps.length} steps complete</p>
      </div>

      {/* Step stats */}
      <div>
        <SectionLabel>Workflow Steps</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Steps" value={steps.length} accent="indigo" />
          <StatCard label="Pending" value={statusCounts.Pending} accent="amber" />
          <StatCard label="In Development" value={statusCounts['In Development']} accent="blue" />
          <StatCard label="Complete" value={statusCounts.Complete} accent="emerald" />
        </div>
      </div>

      {/* Item stats */}
      <div>
        <SectionLabel>Skills &amp; Components</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Items" value={totalItems} accent="slate" />
          <StatCard label="AI Skills" value={aiSkills} accent="blue" />
          <StatCard label="Non-AI Infrastructure" value={nonAI} accent="slate" />
          <StatCard label="Orchestration" value={orchestration} accent="purple" />
        </div>
      </div>

      {/* Assignment stats */}
      <div>
        <SectionLabel>Assignments</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Unassigned Step Owners" value={unassignedOwners} />
          <StatCard label="Unassigned Metric Owners" value={unassignedMetricOwners} />
          <StatCard label="Unassigned Builders" value={unassignedBuilders} />
          <StatCard label="Ignored Items" value={ignoredItems} />
        </div>
      </div>

      {/* Attention list */}
      <div>
        <SectionLabel>Steps Needing Attention</SectionLabel>
        {needingAttention.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700 font-medium">
            All steps are complete or ignored.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {needingAttention.map((step) => (
              <Link
                key={step.id}
                href={`/${step.slug}`}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-indigo-50/50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors">{step.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Step {step.order_index} of {NAV_STEPS.length}
                  </p>
                </div>
                <StatusBadge status={step.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
