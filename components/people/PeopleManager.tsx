'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Person, Team } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, UserPlus, Pencil, Trash2, Plus, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Helpers ────────────────────────────────────────────────────────────────

function initials(p: Person) {
  return `${p.first_name[0] ?? ''}${p.last_name[0] ?? ''}`.toUpperCase()
}

// ── Person add / edit modal ────────────────────────────────────────────────

interface PersonModalProps {
  person: Person | null   // null = adding new
  teams: Team[]
  open: boolean
  onClose: () => void
  onSaved: (person: Person) => void
  onTeamAdded: (team: Team) => void
}

function PersonModal({ person, teams, open, onClose, onSaved, onTeamAdded }: PersonModalProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [teamId, setTeamId] = useState<string | null>(null)
  const [addingTeam, setAddingTeam] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingTeam, setSavingTeam] = useState(false)
  const [error, setError] = useState('')

  // Reset form whenever the modal opens or the target person changes
  useEffect(() => {
    if (open) {
      setFirstName(person?.first_name ?? '')
      setLastName(person?.last_name ?? '')
      setEmail(person?.email ?? '')
      setTeamId(person?.team_id ?? null)
      setAddingTeam(false)
      setNewTeamName('')
      setError('')
    }
  }, [open, person])

  async function handleSave() {
    const first = firstName.trim()
    const last = lastName.trim()
    if (!first || !last) return
    setSaving(true)
    setError('')

    const payload = {
      first_name: first,
      last_name: last,
      email: email.trim() || null,
      team_id: teamId || null,
    }

    const result = person
      ? await supabase.from('people').update(payload).eq('id', person.id).select().single()
      : await supabase.from('people').insert(payload).select().single()

    if (result.error || !result.data) {
      setError(result.error?.message ?? 'Failed to save')
      setSaving(false)
      return
    }

    onSaved(result.data)
    setSaving(false)
    onClose()
  }

  async function handleAddTeam() {
    const name = newTeamName.trim()
    if (!name) return
    setSavingTeam(true)
    const { data, error: err } = await supabase.from('teams').insert({ name }).select().single()
    if (err || !data) {
      setError(err?.message ?? 'Failed to add team')
      setSavingTeam(false)
      return
    }
    onTeamAdded(data)
    setTeamId(data.id)
    setNewTeamName('')
    setAddingTeam(false)
    setSavingTeam(false)
  }

  function handleTeamChange(v: string | null) {
    if (v === '__add_team__') { setAddingTeam(true); return }
    setTeamId(v === '__none__' || v === null ? null : v)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {person ? `Edit ${person.first_name} ${person.last_name}` : 'Add Person'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-1">
          {/* First / Last */}
          <div>
            <Label htmlFor="pm-first" className="text-xs font-semibold text-slate-500">First Name *</Label>
            <Input
              id="pm-first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
          <div>
            <Label htmlFor="pm-last" className="text-xs font-semibold text-slate-500">Last Name *</Label>
            <Input
              id="pm-last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          {/* Email */}
          <div className="col-span-2">
            <Label htmlFor="pm-email" className="text-xs font-semibold text-slate-500">Email</Label>
            <Input
              id="pm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          {/* Team */}
          <div className="col-span-2">
            <Label className="text-xs font-semibold text-slate-500">Team</Label>
            {addingTeam ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Team name…"
                  autoFocus
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                />
                <Button
                  size="sm"
                  onClick={handleAddTeam}
                  disabled={savingTeam || !newTeamName.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {savingTeam ? '…' : 'Add'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setAddingTeam(false); setNewTeamName('') }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Select value={teamId ?? '__none__'} onValueChange={handleTeamChange}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="No team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No team</SelectItem>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                  <SelectItem
                    value="__add_team__"
                    className="text-indigo-600 font-semibold border-t border-slate-100 mt-1 pt-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <Plus size={12} />
                      Add new team…
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

        <DialogFooter className="mt-2">
          <DialogClose render={<Button variant="outline" size="sm" />}>Cancel</DialogClose>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !firstName.trim() || !lastName.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {saving ? 'Saving…' : person ? 'Save Changes' : 'Add Person'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Delete confirmation ────────────────────────────────────────────────────

interface DeleteConfirmProps {
  person: Person | null
  open: boolean
  onClose: () => void
  onDeleted: (id: string) => void
}

function DeleteConfirm({ person, open, onClose, onDeleted }: DeleteConfirmProps) {
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!person) return
    setDeleting(true)
    await supabase.from('people').delete().eq('id', person.id)
    onDeleted(person.id)
    setDeleting(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Person</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-600 mt-1">
          Are you sure you want to delete{' '}
          <strong>{person?.first_name} {person?.last_name}</strong>? They will be
          unassigned from any workflow steps or items.
        </p>
        <DialogFooter className="mt-2">
          <DialogClose render={<Button variant="outline" size="sm" />}>Cancel</DialogClose>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── People list row ────────────────────────────────────────────────────────

function PersonRow({
  person,
  teamName,
  onEdit,
  onDelete,
}: {
  person: Person
  teamName: string | undefined
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div
      onClick={onEdit}
      className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center cursor-pointer hover:bg-indigo-50/40 transition-colors group"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center shrink-0 select-none">
        {initials(person)}
      </div>

      {/* Name */}
      <span className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
        {person.first_name} {person.last_name}
      </span>

      {/* Email */}
      <span className="text-sm text-slate-500 truncate">
        {person.email ?? <span className="text-slate-300">—</span>}
      </span>

      {/* Team */}
      <div>
        {teamName ? (
          <span className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full px-2.5 py-0.5">
            {teamName}
          </span>
        ) : (
          <span className="text-sm text-slate-300">—</span>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-0.5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onEdit}
          title="Edit"
          className="p-1.5 rounded text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={onDelete}
          title="Delete"
          className="p-1.5 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────

export function PeopleManager() {
  const [people, setPeople] = useState<Person[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  // undefined = modal closed | null = adding new | Person = editing
  const [modalTarget, setModalTarget] = useState<Person | null | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<Person | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('people').select('*').order('first_name'),
      supabase.from('teams').select('*').order('name'),
    ]).then(([pRes, tRes]) => {
      setPeople(pRes.data ?? [])
      setTeams(tRes.data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return people
    return people.filter((p) => {
      const teamName = teams.find((t) => t.id === p.team_id)?.name ?? ''
      return (
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q) ||
        (p.email ?? '').toLowerCase().includes(q) ||
        teamName.toLowerCase().includes(q)
      )
    })
  }, [people, teams, search])

  function handleSaved(saved: Person) {
    setPeople((prev) => {
      const list = prev.some((p) => p.id === saved.id)
        ? prev.map((p) => (p.id === saved.id ? saved : p))
        : [...prev, saved]
      return list.sort((a, b) => a.first_name.localeCompare(b.first_name))
    })
  }

  function handleDeleted(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id))
  }

  function handleTeamAdded(team: Team) {
    setTeams((prev) =>
      [...prev, team].sort((a, b) => a.name.localeCompare(b.name))
    )
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or team…"
            className="pl-8"
          />
        </div>
        <Button
          onClick={() => setModalTarget(null)}
          className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
        >
          <UserPlus size={14} />
          Add Person
        </Button>
      </div>

      {/* Empty state — no people at all */}
      {people.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 flex flex-col items-center text-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Users size={24} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-800">No people yet</p>
            <p className="text-sm text-slate-400 mt-1">Add someone to get started.</p>
          </div>
          <Button
            onClick={() => setModalTarget(null)}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <UserPlus size={14} />
            Add Person
          </Button>
        </div>

      ) : filtered.length === 0 ? (
        /* Empty state — search has no results */
        <div className="py-12 text-center">
          <p className="text-sm text-slate-400">No people match &ldquo;{search}&rdquo;</p>
        </div>

      ) : (
        /* People table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Column headers */}
          <div className={cn(
            'grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 px-4 py-2.5',
            'border-b border-slate-100 bg-slate-50',
          )}>
            <div className="w-8" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Name</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Team</span>
            <div className="w-16" />
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.map((person) => (
              <PersonRow
                key={person.id}
                person={person}
                teamName={teams.find((t) => t.id === person.team_id)?.name}
                onEdit={() => setModalTarget(person)}
                onDelete={() => setDeleteTarget(person)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Count */}
      {people.length > 0 && (
        <p className="text-xs text-slate-400 mt-3 text-right">
          {filtered.length === people.length
            ? `${people.length} ${people.length === 1 ? 'person' : 'people'}`
            : `${filtered.length} of ${people.length} people`}
        </p>
      )}

      {/* Add / Edit modal */}
      <PersonModal
        person={modalTarget === undefined ? null : modalTarget}
        teams={teams}
        open={modalTarget !== undefined}
        onClose={() => setModalTarget(undefined)}
        onSaved={handleSaved}
        onTeamAdded={handleTeamAdded}
      />

      {/* Delete confirmation */}
      <DeleteConfirm
        person={deleteTarget}
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </>
  )
}
