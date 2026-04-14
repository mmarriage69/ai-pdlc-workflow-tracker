'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Target, Search, Lightbulb,
  Hammer, BarChart2, Megaphone, Users, X, Menu, Sparkles, ListOrdered
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, section: null },
  { href: '/prioritization', label: 'Prioritization', icon: ListOrdered, section: null },
  { href: '/goals-planning', label: 'Goals / Planning', icon: Target, section: 'Workflow Steps' },
  { href: '/discover-question', label: 'Discover / Question', icon: Search, section: null },
  { href: '/hypothesize-frame', label: 'Hypothesize & Frame', icon: Lightbulb, section: null },
  { href: '/build-validate', label: 'Build / Validate', icon: Hammer, section: null },
  { href: '/measure-iterate', label: 'Measure / Iterate', icon: BarChart2, section: null },
  { href: '/scale-evangelize', label: 'Scale / Evangelize', icon: Megaphone, section: null },
  { href: '/people', label: 'People', icon: Users, section: 'Admin' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-400/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-indigo-300" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-tight">AI PDLC</p>
            <p className="text-[10px] text-indigo-300/80 leading-tight">Workflow Tracker</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <ul className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, section }, idx) => {
          const prevItem = navItems[idx - 1]
          const showSection = section && section !== prevItem?.section

          const isActive =
            pathname === href ||
            (href !== '/dashboard' && href !== '/people' && pathname.startsWith(href))

          return (
            <li key={href}>
              {showSection && (
                <p className="text-[10px] font-semibold text-indigo-400/60 uppercase tracking-widest px-3 pt-4 pb-1.5">
                  {section}
                </p>
              )}
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                  isActive
                    ? 'bg-indigo-500/20 text-white font-medium border border-indigo-400/30 shadow-sm shadow-indigo-900/20'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                )}
              >
                <Icon
                  size={15}
                  className={cn(
                    'shrink-0 transition-colors',
                    isActive ? 'text-indigo-300' : 'text-slate-400'
                  )}
                />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-[10px] text-slate-500">v1 · No auth</p>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-slate-800 border border-slate-700 shadow-lg text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-40 h-full w-64 shadow-xl transition-transform duration-200',
          'bg-slate-900',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 h-screen sticky top-0 print:hidden bg-slate-900">
        <NavContent />
      </aside>
    </>
  )
}
