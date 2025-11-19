/*
  # Create Interactive Skeleton Joints System

  1. New Tables
    - `joints`
      - `id` (uuid, primary key)
      - `name` (text) - Nom de l'articulation (ex: "Genou droit")
      - `slug` (text, unique) - Identifiant unique (ex: "genou-droit")
      - `position_x` (numeric) - Position X relative (0-100%)
      - `position_y` (numeric) - Position Y relative (0-100%)
      - `radius` (integer) - Rayon du point cliquable en pixels
      - `is_active` (boolean) - Articulation active ou non
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `joint_pathologies`
      - `id` (uuid, primary key)
      - `joint_id` (uuid, foreign key to joints)
      - `pathology_id` (uuid, foreign key to pathologies)
      - `display_order` (integer) - Ordre d'affichage
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Patients can view active joints and their pathologies
    - Practitioners can manage joints and associations
    - Admins have full access

  3. Indexes
    - Index on joint slug for fast lookups
    - Index on joint_pathologies relationships
*/

-- Create joints table
CREATE TABLE IF NOT EXISTS joints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  position_x numeric(5,2) NOT NULL CHECK (position_x >= 0 AND position_x <= 100),
  position_y numeric(5,2) NOT NULL CHECK (position_y >= 0 AND position_y <= 100),
  radius integer NOT NULL DEFAULT 6 CHECK (radius > 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create joint_pathologies junction table
CREATE TABLE IF NOT EXISTS joint_pathologies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  joint_id uuid NOT NULL REFERENCES joints(id) ON DELETE CASCADE,
  pathology_id uuid NOT NULL REFERENCES pathologies(id) ON DELETE CASCADE,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(joint_id, pathology_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_joints_slug ON joints(slug);
CREATE INDEX IF NOT EXISTS idx_joints_active ON joints(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_joint_pathologies_joint ON joint_pathologies(joint_id);
CREATE INDEX IF NOT EXISTS idx_joint_pathologies_pathology ON joint_pathologies(pathology_id);

-- Enable RLS
ALTER TABLE joints ENABLE ROW LEVEL SECURITY;
ALTER TABLE joint_pathologies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for joints table

-- Everyone can view active joints
CREATE POLICY "Anyone can view active joints"
  ON joints FOR SELECT
  USING (is_active = true);

-- Practitioners can view all joints
CREATE POLICY "Practitioners can view all joints"
  ON joints FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  );

-- Practitioners can insert joints
CREATE POLICY "Practitioners can insert joints"
  ON joints FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  );

-- Practitioners can update joints
CREATE POLICY "Practitioners can update joints"
  ON joints FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  );

-- Practitioners can delete joints
CREATE POLICY "Practitioners can delete joints"
  ON joints FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  );

-- RLS Policies for joint_pathologies table

-- Everyone can view joint-pathology associations for active joints
CREATE POLICY "Anyone can view joint pathologies"
  ON joint_pathologies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM joints
      WHERE joints.id = joint_pathologies.joint_id
      AND joints.is_active = true
    )
  );

-- Practitioners can manage joint-pathology associations
CREATE POLICY "Practitioners can insert joint pathologies"
  ON joint_pathologies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can update joint pathologies"
  ON joint_pathologies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can delete joint pathologies"
  ON joint_pathologies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.user_id = auth.uid()
    )
  );

-- Insert default joints based on current skeleton
INSERT INTO joints (name, slug, position_x, position_y, radius) VALUES
  ('Cervicales', 'cervicales', 50.0, 8.0, 5),
  ('Épaule gauche', 'epaule-gauche', 34.8, 15.0, 5),
  ('Épaule droite', 'epaule-droite', 65.2, 15.0, 5),
  ('Coude gauche', 'coude-gauche', 26.0, 26.0, 5),
  ('Coude droit', 'coude-droit', 74.0, 26.0, 5),
  ('Poignet gauche', 'poignet-gauche', 21.2, 36.5, 4),
  ('Poignet droit', 'poignet-droit', 78.8, 36.5, 4),
  ('Main gauche', 'main-gauche', 18.0, 43.0, 4),
  ('Main droite', 'main-droite', 82.0, 43.0, 4),
  ('Dos & Lombaires', 'dos', 50.0, 27.0, 6),
  ('Hanche gauche', 'hanche-gauche', 42.8, 41.2, 5),
  ('Hanche droite', 'hanche-droite', 57.2, 41.2, 5),
  ('Genou gauche', 'genou-gauche', 42.8, 62.4, 6),
  ('Genou droit', 'genou-droit', 57.2, 62.4, 6),
  ('Cheville gauche', 'cheville-gauche', 42.8, 83.5, 5),
  ('Cheville droite', 'cheville-droite', 57.2, 83.5, 5),
  ('Pied gauche', 'pied-gauche', 42.8, 90.6, 5),
  ('Pied droit', 'pied-droit', 57.2, 90.6, 5)
ON CONFLICT (slug) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_joints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_joints_updated_at ON joints;
CREATE TRIGGER set_joints_updated_at
  BEFORE UPDATE ON joints
  FOR EACH ROW
  EXECUTE FUNCTION update_joints_updated_at();
