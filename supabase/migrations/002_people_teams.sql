-- Migration 002: Teams table + email / team_id on people
-- Run this in your Supabase SQL Editor after 001_initial_schema.sql

-- ── Teams ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── People additions ────────────────────────────────────────────────────────
ALTER TABLE people
  ADD COLUMN IF NOT EXISTS email   text,
  ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES teams(id) ON DELETE SET NULL;
