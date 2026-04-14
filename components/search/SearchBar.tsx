'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { SearchModal } from './SearchModal'

export function SearchBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 w-full max-w-lg px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-400 hover:border-indigo-300 hover:text-slate-500 transition-colors shadow-sm text-left"
      >
        <Search size={15} className="shrink-0" />
        <span>Search skills, components, orchestration…</span>
      </button>
      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
