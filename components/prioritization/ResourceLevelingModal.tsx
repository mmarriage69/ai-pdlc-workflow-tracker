'use client'

import { useState } from 'react'
import { StepItem, Person } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import type { EnrichedItem } from './PrioritizationPage'

interface ResourceLevelingModalProps {
  open: boolean
  onClose: () => void
  items: EnrichedItem[]
  people: Person[]
  onItemUpdate: (itemId: string, data: Partial<StepItem>) => Promise<void>
}

const MAJOR_PRIORITIES = [1, 2, 3, 4, 5]

type DrillDown = { personId: string; major: number }

export function ResourceLevelingModal({
  open,
  onClose,
  items,
  people,
  onItemUpdate,
}: ResourceLevelingModalProps) {
  const [drillDown, setDrillDown] = useState<DrillDown | null>(null)

  function countForPersonPriority(personId: string, major: number) {
    return items.filter(
      (i) => i.builder_person_id === personId && i.priority_major === major,
    ).length
  }

  function totalForPerson(personId: string) {
    return items.filter(
      (i) =>
        i.builder_person_id === personId && i.priority_major !== null,
    ).length
  }

  function itemsForDrillDown(personId: string, major: number) {
    return items.filter(
      (i) => i.builder_person_id === personId && i.priority_major === major,
    )
  }

  const drillDownPerson = drillDown
    ? people.find((p) => p.id === drillDown.personId)
    : null

  const drillDownItemList = drillDown
    ? itemsForDrillDown(drillDown.personId, drillDown.major)
    : []

  function handleClose() {
    onClose()
    setDrillDown(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose()
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resource Leveling</DialogTitle>
        </DialogHeader>

        {drillDown ? (
          /* ── Drill-down view ──────────────────────────────────── */
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 gap-2 text-slate-500 -ml-2"
              onClick={() => setDrillDown(null)}
            >
              <ArrowLeft size={14} />
              Back to overview
            </Button>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              {drillDownPerson
                ? `${drillDownPerson.first_name} ${drillDownPerson.last_name}`
                : 'Unknown'}{' '}
              — P{drillDown.major}
            </p>
            <p className="text-[11px] text-slate-400 mb-4">
              {drillDownItemList.length} item
              {drillDownItemList.length !== 1 ? 's' : ''} assigned at this
              priority. Reassign builder using the dropdowns below.
            </p>
            <div className="space-y-2">
              {drillDownItemList.map((item) => (
                <DrillDownRow
                  key={item.id}
                  item={item}
                  people={people}
                  onBuilderChange={async (newBuilderId) => {
                    await onItemUpdate(item.id, {
                      builder_person_id: newBuilderId,
                    })
                  }}
                />
              ))}
              {drillDownItemList.length === 0 && (
                <p className="text-sm text-slate-400 italic">
                  No items at this priority level.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* ── Overview table ───────────────────────────────────── */
          <div>
            <p className="text-[11px] text-slate-400 mb-4">
              Counts show items assigned to each builder (Builder field) per
              priority level. Rows with{' '}
              <span className="text-red-600 font-semibold">2 or more</span>{' '}
              items at a single priority are highlighted. Click a count to
              reassign.
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-2.5 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                      Builder
                    </th>
                    {MAJOR_PRIORITIES.map((p) => (
                      <th
                        key={p}
                        className="text-center py-2.5 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest"
                      >
                        P{p}
                      </th>
                    ))}
                    <th className="text-center py-2.5 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest border-l border-slate-200">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {people.map((person) => {
                    const isOverloaded = MAJOR_PRIORITIES.some(
                      (p) => countForPersonPriority(person.id, p) >= 2,
                    )
                    const total = totalForPerson(person.id)

                    return (
                      <tr
                        key={person.id}
                        className={cn(
                          isOverloaded && 'bg-red-50',
                        )}
                      >
                        <td className="py-2.5 px-4">
                          <span
                            className={cn(
                              'text-sm font-medium',
                              isOverloaded ? 'text-red-700' : 'text-slate-700',
                            )}
                          >
                            {person.first_name} {person.last_name}
                          </span>
                        </td>
                        {MAJOR_PRIORITIES.map((p) => {
                          const count = countForPersonPriority(person.id, p)
                          const cellOverloaded = count >= 2
                          return (
                            <td key={p} className="text-center py-2.5 px-3">
                              {count > 0 ? (
                                <button
                                  onClick={() =>
                                    setDrillDown({
                                      personId: person.id,
                                      major: p,
                                    })
                                  }
                                  className={cn(
                                    'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors',
                                    cellOverloaded
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
                                  )}
                                >
                                  {count}
                                </button>
                              ) : (
                                <span className="text-slate-300 text-xs">
                                  —
                                </span>
                              )}
                            </td>
                          )
                        })}
                        <td className="text-center py-2.5 px-3 border-l border-slate-200">
                          <span
                            className={cn(
                              'text-sm font-semibold',
                              total > 0 ? 'text-slate-700' : 'text-slate-300',
                            )}
                          >
                            {total > 0 ? total : '—'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* ── Drill-down row ─────────────────────────────────────────────── */

function DrillDownRow({
  item,
  people,
  onBuilderChange,
}: {
  item: EnrichedItem
  people: Person[]
  onBuilderChange: (builderId: string | null) => Promise<void>
}) {
  const [saving, setSaving] = useState(false)

  const priorityLabel =
    item.priority_major !== null
      ? `P${item.priority_major}${item.priority_sub ?? ''}`
      : '—'

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">
          {item.title}
        </p>
        <p className="text-[11px] text-slate-400">
          {item.stepTitle}
          {' · '}
          <span className="font-semibold text-amber-600">{priorityLabel}</span>
        </p>
      </div>
      <div className="shrink-0 w-44">
        <Select
          value={item.builder_person_id ?? '__none__'}
          onValueChange={async (v) => {
            setSaving(true)
            await onBuilderChange(v === '__none__' ? null : v)
            setSaving(false)
          }}
          disabled={saving}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Unassigned" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">Unassigned</SelectItem>
            {people.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.first_name} {p.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
