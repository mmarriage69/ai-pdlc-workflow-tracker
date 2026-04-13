'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Person } from '@/lib/types'

interface OwnerSelectProps {
  people: Person[]
  value: string | null
  onChange: (personId: string | null) => void
  placeholder?: string
  className?: string
}

export function OwnerSelect({ people, value, onChange, placeholder = 'Unassigned', className }: OwnerSelectProps) {
  return (
    <Select
      value={value ?? '__none__'}
      onValueChange={(v) => onChange(v === '__none__' ? null : v)}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__none__">{placeholder}</SelectItem>
        {people.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.first_name} {p.last_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
