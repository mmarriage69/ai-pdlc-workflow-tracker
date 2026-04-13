import { DashboardCards } from '@/components/dashboard/DashboardCards'
import { WorkflowSwimlane } from '@/components/dashboard/WorkflowSwimlane'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard — AI PDLC Workflow Tracker' }

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-6xl space-y-8">
      <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>

      {/* Swimlane workflow diagram */}
      <WorkflowSwimlane />

      {/* Stats */}
      <DashboardCards />
    </div>
  )
}
