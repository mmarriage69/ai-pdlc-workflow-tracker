-- AI PDLC Workflow Tracker v1 — add detail_json and prompt_text to step_items
-- Run this in the Supabase SQL editor after 002_disable_rls.sql

ALTER TABLE step_items
  ADD COLUMN IF NOT EXISTS detail_json JSONB NULL,
  ADD COLUMN IF NOT EXISTS prompt_text TEXT NULL;
