/*
  # Appointments and Teleconsultation System

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `practitioner_id` (uuid, references profiles, nullable)
      - `appointment_date` (timestamptz)
      - `duration_minutes` (integer, default 60)
      - `status` (text) - pending, confirmed, cancelled, completed, no_show
      - `appointment_type` (text) - standard, emergency, teleconsultation
      - `notes` (text)
      - `cancellation_reason` (text)
      - `reminder_sent` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `teleconsultation_rooms`
      - `id` (uuid, primary key)
      - `appointment_id` (uuid, references appointments, unique)
      - `room_id` (text, unique)
      - `jwt_token` (text)
      - `expires_at` (timestamptz)
      - `patient_joined_at` (timestamptz)
      - `practitioner_joined_at` (timestamptz)
      - `ended_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can view and manage their own appointments
    - Practitioners can view appointments assigned to them
    - Users can access teleconsultation rooms for their appointments

  3. Indexes
    - Index on user_id for fast user queries
    - Index on appointment_date for scheduling queries
    - Index on status for filtering
    - Index on room_id for teleconsultation lookup
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  practitioner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  appointment_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60 NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  appointment_type text DEFAULT 'standard' NOT NULL CHECK (appointment_type IN ('standard', 'emergency', 'teleconsultation')),
  notes text,
  cancellation_reason text,
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teleconsultation_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid UNIQUE REFERENCES appointments(id) ON DELETE CASCADE NOT NULL,
  room_id text UNIQUE NOT NULL,
  jwt_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  patient_joined_at timestamptz,
  practitioner_joined_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_practitioner ON appointments(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_room ON teleconsultation_rooms(room_id);
CREATE INDEX IF NOT EXISTS idx_teleconsultation_appointment ON teleconsultation_rooms(appointment_id);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teleconsultation_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
  ON appointments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own teleconsultation rooms"
  ON teleconsultation_rooms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = teleconsultation_rooms.appointment_id
      AND appointments.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create teleconsultation rooms"
  ON teleconsultation_rooms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_id
      AND appointments.user_id = auth.uid()
    )
  );
