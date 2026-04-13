'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Target, Search, Lightbulb, Hammer, BarChart2, Megaphone, Users, X, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/goals-planning', label: 'Goals / Planning', icon: Target },
  { href: '/discover-question', label: 'Discover / Question', icon: Search },
  { href: '/hypothesize-frame', label: 'Hypothesize & Frame', icon: Lightbulb },
  { href: '/build-validate', label: 'Build / Validate', icon: Hammer },
  { href: '/measure-iterate', label: 'Measure / Iterate', icon: BarChart2 },
  { href: '/scale-evangelize', label: 'Scale / Evangelize', icon: Megaphone },
  { href: '/people', label: 'People', icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-900 leading-tight">AI PDLC<br />Workflow Tracker</h1>
      </div>
      <ul className="flex-1 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 text-sm rounded-none transition-colors',
                  isActive
                    ? 'bg-gray-100 text-gray-900 font-medium border-l-2 border-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent'
                )}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-3 left-3 z-50 p-2 rounded-md bg-white border border-gray-200 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'md:hidden fixed top-0 left-0 z-40 h-full w-60 bg-white border-r border-gray-200 shadow-lg transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 print:hidden">
        <NavContent />
      </aside>
    </>
  )
}
