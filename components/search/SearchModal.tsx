'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { StepItem, WorkflowStep, ITEM_TYPE_LABELS } from '@/lib/types'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Search, ArrowRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchResult extends StepItem {
  stepSlug: string
  stepTitle: string
}

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

const typeBadge: Record<string, string> = {
  ai_skill: 'bg-blue-50 text-blue-700 border-blue-200',
  non_ai_infrastructure: 'bg-slate-100 text-slate-600 border-slate-200',
  orchestration_component: 'bg-purple-50 text-purple-700 border-purple-200',
}

const typeShortLabel: Record<string, string> = {
  ai_skill: 'AI Skill',
  non_ai_infrastructure: 'Non-AI Infra',
  orchestration_component: 'Orchestration',
}

function docToText(doc: object): string {
  const d = doc as { content?: { content?: { content?: { text?: string }[] }[] }[] }
  try {
    return (
      d.content
        ?.map((b) =>
          b.content
            ?.map((i) => i.content?.map((t) => t.text ?? '').join('') ?? '')
            .join('\n') ?? ''
        )
        .join('\n') ?? ''
    )
  } catch {
    return ''
  }
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [allItems, setAllItems] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // Load all items when modal opens; reset query when it closes
  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    setLoading(true)
    async function load() {
      const [stepsRes, itemsRes] = await Promise.all([
        supabase.from('workflow_steps').select('*').order('order_index'),
        supabase.from('step_items').select('*').order('order_index'),
      ])
      const steps: WorkflowStep[] = stepsRes.data ?? []
      const items: StepItem[] = itemsRes.data ?? []
      setAllItems(
        items.map((item) => {
          const step = steps.find((s) => s.id === item.workflow_step_id)
          return { ...item, stepSlug: step?.slug ?? '', stepTitle: step?.title ?? '' }
        })
      )
      setLoading(false)
    }
    load()
  }, [open])

  const q = query.trim().toLowerCase()
  const results =
    q.length < 2
      ? allItems
      : allItems.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.stepTitle.toLowerCase().includes(q) ||
            ITEM_TYPE_LABELS[item.item_type].toLowerCase().includes(q) ||
            docToText(item.description_json).toLowerCase().includes(q)
        )

  function handleClick(item: SearchResult) {
    onClose()
    router.push(`/${item.stepSlug}`)
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            placeholder="Search skills, components, orchestration…"
            className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Results list */}
        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-400">Loading…</div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <ul className="py-1.5">
              {q.length < 2 && (
                <li className="px-4 pt-1.5 pb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    All Items
                  </p>
                </li>
              )}
              {results.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleClick(item)}
                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors group flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-700 transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.stepTitle}</p>
                    </div>
                    <span
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded border shrink-0 font-medium',
                        typeBadge[item.item_type]
                      )}
                    >
                      {typeShortLabel[item.item_type]}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-slate-300 group-hover:text-indigo-400 shrink-0 transition-colors"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer count */}
        {!loading && results.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
            <p className="text-xs text-slate-400">
              {results.length} {results.length === 1 ? 'result' : 'results'}
              {q.length >= 2 ? ` for "${query}"` : ''}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
