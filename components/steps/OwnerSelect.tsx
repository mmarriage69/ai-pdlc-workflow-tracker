'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus } from 'lucide-react'
import { Person } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface OwnerSelectProps {
  people: Person[]
  value: string | null
  onChange: (personId: string | null) => void
  onPersonAdded?: (person: Person) => void
  placeholder?: string
  className?: string
}

export function OwnerSelect({
  people: peopleProp,
  value,
  onChange,
  onPersonAdded,
  placeholder = 'Unassigned',
  className,
}: OwnerSelectProps) {
  const [people, setPeople] = useState<Person[]>(peopleProp)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Keep local list in sync when parent changes (e.g. another select adds a person)
  useEffect(() => {
    setPeople(peopleProp)
  }, [peopleProp])

  function handleValueChange(v: string) {
    if (v === '__add_new__') {
      // Don't propagate — open the dialog instead
      setDialogOpen(true)
      return
    }
    onChange(v === '__none__' ? null : v)
  }

  function handleDialogClose(open: boolean) {
    if (!open) {
      setDialogOpen(false)
      setFirstName('')
      setLastName('')
      setError('')
    }
  }

  async function handleAdd() {
    const first = firstName.trim()
    const last = lastName.trim()
    if (!first || !last) return
    setSaving(true)
    setError('')
    const { data, error: err } = await supabase
      .from('people')
      .insert({ first_name: first, last_name: last })
      .select()
      .single()
    if (err || !data) {
      setError(err?.message ?? 'Failed to add person')
      setSaving(false)
      return
    }
    const updated = [...people, data].sort((a, b) =>
      a.first_name.localeCompare(b.first_name)
    )
    setPeople(updated)
    onChange(data.id)
    onPersonAdded?.(data)
    setFirstName('')
    setLastName('')
    setDialogOpen(false)
    setSaving(false)
  }

  return (
    <>
      <Select value={value ?? '__none__'} onValueChange={handleValueChange}>
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
          <SelectItem
            value="__add_new__"
            className="text-indigo-600 font-semibold border-t border-slate-100 mt-1 pt-2"
          >
            <span className="flex items-center gap-1.5">
              <UserPlus size={12} />
              Add new person…
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Person</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <Label htmlFor="owner-select-first" className="text-xs font-semibold text-slate-500">
                First Name
              </Label>
              <Input
                id="owner-select-first"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div>
              <Label htmlFor="owner-select-last" className="text-xs font-semibold text-slate-500">
                Last Name
              </Label>
              <Input
                id="owner-select-last"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}

          <DialogFooter className="mt-2">
            <DialogClose
              render={
                <Button variant="outline" size="sm" />
              }
            >
              Cancel
            </DialogClose>
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={saving || !firstName.trim() || !lastName.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? 'Adding…' : 'Add Person'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
