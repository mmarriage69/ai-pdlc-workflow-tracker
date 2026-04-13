import { DashboardCards } from '@/components/dashboard/DashboardCards'
import { WorkflowSwimlane } from '@/components/dashboard/WorkflowSwimlane'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard — AI PDLC Workflow Tracker' }

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl space-y-8">
      <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>

      {/* Swimlane workflow diagram */}
      <div>
        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Workflow Overview
        </h2>
        <WorkflowSwimlane />
      </div>

      {/* Stats */}
      <DashboardCards />
    </div>
  )
}
