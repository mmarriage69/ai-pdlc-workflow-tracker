import { PeopleTable } from '@/components/people/PeopleTable'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'People — AI PDLC Workflow Tracker' }

export default function PeoplePage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">People</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage the shared people list used for owner and builder assignments across all workflow steps.
        </p>
      </div>
      <PeopleTable />
    </div>
  )
}
