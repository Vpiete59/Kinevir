/*
  # Practitioners and Appointment Acts System

  1. New Tables
    - `practitioners`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `full_name` (text)
      - `specialty` (text)
      - `description` (text)
      - `photo_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `appointment_acts`
      - `id` (uuid, primary key)
      - `practitioner_id` (uuid, references practitioners)
      - `title` (text)
      - `description` (text)
      - `duration_minutes` (integer)
      - `price_euros` (numeric)
      - `color` (text) - hex color for calendar display
      - `is_first_consultation` (boolean, default false)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Updates to appointments table
    - Add `act_id` (uuid, references appointment_acts)
    - Add `is_emergency` (boolean, default false)
    - Add `emergency_surcharge` (numeric, default 0)
    - Add `total_price` (numeric)

  3. Security
    - Enable RLS on both tables
    - Public can view active practitioners and acts
    - Only practitioners can manage their own data
    - Appointments linked to acts for detailed tracking

  4. Indexes
    - Index on practitioner user_id
    - Index on act practitioner_id
    - Index on appointment act_id
*/

CREATE TABLE IF NOT EXISTS practitioners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  specialty text NOT NULL,
  description text,
  photo_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS appointment_acts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id uuid REFERENCES practitioners(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  duration_minutes integer DEFAULT 60 NOT NULL,
  price_euros numeric(10,2) DEFAULT 0 NOT NULL,
  color text DEFAULT '#457484',
  is_first_consultation boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'act_id'
  ) THEN
    ALTER TABLE appointments ADD COLUMN act_id uuid REFERENCES appointment_acts(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'is_emergency'
  ) THEN
    ALTER TABLE appointments ADD COLUMN is_emergency boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'emergency_surcharge'
  ) THEN
    ALTER TABLE appointments ADD COLUMN emergency_surcharge numeric(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'total_price'
  ) THEN
    ALTER TABLE appointments ADD COLUMN total_price numeric(10,2) DEFAULT 0;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_practitioners_user ON practitioners(user_id);
CREATE INDEX IF NOT EXISTS idx_practitioners_active ON practitioners(is_active);
CREATE INDEX IF NOT EXISTS idx_appointment_acts_practitioner ON appointment_acts(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_appointment_acts_active ON appointment_acts(is_active);
CREATE INDEX IF NOT EXISTS idx_appointments_act ON appointments(act_id);

ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_acts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active practitioners"
  ON practitioners FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Practitioners can manage own profile"
  ON practitioners FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create practitioner profiles"
  ON practitioners FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active acts"
  ON appointment_acts FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Practitioners can create own acts"
  ON appointment_acts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.id = practitioner_id
      AND practitioners.user_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can update own acts"
  ON appointment_acts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.id = practitioner_id
      AND practitioners.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.id = practitioner_id
      AND practitioners.user_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can delete own acts"
  ON appointment_acts FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM practitioners
      WHERE practitioners.id = practitioner_id
      AND practitioners.user_id = auth.uid()
    )
  );
