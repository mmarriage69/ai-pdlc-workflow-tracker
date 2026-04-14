import { PeopleManager } from '@/components/people/PeopleManager'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'People — AI PDLC Workflow Tracker' }

export default function PeoplePage() {
  return (
    <div className="p-6 max-w-3xl">
      <PeopleManager />
    </div>
  )
}
