'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Status } from '@/lib/types'

const statusConfig: Record<Status, { label: string; className: string }> = {
  Pending: { label: 'Pending', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  'In Development': { label: 'In Development', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  Complete: { label: 'Complete', className: 'bg-green-50 text-green-700 border-green-200' },
  Ignore: { label: 'Ignore', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
}

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const config = statusConfig[status] ?? statusConfig.Pending
  return (
    <Badge variant="outline" className={cn('text-xs font-medium', config.className, className)}>
      {config.label}
    </Badge>
  )
}
