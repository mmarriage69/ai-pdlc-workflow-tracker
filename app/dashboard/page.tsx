import { DashboardCards } from '@/components/dashboard/DashboardCards'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard — AI PDLC Workflow Tracker' }

export default function DashboardPage() {
  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <DashboardCards />
    </div>
  )
}
