'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Person } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react'

function PersonRow({
  person,
  onUpdate,
  onDelete,
}: {
  person: Person
  onUpdate: (id: string, first: string, last: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(person.first_name)
  const [lastName, setLastName] = useState(person.last_name)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!firstName.trim() || !lastName.trim()) return
    setSaving(true)
    await onUpdate(person.id, firstName.trim(), lastName.trim())
    setSaving(false)
    setEditing(false)
  }

  async function handleDelete() {
    if (!confirm(`Delete ${person.first_name} ${person.last_name}?`)) return
    await onDelete(person.id)
  }

  if (editing) {
    return (
      <tr className="bg-indigo-50/40">
        <td className="px-4 py-2">
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
        </td>
        <td className="px-4 py-2">
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
        </td>
        <td className="px-4 py-2">
          <div className="flex gap-1">
            <Button
              size="sm"
              className="h-7 w-7 p-0 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSave}
              disabled={saving || !firstName.trim() || !lastName.trim()}
              title="Save"
            >
              <Check size={13} />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() => {
                setEditing(false)
                setFirstName(person.first_name)
                setLastName(person.last_name)
              }}
              title="Cancel"
            >
              <X size={13} />
            </Button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 text-sm text-slate-800 font-medium">{person.first_name}</td>
      <td className="px-4 py-3 text-sm text-slate-800 font-medium">{person.last_name}</td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50"
            onClick={() => setEditing(true)}
            title="Edit"
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </td>
    </tr>
  )
}

export function PeopleTable() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newFirst, setNewFirst] = useState('')
  const [newLast, setNewLast] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('people')
      .select('*')
      .order('first_name')
      .then(({ data }) => {
        setPeople(data ?? [])
        setLoading(false)
      })
  }, [])

  async function handleAdd() {
    if (!newFirst.trim() || !newLast.trim()) return
    setSaving(true)
    const { data } = await supabase.from('people').insert({
      first_name: newFirst.trim(),
      last_name: newLast.trim(),
    }).select().single()
    if (data) {
      setPeople((prev) => [...prev, data].sort((a, b) => a.first_name.localeCompare(b.first_name)))
      setNewFirst('')
      setNewLast('')
      setAdding(false)
    }
    setSaving(false)
  }

  async function handleUpdate(id: string, first: string, last: string) {
    const { data } = await supabase.from('people').update({ first_name: first, last_name: last }).eq('id', id).select().single()
    if (data) {
      setPeople((prev) => prev.map((p) => p.id === id ? data : p).sort((a, b) => a.first_name.localeCompare(b.first_name)))
    }
  }

  async function handleDelete(id: string) {
    await supabase.from('people').delete().eq('id', id)
    setPeople((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">First Name</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Name</th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {people.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
            {people.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-slate-400">
                  No people yet. Add someone below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add person */}
      <div className="mt-4">
        {adding ? (
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Add Person</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label htmlFor="first" className="text-xs font-semibold text-slate-500">First Name</Label>
                <Input
                  id="first"
                  value={newFirst}
                  onChange={(e) => setNewFirst(e.target.value)}
                  className="mt-1"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div>
                <Label htmlFor="last" className="text-xs font-semibold text-slate-500">Last Name</Label>
                <Input
                  id="last"
                  value={newLast}
                  onChange={(e) => setNewLast(e.target.value)}
                  className="mt-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={saving || !newFirst.trim() || !newLast.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {saving ? 'Adding…' : 'Add Person'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setAdding(false); setNewFirst(''); setNewLast('') }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setAdding(true)} className="gap-1.5">
            <Plus size={14} />
            Add Person
          </Button>
        )}
      </div>
    </div>
  )
}
