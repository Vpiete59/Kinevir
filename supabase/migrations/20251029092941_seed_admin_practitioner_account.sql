/*
  # Seed Admin and Practitioner Account

  1. Purpose
    - Create admin practitioner account for virgile.pieterwas@gmail.com
    - Set up practitioner profile
    - Add sample acts and availability

  2. Important Notes
    - This migration is idempotent (can run multiple times safely)
    - User creation via auth.users is handled by Supabase Auth
    - We only create the practitioner profile and related data
    - Email must be verified manually in Supabase Auth dashboard

  3. Manual Steps Required
    After running this migration:
    1. Go to Supabase Dashboard > Authentication > Users
    2. Create user with email: virgile.pieterwas@gmail.com
    3. Copy the user_id
    4. Update the practitioner record with the correct user_id:
       UPDATE practitioners 
       SET user_id = 'YOUR_USER_ID_HERE' 
       WHERE full_name = 'Virgile Pieter was';
*/

DO $$
DECLARE
  v_practitioner_id uuid;
BEGIN
  INSERT INTO practitioners (
    id,
    user_id,
    full_name,
    specialty,
    description,
    photo_url,
    is_active
  ) VALUES (
    gen_random_uuid(),
    NULL,
    'Virgile Pieterwas',
    'Kinésithérapeute diplômé d''État',
    'Praticien expérimenté spécialisé en rééducation fonctionnelle et thérapie manuelle. Approche personnalisée et basée sur l''evidence-based practice.',
    NULL,
    true
  )
  ON CONFLICT (user_id) DO NOTHING
  RETURNING id INTO v_practitioner_id;

  IF v_practitioner_id IS NOT NULL THEN
    INSERT INTO appointment_acts (
      practitioner_id,
      title,
      description,
      duration_minutes,
      price_euros,
      color,
      is_first_consultation,
      is_active
    ) VALUES
    (
      v_practitioner_id,
      'Première consultation / Bilan complet',
      'Évaluation complète de votre condition avec tests cliniques, élaboration d''un diagnostic kinésithérapique et mise en place d''un plan de traitement personnalisé.',
      60,
      70.00,
      '#219ebc',
      true,
      true
    ),
    (
      v_practitioner_id,
      'Séance de rééducation',
      'Séance de physiothérapie classique incluant techniques manuelles, exercices thérapeutiques et conseils personnalisés.',
      40,
      50.00,
      '#8ecae6',
      false,
      true
    ),
    (
      v_practitioner_id,
      'Thérapie manuelle avancée',
      'Techniques de mobilisation articulaire, manipulation et thérapie des tissus mous pour optimiser la récupération.',
      50,
      60.00,
      '#023047',
      false,
      true
    ),
    (
      v_practitioner_id,
      'Rééducation post-opératoire',
      'Programme spécialisé de rééducation après chirurgie orthopédique pour retrouver mobilité et fonction.',
      45,
      55.00,
      '#ffb703',
      false,
      true
    );

    INSERT INTO practitioner_recurring_availability (
      practitioner_id,
      day_of_week,
      start_time,
      end_time,
      is_active
    ) VALUES
    (v_practitioner_id, 1, '09:00', '12:00', true),
    (v_practitioner_id, 1, '14:00', '18:00', true),
    (v_practitioner_id, 2, '09:00', '12:00', true),
    (v_practitioner_id, 2, '14:00', '18:00', true),
    (v_practitioner_id, 3, '09:00', '12:00', true),
    (v_practitioner_id, 3, '14:00', '18:00', true),
    (v_practitioner_id, 4, '09:00', '12:00', true),
    (v_practitioner_id, 4, '14:00', '18:00', true),
    (v_practitioner_id, 5, '09:00', '12:00', true),
    (v_practitioner_id, 5, '14:00', '17:00', true);
  END IF;
END $$;
