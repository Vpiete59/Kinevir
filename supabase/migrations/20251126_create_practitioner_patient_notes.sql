-- Table pour les notes privées des praticiens sur leurs patients
CREATE TABLE IF NOT EXISTS practitioner_patient_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(practitioner_id, patient_id)
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_practitioner_patient_notes_practitioner 
ON practitioner_patient_notes(practitioner_id);

CREATE INDEX IF NOT EXISTS idx_practitioner_patient_notes_patient 
ON practitioner_patient_notes(patient_id);

-- RLS (Row Level Security)
ALTER TABLE practitioner_patient_notes ENABLE ROW LEVEL SECURITY;

-- Politique : les praticiens ne peuvent voir/modifier que leurs propres notes
CREATE POLICY "Practitioners can manage their own notes"
ON practitioner_patient_notes
FOR ALL
USING (auth.uid() = practitioner_id)
WITH CHECK (auth.uid() = practitioner_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_practitioner_patient_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS trigger_update_practitioner_patient_notes_updated_at ON practitioner_patient_notes;
CREATE TRIGGER trigger_update_practitioner_patient_notes_updated_at
  BEFORE UPDATE ON practitioner_patient_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_practitioner_patient_notes_updated_at();
