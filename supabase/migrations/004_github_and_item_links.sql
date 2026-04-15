-- Add github URL field to step items
ALTER TABLE step_items ADD COLUMN IF NOT EXISTS github_url TEXT;

-- Cross-reference links between step items (inputs / outputs)
CREATE TABLE IF NOT EXISTS step_item_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_item_id  UUID NOT NULL REFERENCES step_items(id) ON DELETE CASCADE,
  target_item_id  UUID NOT NULL REFERENCES step_items(id) ON DELETE CASCADE,
  link_type       TEXT NOT NULL CHECK (link_type IN ('input', 'output')),
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_item_id, target_item_id, link_type)
);

ALTER TABLE step_item_links DISABLE ROW LEVEL SECURITY;

GRANT ALL ON step_item_links TO anon, authenticated;

CREATE INDEX IF NOT EXISTS step_item_links_source_idx ON step_item_links(source_item_id);
CREATE INDEX IF NOT EXISTS step_item_links_target_idx ON step_item_links(target_item_id);
