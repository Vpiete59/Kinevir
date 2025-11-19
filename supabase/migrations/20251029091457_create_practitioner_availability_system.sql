/*
  # Practitioner Availability System

  1. New Tables
    - `practitioner_recurring_availability`
      - `id` (uuid, primary key)
      - `practitioner_id` (uuid, references practitioners)
      - `day_of_week` (integer) - 0=Sunday, 1=Monday, etc.
      - `start_time` (time)
      - `end_time` (time)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `practitioner_availability_exceptions`
      - `id` (uuid, primary key)
      - `practitioner_id` (uuid, references practitioners)
      - `exception_date` (date)
      - `exception_type` (text) - 'unavailable', 'custom_hours'
      - `start_time` (time, nullable) - for custom hours
      - `end_time` (time, nullable) - for custom hours
      - `reason` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public can view practitioner availability
    - Only practitioners can manage their own availability

  3. Indexes
    - Index on practitioner_id for both tables
    - Index on day_of_week for recurring availability
    - Index on exception_date for exceptions

  4. Important Notes
    - Recurring availability defines weekly schedule
    - Exceptions override recurring availability for specific dates
    - Default slot duration is 20 minutes (configurable in application logic)
*/

CREATE TABLE IF NOT EXISTS practitioner_recurring_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id uuid REFERENCES practitioners(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS practitioner_availability_exceptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id uuid REFERENCES practitioners(id) ON DELETE CASCADE NOT NULL,
  exception_date date NOT NULL,
  exception_type text NOT NULL CHECK (exception_type IN ('unavailable', 'custom_hours')),
  start_time time,
  end_time time,
  reason text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_exception_time CHECK (
    (exception_type = 'unavailable') OR
    (exception_type = 'custom_hours' AND start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time)
  )
);

CREATE INDEX IF NOT EXISTS idx_recurring_availability_practitioner ON practitioner_recurring_availability(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_recurring_availability_day ON practitioner_recurring_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_recurring_availability_active ON practitioner_recurring_availability(is_active);

CREATE INDEX IF NOT EXISTS idx_availability_exceptions_practitioner ON practitioner_availability_exceptions(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_availability_exceptions_date ON practitioner_availability_exceptions(exception_date);

ALTER TABLE practitioner_recurring_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioner_availability_exceptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active recurring availability"
  ON practitioner_recurring_availability FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Practitioners can manage own recurring availability"
  ON practitioner_recurring_availability FOR ALL
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

CREATE POLICY "Anyone can view availability exceptions"
  ON practitioner_availability_exceptions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Practitioners can manage own exceptions"
  ON practitioner_availability_exceptions FOR ALL
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
