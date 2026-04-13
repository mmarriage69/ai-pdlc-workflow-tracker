-- AI PDLC Workflow Tracker - Initial Schema

-- People table
CREATE TABLE IF NOT EXISTS people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Workflow steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  order_index integer NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending','In Development','Complete','Ignore')),
  owner_person_id uuid REFERENCES people(id) ON DELETE SET NULL,
  metric_owner_person_id uuid REFERENCES people(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step sections table
CREATE TABLE IF NOT EXISTS step_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_step_id uuid NOT NULL REFERENCES workflow_steps(id) ON DELETE CASCADE,
  title text NOT NULL,
  section_key text,
  order_index integer NOT NULL,
  content_json jsonb DEFAULT '{}',
  is_default boolean DEFAULT false,
  is_collapsed_default boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enums for step_items
DO $$ BEGIN
  CREATE TYPE item_type_enum AS ENUM ('ai_skill','non_ai_infrastructure','orchestration_component');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE usage_mode_enum AS ENUM ('standalone','orchestrated','both');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE item_status_enum AS ENUM ('Pending','In Development','Complete','Ignore');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step items table
CREATE TABLE IF NOT EXISTS step_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_step_id uuid NOT NULL REFERENCES workflow_steps(id) ON DELETE CASCADE,
  title text NOT NULL,
  item_type item_type_enum NOT NULL,
  description_json jsonb DEFAULT '{}',
  status item_status_enum NOT NULL DEFAULT 'Pending',
  owner_person_id uuid REFERENCES people(id) ON DELETE SET NULL,
  builder_person_id uuid REFERENCES people(id) ON DELETE SET NULL,
  usage_mode usage_mode_enum DEFAULT 'standalone',
  inputs_json jsonb DEFAULT '{}',
  outputs_json jsonb DEFAULT '{}',
  notes_json jsonb DEFAULT '{}',
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflow_steps_updated_at BEFORE UPDATE ON workflow_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_step_sections_updated_at BEFORE UPDATE ON step_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_step_items_updated_at BEFORE UPDATE ON step_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
