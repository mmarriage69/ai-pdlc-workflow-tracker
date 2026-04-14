import { DashboardCards } from '@/components/dashboard/DashboardCards'
import { WorkflowSwimlane } from '@/components/dashboard/WorkflowSwimlane'
import { SearchBar } from '@/components/search/SearchBar'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard — AI PDLC Workflow Tracker' }

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <SearchBar />
      </div>

      {/* Swimlane workflow diagram */}
      <WorkflowSwimlane />

      {/* Stats */}
      <DashboardCards />
    </div>
  )
}
