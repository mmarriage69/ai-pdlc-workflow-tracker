-- AI PDLC Workflow Tracker v1 — no auth, disable RLS so anon key can read/write
-- Run this in the Supabase SQL editor after 001_initial_schema.sql

ALTER TABLE people            DISABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_steps    DISABLE ROW LEVEL SECURITY;
ALTER TABLE step_sections     DISABLE ROW LEVEL SECURITY;
ALTER TABLE step_items        DISABLE ROW LEVEL SECURITY;

-- Also grant full access to the anon and authenticated roles
GRANT ALL ON people            TO anon, authenticated;
GRANT ALL ON workflow_steps    TO anon, authenticated;
GRANT ALL ON step_sections     TO anon, authenticated;
GRANT ALL ON step_items        TO anon, authenticated;
