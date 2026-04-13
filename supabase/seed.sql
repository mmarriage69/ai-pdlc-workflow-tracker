-- AI PDLC Workflow Tracker - Seed Data
-- Run this after running the migration.
-- Execute in Supabase SQL Editor.

-- Clear existing data (safe to re-run)
TRUNCATE step_items, step_sections, workflow_steps, people RESTART IDENTITY CASCADE;

-- ============================================================
-- PEOPLE
-- ============================================================
INSERT INTO people (id, first_name, last_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alex', 'Morgan'),
  ('22222222-2222-2222-2222-222222222222', 'Jordan', 'Lee'),
  ('33333333-3333-3333-3333-333333333333', 'Taylor', 'Nguyen'),
  ('44444444-4444-4444-4444-444444444444', 'Casey', 'Patel'),
  ('55555555-5555-5555-5555-555555555555', 'Sam', 'Rivera');

-- ============================================================
-- WORKFLOW STEPS
-- ============================================================
INSERT INTO workflow_steps (id, slug, title, order_index, status) VALUES
  ('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'goals-planning',     'Goals / Planning',      1, 'Pending'),
  ('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'discover-question',  'Discover / Question',   2, 'Pending'),
  ('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'hypothesize-frame',  'Hypothesize & Frame',   3, 'Pending'),
  ('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'build-validate',     'Build / Validate',      4, 'Pending'),
  ('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'measure-iterate',    'Measure / Iterate',     5, 'Pending'),
  ('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'scale-evangelize',   'Scale / Evangelize',    6, 'Pending');

-- ============================================================
-- HELPER: build a TipTap doc from plain text
-- ============================================================
-- We store TipTap JSON. Plain paragraphs are wrapped as:
-- {"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"..."}]}]}

-- ============================================================
-- STEP 1: Goals / Planning - SECTIONS
-- ============================================================
INSERT INTO step_sections (workflow_step_id, title, section_key, order_index, content_json, is_default, is_collapsed_default) VALUES

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Summary', 'summary', 1,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This step establishes the strategic direction for the product organization. In an AI-assisted PDLC, the roadmap shifts from a static feature commitment list toward a dynamic decision framework focused on outcomes, problem spaces, current bets, and learning goals. The purpose of this step is to clarify what matters, what constraints exist, and where teams should focus their time."}]}]}',
true, false),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Why this step matters', 'why_matters', 2,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Without a clear planning layer, downstream automation creates speed without direction. Goals and planning provide the guardrails for prioritization, hypothesis formation, and investment decisions. This step ensures that teams are solving meaningful problems aligned with strategy rather than merely reacting to incoming signals."}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'AI automation opportunities', 'ai_opportunities', 3,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Summarize strategic inputs from leadership documents, planning decks, and prior-quarter reviews"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate draft outcome statements from business goals"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Propose roadmap themes based on prior performance and current signals"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate scenario comparisons for different investment allocations"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Identify risks, dependencies, and tradeoffs across roadmap options"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft quarterly planning narratives for stakeholders"}]}]}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Non-AI infrastructure needs', 'non_ai_needs', 4,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Source repository for strategic inputs and planning artifacts"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Standardized planning templates"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Versioned roadmap storage"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Shared taxonomy for goals, themes, initiatives, and outcomes"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Source-of-truth link management"}]}]}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Ownership', 'ownership', 5,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Accountable owner should typically be Product Leadership. Metric owner should typically be Product Leadership or Product Operations. Supporting teams may include Finance, Engineering Leadership, Design Leadership, and GTM Leadership."}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Metrics', 'metrics', 6,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of roadmap items tied to explicit outcomes"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of roadmap items with clear success metrics"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Planning cycle time"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Planning confidence score from stakeholders"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Number of mid-quarter roadmap changes with documented rationale"}]}]}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Inputs', 'inputs', 7,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Company goals"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Prior quarter performance"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Strategic initiatives"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Executive guidance"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Market context"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Customer and product performance summaries"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Capacity assumptions"}]}]}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Outputs', 'outputs', 8,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Strategic outcomes"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Roadmap themes"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Prioritized problem spaces"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Current bets"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Learning agenda"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Planning narrative for stakeholders"}]}]}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Skills / Components', 'skills_components', 9,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"See the skills and components listed below."}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Orchestration / Standalone Use', 'orchestration', 10,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Most planning skills should remain small and composable. They should be runnable individually for ad hoc support, but also chainable into a quarterly planning workflow."}]}]}',
true, true),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Risks / Notes', 'risks_notes', 11,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Over-automating strategic judgment"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Creating false certainty from generated narratives"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Letting AI-generated roadmap language obscure unresolved tradeoffs"}]}]}]}]}',
true, true);

-- ============================================================
-- STEP 1: Goals / Planning - ITEMS
-- ============================================================
INSERT INTO step_items (workflow_step_id, title, item_type, description_json, status, usage_mode, inputs_json, outputs_json, notes_json, order_index) VALUES

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Planning Narrative Generator', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Drafts a quarterly roadmap narrative from business goals, prior performance, and strategic priorities."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Planning docs, prior-quarter summaries, leadership goals"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Roadmap narrative, executive summary, talking points"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Useful for internal stakeholder communication."}]}]}',
1),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Outcome Drafting Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Converts high-level strategic goals into outcome-oriented product objectives and candidate success statements."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Company goals, leadership inputs"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft outcomes, draft success statements"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Keeps roadmap language outcome-focused."}]}]}',
2),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Scenario Comparison Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Generates alternative planning scenarios with tradeoffs across capacity, strategic fit, confidence, and risk."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Candidate initiatives, capacity assumptions, priorities"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Scenario comparison summary, tradeoff view"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Supports planning discussion, not final decision-making."}]}]}',
3),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Planning Taxonomy Model', 'non_ai_infrastructure',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Defines the shared data model and naming conventions for goals, themes, bets, and outcomes."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Planning framework decisions"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Reusable taxonomy and structure"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Critical to consistency across the app."}]}]}',
4),

('aaaaaaaa-0001-0001-0001-aaaaaaaaaaaa', 'Quarterly Planning Workflow', 'orchestration_component',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Coordinates planning inputs, runs drafting skills, and packages outputs into a planning view."}]}]}',
'Pending', 'orchestrated',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Leadership inputs, strategic documents, current metrics"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Planning package for review"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Can orchestrate multiple small skills without collapsing them into one large skill."}]}]}',
5);

-- ============================================================
-- STEP 2: Discover / Question - SECTIONS
-- ============================================================
INSERT INTO step_sections (workflow_step_id, title, section_key, order_index, content_json, is_default, is_collapsed_default) VALUES

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Summary', 'summary', 1,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This step collects and structures raw signals entering the product process. It covers both signal intake and discovery synthesis. Sources may be file-based or direct-source connections via API/connectors. The purpose is to transform fragmented raw evidence into structured, evidence-backed insight candidates for the next phase."}]}]}',
true, false),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Why this step matters', 'why_matters', 2,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is the upstream foundation of the AI-assisted PDLC. If the raw signal layer is weak, every downstream step becomes noisier and less reliable. Good discovery automation reduces manual synthesis work, increases traceability, and creates a durable source of product insight."}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'AI automation opportunities', 'ai_opportunities', 3,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Classify and enrich incoming records"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Cluster related signals into themes"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Summarize recurring pain points"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Identify contradictions across segments or sources"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Suggest likely root-cause candidates"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Identify gaps in evidence"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate a discovery synthesis brief"}]}]}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Non-AI infrastructure needs', 'non_ai_needs', 4,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"File intake pipeline"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Direct source connectors via API"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Source scheduling and sync"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Schema normalization layer"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Metadata validation"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Deduplication rules"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Source health monitoring"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Access controls for sensitive source data"}]}]}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Ownership', 'ownership', 5,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Signal Collection and Research Intake should typically be owned by Product Operations. Discovery Synthesis and Insight Distillation should typically be owned by Product Management. Metric owner for intake should typically be Product Operations. Metric owner for synthesis should typically be Product Management. Supporting teams may include Data/Analytics, Research, Sales Ops, Customer Success Ops, and Engineering for source integrations."}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Metrics', 'metrics', 6,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of priority sources successfully ingested"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of connected systems syncing successfully"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of records with required metadata"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Duplicate rate across sources"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Time from source creation to structured availability"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Exception/manual review rate"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Synthesis time from structured intake to usable brief"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of synthesized themes backed by traceable evidence"}]}]}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Inputs', 'inputs', 7,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"File-based inputs: CSV exports, spreadsheets, transcripts, survey exports, decks, notes, analytics exports."}]},{"type":"paragraph","content":[{"type":"text","text":"Connected-source inputs: Aha records, Pendo data, Salesforce data, support platform tickets, survey platform responses, analytics platform data, knowledge system records, CRM/CS platform data."}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Outputs', 'outputs', 8,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Normalized signal dataset"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Enriched signal inventory"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Duplicate clusters"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Quality exception log"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Discovery synthesis brief"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Theme list with evidence"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Contradiction summary"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Root-cause candidates"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Evidence gaps"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Follow-up questions"}]}]}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Skills / Components', 'skills_components', 9,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"See the skills and components listed below."}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Orchestration / Standalone Use', 'orchestration', 10,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Keep most discovery capabilities as small, reusable skills. Combine them through orchestration, not by collapsing them into one large ''research AI.'' This makes the system easier to test, reuse, and maintain."}]}]}',
true, true),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Risks / Notes', 'risks_notes', 11,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Poor data quality from upstream sources"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Hidden connector failures"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Overconfident synthesis without evidence"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Flattening contradictions instead of surfacing them"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Weak traceability back to raw source material"}]}]}]}]}',
true, true);

-- ============================================================
-- STEP 2: Discover / Question - ITEMS
-- ============================================================
INSERT INTO step_items (workflow_step_id, title, item_type, description_json, status, usage_mode, inputs_json, outputs_json, notes_json, order_index) VALUES

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'File Intake Adapter', 'non_ai_infrastructure',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Accepts uploaded source files and routes them to the correct parser and normalization flow."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Files from users"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Parsed source records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Separate this from AI logic."}]}]}',
1),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Connected Source Adapter', 'non_ai_infrastructure',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Connects to systems such as Aha, Pendo, Salesforce, support tools, and analytics tools to pull source records on demand or on schedule."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"API credentials, source configuration"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Raw source records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Handle auth, retry, and incremental sync here rather than in AI skills."}]}]}',
2),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Normalization Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Maps source-specific records into a shared signal schema."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Parsed source records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Normalized signal records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Should preserve links back to source records."}]}]}',
3),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Signal Classification Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Tags normalized records by product area, segment, journey stage, issue type, and source type."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Normalized signal records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Enriched classified records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Low-confidence classifications should be reviewable."}]}]}',
4),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Deduplication Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Identifies overlapping or near-duplicate signals across multiple sources."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Normalized and classified records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Duplicate clusters and canonical groupings"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Important for reducing repeated evidence."}]}]}',
5),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Theme Clustering Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Groups related signals into coherent themes."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Classified signal records"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Theme clusters"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Supports downstream synthesis."}]}]}',
6),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Insight Summarization Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Converts theme clusters into concise, evidence-backed discovery insights."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Theme clusters, supporting evidence"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Synthesis summaries and insight candidates"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Should cite source evidence."}]}]}',
7),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Contradiction Detection Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Detects disagreement or variability across sources, segments, or channels."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Theme clusters and evidence"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Contradiction flags and explanation"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Important to avoid flattening nuance."}]}]}',
8),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Root Cause Candidate Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Suggests likely underlying causes from the evidence and theme structure."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Synthesized themes and evidence"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Root-cause hypotheses"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Used to prepare for the next phase."}]}]}',
9),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Evidence Gap Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Identifies weak support, missing data, and unanswered questions."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Synthesized findings"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Evidence gap summary and follow-up questions"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Prevents overconfidence."}]}]}',
10),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Signal Intake Workflow', 'orchestration_component',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Chains file/direct-source intake, normalization, classification, deduplication, and quality checks into one reliable intake flow."}]}]}',
'Pending', 'orchestrated',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Uploaded files and connected systems"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Structured signal inventory"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"The workflow should orchestrate small components rather than replace them."}]}]}',
11),

('aaaaaaaa-0002-0002-0002-aaaaaaaaaaaa', 'Discovery Synthesis Workflow', 'orchestration_component',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Chains clustering, summarization, contradiction detection, root-cause suggestion, and evidence-gap review into a repeatable synthesis flow."}]}]}',
'Pending', 'orchestrated',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Structured signal inventory"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Discovery synthesis brief"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Produces a reusable artifact for Hypothesize & Frame."}]}]}',
12);

-- ============================================================
-- STEP 3: Hypothesize & Frame - SECTIONS
-- ============================================================
INSERT INTO step_sections (workflow_step_id, title, section_key, order_index, content_json, is_default, is_collapsed_default) VALUES

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Summary', 'summary', 1,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This step turns discovery outputs into explicit product thinking. It transforms evidence into candidate hypotheses, problem framing, opportunity definitions, prioritization support, and success criteria. This is the bridge between understanding what is happening and deciding what to test or pursue."}]}]}',
true, false),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Why this step matters', 'why_matters', 2,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Without a clear framing layer, teams jump from ''we heard this'' directly to ''let''s build that.'' This phase ensures that product bets are evidence-based, well-scoped, and measurable before resources are invested."}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'AI automation opportunities', 'ai_opportunities', 3,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate candidate hypotheses"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Convert insights into problem statements"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Define affected users and segments"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft opportunity briefs"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Propose prioritization views"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft KPI trees and success criteria"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Identify assumptions and decision risks"}]}]}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Non-AI infrastructure needs', 'non_ai_needs', 4,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Opportunity brief template"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Prioritization framework"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"KPI taxonomy"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Links between discovery evidence and framed opportunities"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Configurable scoring criteria"}]}]}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Ownership', 'ownership', 5,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Accountable owner should typically be Product Management. Metric owner should typically be Product Management. Supporting teams may include Product Leadership, Research, Data/Analytics, and Engineering for feasibility input."}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Metrics', 'metrics', 6,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of hypotheses backed by evidence"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of opportunities with defined success metrics"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Time from discovery brief to framed opportunity"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Rate of framed opportunities that move to validation"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Number of initiatives blocked due to unresolved assumptions"}]}]}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Inputs', 'inputs', 7,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Discovery synthesis brief"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Structured evidence"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Goals and roadmap context"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Historical product performance"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Capacity and dependency context"}]}]}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Outputs', 'outputs', 8,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Ranked hypotheses"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Problem statements"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Opportunity briefs"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Prioritization recommendations"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"KPI tree"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Success thresholds"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Assumptions log"}]}]}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Skills / Components', 'skills_components', 9,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"See the skills and components listed below."}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Orchestration / Standalone Use', 'orchestration', 10,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Every major function here should work as a focused reusable skill. The orchestration layer should assemble them into a repeatable framing workflow."}]}]}',
true, true),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Risks / Notes', 'risks_notes', 11,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Automated prioritization appearing more objective than it is"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Weak KPI design leading to poor downstream decisions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Framing outputs becoming verbose but not actionable"}]}]}]}]}',
true, true);

-- ============================================================
-- STEP 3: Hypothesize & Frame - ITEMS
-- ============================================================
INSERT INTO step_items (workflow_step_id, title, item_type, description_json, status, usage_mode, inputs_json, outputs_json, notes_json, order_index) VALUES

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Hypothesis Generator', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Generates candidate hypotheses from discovery insights and evidence."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Discovery synthesis brief, strategic context"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Ranked hypotheses, assumptions list"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Should make confidence explicit."}]}]}',
1),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Problem Framing Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Converts hypotheses into clear problem statements, target segments, and boundaries."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Candidate hypotheses, evidence"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Problem statements, scope framing"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Keeps teams from jumping straight to solutions."}]}]}',
2),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Opportunity Brief Generator', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Produces structured opportunity briefs tied to evidence, customer impact, and business relevance."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Framed problems, strategic context"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Opportunity brief"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Reusable input for prioritization and PRD generation."}]}]}',
3),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Prioritization Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Scores opportunities against strategic fit, impact, urgency, confidence, and dependency considerations."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Opportunity briefs, scoring criteria, capacity assumptions"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Ranked opportunities, tradeoff summary"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Supports judgment rather than replacing it."}]}]}',
4),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'KPI Design Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Drafts leading and lagging indicators, success criteria, and instrumentation suggestions."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Selected opportunities, business goals"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"KPI tree, success thresholds, metric definitions"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Helps make downstream learning possible."}]}]}',
5),

('aaaaaaaa-0003-0003-0003-aaaaaaaaaaaa', 'Framing Workflow', 'orchestration_component',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Chains hypothesis generation, problem framing, opportunity definition, prioritization support, and KPI drafting."}]}]}',
'Pending', 'orchestrated',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Discovery synthesis brief"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Ready-to-review opportunity package"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Should remain modular underneath."}]}]}',
6);

-- ============================================================
-- STEP 4: Build / Validate - SECTIONS
-- ============================================================
INSERT INTO step_sections (workflow_step_id, title, section_key, order_index, content_json, is_default, is_collapsed_default) VALUES

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Summary', 'summary', 1,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This step translates selected opportunities into buildable and testable work. It includes initiative brief generation, experiment design, delivery preparation, and validation planning. It is where product intent becomes executable work."}]}]}',
true, false),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Why this step matters', 'why_matters', 2,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This is where translation overhead and coordination cost often grow. In an AI-assisted PDLC, the goal is not to remove human judgment but to reduce duplicated interpretation work across product, design, engineering, and QA."}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'AI automation opportunities', 'ai_opportunities', 3,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft initiative briefs or PRDs"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate acceptance criteria"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Propose experiments and rollout strategies"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate task breakdowns"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate QA scenarios"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Identify edge cases and risks"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Create validation and launch-readiness checklists"}]}]}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Non-AI infrastructure needs', 'non_ai_needs', 4,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Product template library"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Design system references"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Engineering workflow templates"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Release gating structure"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Experiment metadata conventions"}]}]}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Ownership', 'ownership', 5,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Accountable owner should typically be Product Management. Metric owner should typically be Product Management, with support from Analytics or Engineering depending on implementation. Supporting teams may include Design, Engineering, QA, and Product Operations."}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Metrics', 'metrics', 6,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Time from approved opportunity to draft initiative brief"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Time from brief to build-ready package"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Acceptance criteria completeness score"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Number of defects tied to missed requirements"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of initiatives with explicit validation plans"}]}]}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Inputs', 'inputs', 7,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Opportunity brief"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Prioritization output"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"KPI definitions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Architecture constraints"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Design constraints"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Release requirements"}]}]}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Outputs', 'outputs', 8,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Initiative brief / PRD"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Acceptance criteria"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Validation plan"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Rollout plan"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Task breakdown"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"QA checklist"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Dependency list"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Launch-readiness notes"}]}]}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Skills / Components', 'skills_components', 9,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"See the skills and components listed below."}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Orchestration / Standalone Use', 'orchestration', 10,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"These skills should remain modular and independently useful, especially for ad hoc initiative support. The workflow component can package them for a smoother handoff into delivery."}]}]}',
true, true),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Risks / Notes', 'risks_notes', 11,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Over-trusting generated requirements"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Losing nuance during artifact generation"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generating too many low-value artifacts instead of the minimum needed"}]}]}]}]}',
true, true);

-- ============================================================
-- STEP 4: Build / Validate - ITEMS
-- ============================================================
INSERT INTO step_items (workflow_step_id, title, item_type, description_json, status, usage_mode, inputs_json, outputs_json, notes_json, order_index) VALUES

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'PRD Authoring Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Drafts initiative briefs or PRDs from framed opportunities, KPIs, and constraints."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Opportunity brief, KPI definitions, constraints"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft PRD, acceptance criteria, open questions"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Human review remains essential."}]}]}',
1),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Experiment Design Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Proposes validation approaches, rollout plans, holdbacks, and measurement criteria."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"PRD, KPI definitions, rollout constraints"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Experiment brief, rollout strategy, decision thresholds"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Good candidate for modular reuse."}]}]}',
2),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Delivery Pack Generator', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Produces role-specific delivery artifacts for design, engineering, QA, and support."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Approved initiative brief"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Tasks, QA checklist, release checklist, support notes"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Replaces repeated manual translation."}]}]}',
3),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Edge Case Reviewer', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Reviews initiative drafts for missing edge cases, workflow failures, and ambiguity."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"PRD and acceptance criteria"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Risk notes and review prompts"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Good quality-support skill."}]}]}',
4),

('aaaaaaaa-0004-0004-0004-aaaaaaaaaaaa', 'Build Preparation Workflow', 'orchestration_component',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Orchestrates PRD drafting, experiment design, delivery-pack generation, and validation packaging."}]}]}',
'Pending', 'orchestrated',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Approved opportunity package"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Build-ready execution package"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Keeps core skills small and composable."}]}]}',
5);

-- ============================================================
-- STEP 5: Measure / Iterate - SECTIONS
-- ============================================================
INSERT INTO step_sections (workflow_step_id, title, section_key, order_index, content_json, is_default, is_collapsed_default) VALUES

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Summary', 'summary', 1,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This step evaluates what happened after work is shipped or tested. It synthesizes post-launch data and feedback into actionable learning, detects anomalies, explains performance shifts, and recommends adjustments to roadmap or execution."}]}]}',
true, false),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Why this step matters', 'why_matters', 2,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Without strong measurement and iteration, product teams ship faster but learn no faster. This phase closes the loop and turns delivery into cumulative product intelligence."}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'AI automation opportunities', 'ai_opportunities', 3,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Synthesize post-launch feedback"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate dashboard narratives"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Detect anomalies and regressions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Explain likely drivers of performance change"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Route issues into product, UX, support, or messaging buckets"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Recommend roadmap updates or follow-up investigations"}]}]}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Non-AI infrastructure needs', 'non_ai_needs', 4,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Analytics access layer"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Release-event tagging"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Telemetry conventions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Issue routing conventions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Experiment metadata tracking"}]}]}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Ownership', 'ownership', 5,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Accountable owner should typically be Product Management. Metric owner should typically be Product Management or Analytics, depending on team structure. Supporting teams may include Analytics, Support, Customer Success, and Engineering."}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Metrics', 'metrics', 6,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Time from release to learning summary"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of launches with post-launch review completed"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Anomaly detection precision"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Number of roadmap adjustments informed by post-launch evidence"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Issue routing accuracy"}]}]}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Inputs', 'inputs', 7,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Usage analytics"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Support tickets"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"NPS/CSAT"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Customer feedback"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Release metadata"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Experiment results"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Feature flag data"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Sales/support notes"}]}]}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Outputs', 'outputs', 8,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Post-launch learning summary"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Anomaly flags"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Issue routing recommendations"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Likely root-cause notes"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Follow-up opportunity recommendations"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Roadmap refresh suggestions"}]}]}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Skills / Components', 'skills_components', 9,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"See the skills and components listed below."}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Orchestration / Standalone Use', 'orchestration', 10,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"These skills should work individually for specific launches or analyses, but combine cleanly into a repeatable learning workflow."}]}]}',
true, true),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Risks / Notes', 'risks_notes', 11,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Confusing correlation with causation"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Noisy metrics leading to spurious conclusions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Too much narrative output with not enough decision clarity"}]}]}]}]}',
true, true);

-- ============================================================
-- STEP 5: Measure / Iterate - ITEMS
-- ============================================================
INSERT INTO step_items (workflow_step_id, title, item_type, description_json, status, usage_mode, inputs_json, outputs_json, notes_json, order_index) VALUES

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Post-Launch Learning Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Synthesizes quantitative and qualitative signals after release into a learning summary."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Feedback, analytics, release metadata"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Learning summary, friction clusters, follow-up actions"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Strong downstream counterpart to discovery automation."}]}]}',
1),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Insight Narrator', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Converts dashboards and KPI shifts into plain-language summaries with likely explanations."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Analytics snapshots, targets, baselines"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Narrative performance summary"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Good for recurring stakeholder communication."}]}]}',
2),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Anomaly Detection Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Flags unusual patterns, regressions, or adoption issues requiring attention."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Usage and KPI data"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Anomaly alerts and suspected drivers"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Keep model explainability simple."}]}]}',
3),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Roadmap Refresh Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Recommends roadmap or priority adjustments based on new evidence."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Post-launch learning, current roadmap context"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Suggested roadmap changes and rationale"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Supports decision-making, not automatic roadmap movement."}]}]}',
4),

('aaaaaaaa-0005-0005-0005-aaaaaaaaaaaa', 'Learning Workflow', 'orchestration_component',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Orchestrates post-launch synthesis, anomaly review, dashboard narration, and roadmap update support."}]}]}',
'Pending', 'orchestrated',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Launch and measurement data"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Structured learning package"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Completes the delivery-to-learning loop."}]}]}',
5);

-- ============================================================
-- STEP 6: Scale / Evangelize - SECTIONS
-- ============================================================
INSERT INTO step_sections (workflow_step_id, title, section_key, order_index, content_json, is_default, is_collapsed_default) VALUES

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Summary', 'summary', 1,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"This step takes what has been built and learned and turns it into scalable organizational value. It includes internal enablement, audience-specific communication, reusable playbooks, and durable process maintenance."}]}]}',
true, false),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Why this step matters', 'why_matters', 2,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Even strong product work loses impact if teams cannot understand, support, explain, or repeat it. This phase helps the organization absorb product learning and operationalize it across functions."}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'AI automation opportunities', 'ai_opportunities', 3,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generate audience-specific enablement materials"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Create release summaries and FAQs"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Tailor content for product, support, GTM, and leadership audiences"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Identify stale playbook content"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Draft process documentation updates"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Summarize recurring launch patterns into reusable guidance"}]}]}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Non-AI infrastructure needs', 'non_ai_needs', 4,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Content publishing conventions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Playbook repository"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Template management"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Shared terminology standards"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Documentation ownership model"}]}]}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Ownership', 'ownership', 5,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Accountable owner should typically be Product Operations or Product Management, depending on the organization. Metric owner should typically be Product Operations. Supporting teams may include Marketing, Enablement, Support, Sales, and Customer Success."}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Metrics', 'metrics', 6,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Time from release to enablement package"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Percentage of major launches with complete enablement artifacts"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Playbook freshness score"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Usage of generated enablement content"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Documentation update cycle time"}]}]}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Inputs', 'inputs', 7,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Initiative brief"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Release summary"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Post-launch learning"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Audience definitions"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Style/brand guidance"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Existing playbooks"}]}]}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Outputs', 'outputs', 8,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Release notes"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Internal enablement content"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"FAQs"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Audience-specific messaging"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Playbook updates"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Process improvement recommendations"}]}]}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Skills / Components', 'skills_components', 9,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"See the skills and components listed below."}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Orchestration / Standalone Use', 'orchestration', 10,
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Content generation skills should remain individually useful, but combine well into a repeatable downstream communication flow."}]}]}',
true, true),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Risks / Notes', 'risks_notes', 11,
'{"type":"doc","content":[{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Generating too much content instead of the few materials people actually use"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Documentation sprawl"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Lack of clear ownership for keeping materials current"}]}]}]}]}',
true, true);

-- ============================================================
-- STEP 6: Scale / Evangelize - ITEMS
-- ============================================================
INSERT INTO step_items (workflow_step_id, title, item_type, description_json, status, usage_mode, inputs_json, outputs_json, notes_json, order_index) VALUES

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Launch Content Generator', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Creates audience-specific communication and enablement materials from a common source package."}]}]}',
'Pending', 'both',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Release summary, initiative brief, audience definitions"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"FAQs, internal comms, release notes, enablement drafts"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Reduces duplicated downstream content creation."}]}]}',
1),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Playbook Update Assistant', 'ai_skill',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Reviews process docs and recommends updates based on how work is actually being executed."}]}]}',
'Pending', 'standalone',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Current playbooks, actual workflow artifacts, recent lessons learned"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Proposed documentation changes, stale-doc alerts"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Helps prevent process drift."}]}]}',
2),

('aaaaaaaa-0006-0006-0006-aaaaaaaaaaaa', 'Evangelize Workflow', 'orchestration_component',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Packages release, learning, and enablement outputs into a reusable communication and documentation flow."}]}]}',
'Pending', 'orchestrated',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Release outputs, learning outputs"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Shareable enablement package"}]}]}',
'{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Keeps downstream communication structured."}]}]}',
3);
