/*
  # Exercises and Wellness Content System

  1. New Tables
    - `exercises`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `instructions` (jsonb) - array of step-by-step instructions
      - `duration_minutes` (integer)
      - `difficulty` (text) - beginner, intermediate, advanced
      - `category` (text)
      - `video_url` (text)
      - `image_url` (text)
      - `equipment_needed` (jsonb) - array of equipment
      - `target_areas` (jsonb) - array of body areas
      - `published` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `wellness_articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `slug` (text, unique)
      - `category` (text) - sleep, nutrition, stress, general
      - `content` (text)
      - `excerpt` (text)
      - `image_url` (text)
      - `author` (text)
      - `reading_time_minutes` (integer)
      - `published` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public can view published content
    - Authenticated users required for exercises (gated content)
    - Only authenticated users can create/update content

  3. Indexes
    - Index on slug for SEO-friendly URLs
    - Index on published status
    - Index on category for filtering
*/

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  instructions jsonb DEFAULT '[]'::jsonb,
  duration_minutes integer,
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  category text NOT NULL,
  video_url text,
  image_url text,
  equipment_needed jsonb DEFAULT '[]'::jsonb,
  target_areas jsonb DEFAULT '[]'::jsonb,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wellness_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text DEFAULT 'general' CHECK (category IN ('sleep', 'nutrition', 'stress', 'general')),
  content text NOT NULL,
  excerpt text,
  image_url text,
  author text,
  reading_time_minutes integer,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exercises_slug ON exercises(slug);
CREATE INDEX IF NOT EXISTS idx_exercises_published ON exercises(published);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty);

CREATE INDEX IF NOT EXISTS idx_wellness_slug ON wellness_articles(slug);
CREATE INDEX IF NOT EXISTS idx_wellness_published ON wellness_articles(published);
CREATE INDEX IF NOT EXISTS idx_wellness_category ON wellness_articles(category);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published exercises"
  ON exercises FOR SELECT
  TO authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can create exercises"
  ON exercises FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update exercises"
  ON exercises FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view published wellness articles"
  ON wellness_articles FOR SELECT
  TO public
  USING (published = true);

CREATE POLICY "Authenticated users can create wellness articles"
  ON wellness_articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update wellness articles"
  ON wellness_articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
