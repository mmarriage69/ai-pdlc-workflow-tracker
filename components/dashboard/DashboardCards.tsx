'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { WorkflowStep, StepItem, Person, Status, NAV_STEPS } from '@/lib/types'
import { StatusBadge } from '@/components/steps/StatusBadge'
import Link from 'next/link'

interface DashboardData {
  steps: WorkflowStep[]
  items: StepItem[]
  people: Person[]
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
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
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse h-20" />
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
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-900">Overall Completion</p>
          <p className="text-sm font-semibold text-gray-900">{completePct}%</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${completePct}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">{completeSteps} of {steps.length} steps complete</p>
      </div>

      {/* Step stats */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Workflow Steps</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Steps" value={steps.length} />
          <StatCard label="Pending" value={statusCounts.Pending} />
          <StatCard label="In Development" value={statusCounts['In Development']} />
          <StatCard label="Complete" value={statusCounts.Complete} />
        </div>
      </div>

      {/* Item stats */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Skills & Components</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Items" value={totalItems} />
          <StatCard label="AI Skills" value={aiSkills} />
          <StatCard label="Non-AI Infrastructure" value={nonAI} />
          <StatCard label="Orchestration" value={orchestration} />
        </div>
      </div>

      {/* Assignment stats */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Assignments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Unassigned Step Owners" value={unassignedOwners} />
          <StatCard label="Unassigned Metric Owners" value={unassignedMetricOwners} />
          <StatCard label="Unassigned Builders" value={unassignedBuilders} />
          <StatCard label="Ignored Items" value={ignoredItems} />
        </div>
      </div>

      {/* Attention list */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Steps Needing Attention</h2>
        {needingAttention.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700">
            All steps are complete or ignored.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {needingAttention.map((step) => {
              const navStep = NAV_STEPS.find((n) => n.slug === step.slug)
              return (
                <Link
                  key={step.id}
                  href={`/${step.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Step {step.order_index} of {NAV_STEPS.length}
                    </p>
                  </div>
                  <StatusBadge status={step.status} />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
