-- Seed script pour peupler la base de données avec des pathologies d'exemple
-- À exécuter dans Supabase SQL Editor

-- Insertion de pathologies d'exemple pour l'épaule
INSERT INTO pathologies (
  region_id,
  name,
  slug,
  short_description,
  detailed_description,
  symptoms,
  causes,
  treatments,
  exercises,
  prevention_tips,
  severity,
  published
)
SELECT
  (SELECT id FROM body_regions WHERE name = 'shoulder'),
  'Tendinite de la coiffe des rotateurs',
  'tendinite-coiffe-rotateurs',
  'Inflammation des tendons qui entourent l''articulation de l''épaule',
  'La tendinite de la coiffe des rotateurs est une inflammation douloureuse des tendons qui connectent les muscles de l''épaule à l''os du bras. Elle est souvent causée par des mouvements répétitifs ou une surutilisation.',
  '["Douleur à l''épaule, surtout la nuit", "Difficulté à lever le bras", "Faiblesse musculaire", "Craquements lors des mouvements"]'::jsonb,
  '["Mouvements répétitifs au-dessus de la tête", "Vieillissement naturel", "Mauvaise posture", "Traumatisme direct"]'::jsonb,
  '["Repos relatif", "Glace (15-20 min, 3-4 fois/jour)", "Anti-inflammatoires", "Kinésithérapie", "Infiltrations si nécessaire"]'::jsonb,
  '["Pendule de Codman", "Rotation externe avec élastique", "Élévation progressive", "Renforcement de la coiffe"]'::jsonb,
  '["Échauffement avant l''activité physique", "Éviter les mouvements répétitifs prolongés", "Renforcer les muscles de l''épaule", "Maintenir une bonne posture"]'::jsonb,
  'moderate',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM pathologies WHERE slug = 'tendinite-coiffe-rotateurs'
);

-- Pathologie pour le genou
INSERT INTO pathologies (
  region_id,
  name,
  slug,
  short_description,
  detailed_description,
  symptoms,
  causes,
  treatments,
  exercises,
  prevention_tips,
  severity,
  published
)
SELECT
  (SELECT id FROM body_regions WHERE name = 'knee'),
  'Syndrome rotulien',
  'syndrome-rotulien',
  'Douleur antérieure du genou liée à la rotule',
  'Le syndrome rotulien, aussi appelé syndrome fémoro-patellaire, est une douleur située à l''avant du genou autour de la rotule. C''est l''une des pathologies les plus fréquentes du genou, particulièrement chez les sportifs.',
  '["Douleur devant le genou", "Gêne en descente d''escaliers", "Douleur en position assise prolongée", "Craquements du genou"]'::jsonb,
  '["Déséquilibre musculaire", "Surutilisation", "Mauvais alignement de la rotule", "Faiblesse du quadriceps"]'::jsonb,
  '["Repos sportif adapté", "Renforcement musculaire ciblé", "Correction de la technique sportive", "Semelles orthopédiques si nécessaire"]'::jsonb,
  '["Renforcement du quadriceps", "Étirements des ischio-jambiers", "Travail proprioceptif", "Gainage"]'::jsonb,
  '["Renforcement musculaire régulier", "Échauffement adapté", "Chaussures appropriées", "Augmentation progressive de l''intensité"]'::jsonb,
  'mild',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM pathologies WHERE slug = 'syndrome-rotulien'
);

-- Pathologie pour le dos (lombaire)
INSERT INTO pathologies (
  region_id,
  name,
  slug,
  short_description,
  detailed_description,
  symptoms,
  causes,
  treatments,
  exercises,
  prevention_tips,
  severity,
  published
)
SELECT
  (SELECT id FROM body_regions WHERE name = 'spine_lumbar'),
  'Lombalgie commune',
  'lombalgie-commune',
  'Douleur au bas du dos sans cause spécifique identifiable',
  'La lombalgie commune, aussi appelée "tour de reins", est une douleur située au niveau des vertèbres lombaires. C''est l''un des motifs de consultation les plus fréquents en kinésithérapie.',
  '["Douleur au bas du dos", "Raideur matinale", "Difficulté à se pencher", "Douleur en position assise ou debout prolongée"]'::jsonb,
  '["Mauvaise posture", "Sédentarité", "Port de charges lourdes", "Stress", "Manque d''activité physique"]'::jsonb,
  '["Maintien de l''activité physique adaptée", "Antalgiques si nécessaire", "Kinésithérapie", "Chaleur locale", "Gestion du stress"]'::jsonb,
  '["Étirements du dos et des membres inférieurs", "Renforcement des abdominaux", "Gainage", "Exercices de mobilité du bassin"]'::jsonb,
  '["Activité physique régulière", "Bonne ergonomie au travail", "Techniques de port de charges", "Gestion du poids", "Renforcement musculaire"]'::jsonb,
  'moderate',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM pathologies WHERE slug = 'lombalgie-commune'
);

-- Pathologie pour le coude
INSERT INTO pathologies (
  region_id,
  name,
  slug,
  short_description,
  detailed_description,
  symptoms,
  causes,
  treatments,
  exercises,
  prevention_tips,
  severity,
  published
)
SELECT
  (SELECT id FROM body_regions WHERE name = 'elbow'),
  'Épicondylite (Tennis Elbow)',
  'epicondylite',
  'Inflammation des tendons de l''avant-bras au niveau du coude',
  'L''épicondylite latérale, communément appelée "tennis elbow", est une inflammation des tendons qui s''attachent sur la face externe du coude. Malgré son nom, elle touche aussi les non-sportifs.',
  '["Douleur au coude externe", "Douleur lors de la préhension", "Faiblesse de la main", "Douleur en serrant la main"]'::jsonb,
  '["Mouvements répétitifs du poignet", "Mauvaise technique sportive", "Utilisation intensive de la souris", "Travaux manuels répétitifs"]'::jsonb,
  '["Repos de l''activité causale", "Glace", "Kinésithérapie", "Orthèse de repos", "Ondes de choc si chronique"]'::jsonb,
  '["Étirements des extenseurs du poignet", "Renforcement progressif", "Massage transversal profond", "Exercices excentriques"]'::jsonb,
  '["Échauffement avant l''activité", "Pause régulière lors de gestes répétitifs", "Ergonomie du poste de travail", "Technique sportive adaptée"]'::jsonb,
  'moderate',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM pathologies WHERE slug = 'epicondylite'
);

-- Pathologie pour la cheville
INSERT INTO pathologies (
  region_id,
  name,
  slug,
  short_description,
  detailed_description,
  symptoms,
  causes,
  treatments,
  exercises,
  prevention_tips,
  severity,
  published
)
SELECT
  (SELECT id FROM body_regions WHERE name = 'ankle'),
  'Entorse de cheville',
  'entorse-cheville',
  'Lésion des ligaments de la cheville suite à un traumatisme',
  'L''entorse de cheville est une blessure des ligaments qui stabilisent l''articulation. Elle survient généralement lors d''un mouvement de torsion du pied. C''est l''une des blessures sportives les plus fréquentes.',
  '["Douleur immédiate", "Gonflement rapide", "Ecchymose", "Difficulté à poser le pied au sol", "Instabilité"]'::jsonb,
  '["Torsion du pied", "Réception de saut", "Marche sur terrain irrégulier", "Chaussures inadaptées"]'::jsonb,
  '["Protocole RICE (repos, glace, compression, élévation)", "Immobilisation selon gravité", "Rééducation proprioceptive", "Reprise progressive de l''appui"]'::jsonb,
  '["Travail de la proprioception", "Renforcement des muscles fibulaires", "Mobilisation de la cheville", "Exercices d''équilibre"]'::jsonb,
  '["Échauffement adapté", "Renforcement musculaire", "Chaussures adaptées", "Strapping préventif si antécédent"]'::jsonb,
  'moderate',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM pathologies WHERE slug = 'entorse-cheville'
);

-- Pathologie cervicale
INSERT INTO pathologies (
  region_id,
  name,
  slug,
  short_description,
  detailed_description,
  symptoms,
  causes,
  treatments,
  exercises,
  prevention_tips,
  severity,
  published
)
SELECT
  (SELECT id FROM body_regions WHERE name = 'spine_cervical'),
  'Cervicalgie (Douleur cervicale)',
  'cervicalgie',
  'Douleur au niveau du cou et de la nuque',
  'La cervicalgie est une douleur localisée au niveau du rachis cervical (cou). Elle peut être aiguë ou chronique et est souvent liée à des tensions musculaires ou une mauvaise posture.',
  '["Douleur et raideur du cou", "Limitation des mouvements", "Maux de tête", "Douleur irradiant vers l''épaule"]'::jsonb,
  '["Mauvaise posture (écrans)", "Stress et tensions musculaires", "Traumatisme (coup du lapin)", "Arthrose cervicale"]'::jsonb,
  '["Chaleur locale", "Mobilisation douce", "Massage", "Correction posturale", "Gestion du stress"]'::jsonb,
  '["Étirements cervicaux doux", "Renforcement des muscles profonds du cou", "Mobilisation en rotation", "Auto-massage"]'::jsonb,
  '["Ergonomie du poste de travail", "Pauses régulières devant l''écran", "Oreiller adapté", "Gestion du stress"]'::jsonb,
  'mild',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM pathologies WHERE slug = 'cervicalgie'
);

-- Vérification
SELECT 
  p.name,
  p.slug,
  br.display_name as region,
  p.severity,
  p.published
FROM pathologies p
LEFT JOIN body_regions br ON p.region_id = br.id
ORDER BY br.display_name, p.name;
