'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Status } from '@/lib/types'

const statusConfig: Record<Status, { label: string; className: string }> = {
  Pending: { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  'In Development': { label: 'In Development', className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  Complete: { label: 'Complete', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Ignore: { label: 'Ignore', className: 'bg-slate-100 text-slate-500 border-slate-200' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = statusConfig[status] ?? statusConfig.Pending
  return (
    <Badge variant="outline" className={cn('text-xs font-semibold', config.className, className)}>
      {config.label}
    </Badge>
  )
}
