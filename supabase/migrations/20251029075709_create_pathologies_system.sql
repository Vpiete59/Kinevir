/*
  # Interactive Skeleton Pathologies System

  1. New Tables
    - `body_regions`
      - `id` (uuid, primary key)
      - `name` (text, unique) - e.g., "shoulder", "knee", "spine"
      - `display_name` (text) - e.g., "Épaule", "Genou"
      - `description` (text)
      - `svg_path` (text) - SVG coordinates for clickable areas
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `pathologies`
      - `id` (uuid, primary key)
      - `region_id` (uuid, foreign key to body_regions)
      - `name` (text)
      - `slug` (text, unique) - for SEO-friendly URLs
      - `short_description` (text)
      - `detailed_description` (text)
      - `symptoms` (jsonb) - array of symptoms
      - `causes` (jsonb) - array of causes
      - `treatments` (jsonb) - array of treatment options
      - `exercises` (jsonb) - array of recommended exercises
      - `prevention_tips` (jsonb) - array of prevention tips
      - `severity` (text) - "mild", "moderate", "severe"
      - `image_url` (text)
      - `published` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access for published pathologies
    - Authenticated users can read all
    - Only authenticated users can create/update (for API integration)

  3. Indexes
    - Index on slug for fast lookups
    - Index on region_id for filtering
    - Index on published status
*/

CREATE TABLE IF NOT EXISTS body_regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  svg_path text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pathologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id uuid REFERENCES body_regions(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  short_description text,
  detailed_description text,
  symptoms jsonb DEFAULT '[]'::jsonb,
  causes jsonb DEFAULT '[]'::jsonb,
  treatments jsonb DEFAULT '[]'::jsonb,
  exercises jsonb DEFAULT '[]'::jsonb,
  prevention_tips jsonb DEFAULT '[]'::jsonb,
  severity text DEFAULT 'moderate',
  image_url text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pathologies_slug ON pathologies(slug);
CREATE INDEX IF NOT EXISTS idx_pathologies_region ON pathologies(region_id);
CREATE INDEX IF NOT EXISTS idx_pathologies_published ON pathologies(published);

ALTER TABLE body_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pathologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view body regions"
  ON body_regions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view published pathologies"
  ON pathologies FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can view all pathologies"
  ON pathologies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert pathologies"
  ON pathologies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update pathologies"
  ON pathologies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert body regions"
  ON body_regions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update body regions"
  ON body_regions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO body_regions (name, display_name, description) VALUES
  ('shoulder', 'Épaule', 'Articulation complexe permettant une grande mobilité du bras'),
  ('elbow', 'Coude', 'Articulation charnière entre le bras et l''avant-bras'),
  ('wrist', 'Poignet', 'Ensemble d''articulations entre l''avant-bras et la main'),
  ('hip', 'Hanche', 'Articulation entre le fémur et le bassin'),
  ('knee', 'Genou', 'Articulation entre le fémur et le tibia'),
  ('ankle', 'Cheville', 'Articulation entre la jambe et le pied'),
  ('spine_cervical', 'Colonne cervicale', 'Vertèbres du cou'),
  ('spine_thoracic', 'Colonne thoracique', 'Vertèbres du dos'),
  ('spine_lumbar', 'Colonne lombaire', 'Vertèbres du bas du dos')
ON CONFLICT (name) DO NOTHING;
