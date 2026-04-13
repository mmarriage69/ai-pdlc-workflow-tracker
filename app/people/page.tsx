import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'People — AI PDLC Workflow Tracker' }

export default function PeoplePage() {
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold text-slate-900 mb-6">People</h1>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-10 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <Users size={24} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-base font-semibold text-slate-800">Coming Soon</p>
          <p className="text-sm text-slate-400 mt-1">
            People management will be available in a future release.
          </p>
        </div>
      </div>
    </div>
  )
}
