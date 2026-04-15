export type Status = 'Pending' | 'In Development' | 'Complete' | 'Ignore'

export type ItemType =
  | 'ai_skill'
  | 'non_ai_infrastructure'
  | 'orchestration_component'

export type UsageMode = 'standalone' | 'orchestrated' | 'both'

export interface Team {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Person {
  id: string
  first_name: string
  last_name: string
  email: string | null
  team_id: string | null
  created_at: string
  updated_at: string
}

export interface WorkflowStep {
  id: string
  slug: string
  title: string
  order_index: number
  status: Status
  owner_person_id: string | null
  metric_owner_person_id: string | null
  created_at: string
  updated_at: string
}

export interface StepSection {
  id: string
  workflow_step_id: string
  title: string
  section_key: string | null
  order_index: number
  content_json: object
  is_default: boolean
  is_collapsed_default: boolean
  created_at: string
  updated_at: string
}

export interface StepItem {
  id: string
  workflow_step_id: string
  title: string
  item_type: ItemType
  description_json: object
  status: Status
  owner_person_id: string | null
  builder_person_id: string | null
  usage_mode: UsageMode
  inputs_json: object
  outputs_json: object
  notes_json: object
  detail_json: object | null
  prompt_text: string | null
  priority_major: number | null
  priority_sub: string | null
  github_url: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface StepItemLink {
  id: string
  source_item_id: string
  target_item_id: string
  link_type: 'input' | 'output'
  created_at: string
}

export const STATUSES: Status[] = ['Pending', 'In Development', 'Complete', 'Ignore']

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  ai_skill: 'AI Skill',
  non_ai_infrastructure: 'Non-AI Infrastructure Component',
  orchestration_component: 'Workflow / Orchestration Component',
}

export const USAGE_MODE_LABELS: Record<UsageMode, string> = {
  standalone: 'Standalone',
  orchestrated: 'Orchestrated',
  both: 'Both',
}

export const NAV_STEPS = [
  { slug: 'goals-planning', title: 'Goals / Planning' },
  { slug: 'discover-question', title: 'Discover / Question' },
  { slug: 'hypothesize-frame', title: 'Hypothesize & Frame' },
  { slug: 'build-validate', title: 'Build / Validate' },
  { slug: 'measure-iterate', title: 'Measure / Iterate' },
  { slug: 'scale-evangelize', title: 'Scale / Evangelize' },
] as const
