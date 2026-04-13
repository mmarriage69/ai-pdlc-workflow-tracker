# AI PDLC Workflow Tracker

A collaborative internal web app that visualizes the full AI-assisted Product Development Lifecycle (PDLC) as a set of fixed workflow steps. Each step has editable sections, skills/components tracking, owner assignments, status management, and PDF export.

## Tech Stack

- **Next.js 16** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** component library
- **TipTap** rich text editor
- **Supabase** (PostgreSQL) for persistence
- **Vercel** deployment

## Features

- Fixed left-nav with Dashboard, 6 PDLC steps, and People
- Each step page with editable accordion sections (TipTap rich text)
- Skills & Components tracking (AI Skills, Non-AI Infrastructure, Orchestration)
- Owner and metric owner assignment from shared People list
- Status management (Pending → In Development → Complete → Ignore)
- Auto-complete: step status auto-updates to Complete when all non-ignored items are Complete
- Add custom sections and items per step
- Reorderable sections and items
- PDF export via browser print (Ctrl/Cmd+P or Export PDF button)
- Full seed data: all 6 PDLC steps with real content and sample skills/components
- Responsive layout (desktop sidebar + mobile hamburger)

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/ai-pdlc-workflow-tracker.git
cd ai-pdlc-workflow-tracker
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In your project, go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon/public key**

### 3. Run the database migration

In the Supabase SQL Editor, run the migration file:

```
supabase/migrations/001_initial_schema.sql
```

Copy the full contents of that file and execute it in the Supabase SQL Editor.

### 4. Seed the database

After the migration, run the seed file in the Supabase SQL Editor:

```
supabase/seed.sql
```

Copy the full contents of that file and execute it. This inserts all 6 PDLC workflow steps, their sections, skills/components, and 5 sample people.

### 5. Configure environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it will redirect to `/dashboard`.

## Project Structure

```
app/
  layout.tsx              Root layout with sidebar
  page.tsx                Redirects to /dashboard
  dashboard/page.tsx      Dashboard with stats and attention list
  goals-planning/         Step pages (one per PDLC step)
  discover-question/
  hypothesize-frame/
  build-validate/
  measure-iterate/
  scale-evangelize/
  people/page.tsx         People CRUD

components/
  layout/Sidebar.tsx      Left navigation (desktop + mobile)
  editor/RichTextEditor   TipTap editor with toolbar
  steps/
    StepDetailPage.tsx    Main step page component
    SectionAccordion.tsx  Collapsible section with edit/reorder
    ItemCard.tsx          Skill/component card with inline edit
    ItemForm.tsx          Add/edit item form
    OwnerSelect.tsx       Person picker dropdown
    StatusBadge.tsx       Status display badge
  dashboard/DashboardCards.tsx  Dashboard metrics
  people/PeopleTable.tsx        People CRUD table

lib/
  supabase.ts             Supabase client (lazy init)
  types.ts                TypeScript types for all DB tables
  utils.ts                shadcn utility

supabase/
  migrations/001_initial_schema.sql   Database schema
  seed.sql                            Full seed data
```

## PDF Export

Click the **Export PDF** button on any step page, or press **Ctrl+P** / **Cmd+P**. The print stylesheet:

- Hides the sidebar and all interactive controls
- Expands all section content (even collapsed sections)
- Shows full item details
- Prints cleanly on standard paper sizes

## Vercel Deployment

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.
3. In the Vercel project settings, add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

The app will be live at your Vercel URL. Share the URL with your team — no authentication required in v1.

## Data Model

| Table | Description |
|-------|-------------|
| `people` | Shared people list for owner/builder dropdowns |
| `workflow_steps` | The 6 fixed PDLC steps with status and owner fields |
| `step_sections` | Editable content sections per step (TipTap JSON) |
| `step_items` | Skills and components per step (AI Skill / Non-AI Infra / Orchestration) |

## Status Values

- **Pending** — not started
- **In Development** — actively being worked on
- **Complete** — done
- **Ignore** — excluded from completion tracking

When all non-ignored items under a step are Complete, the step automatically updates to Complete.

## Adding People

Go to the **People** page and add team members. They will immediately appear in all owner and builder dropdowns across every workflow step.

## Notes

- No authentication in v1 — anyone with the URL can view and edit
- Content is saved to Supabase on each Save action (no auto-save)
- The top-level navigation items (the 6 PDLC steps) are fixed and cannot be deleted
- Custom sections can be added to any step
