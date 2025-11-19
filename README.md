# Kinevir - Plateforme de Physiothérapie en Ligne 🏥

Plateforme web complète de physiothérapie digitale permettant aux patients de consulter des pathologies, prendre rendez-vous en téléconsultation, et accéder à des exercices thérapeutiques personnalisés.

![Next.js](https://img.shields.io/badge/Next.js-13-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue)

## 🚀 Fonctionnalités

- 🦴 **Squelette anatomique interactif** : Navigation intuitive par région corporelle
- 📚 **Base de données pathologies** : Informations détaillées, symptômes, traitements
- 📅 **Système de rendez-vous** : Prise de téléconsultation en ligne
- 💪 **Programmes d'exercices** : Exercices thérapeutiques personnalisés
- 👨‍⚕️ **Espace praticien** : Gestion des disponibilités et consultations
- 🔐 **Authentification sécurisée** : Gestion des comptes patients et praticiens
- 📱 **Responsive design** : Compatible mobile, tablette et desktop

## 🛠️ Technologies

- **Framework** : Next.js 13 (App Router)
- **Base de données** : Supabase (PostgreSQL)
- **Authentification** : Supabase Auth
- **UI** : Radix UI + Tailwind CSS
- **Langage** : TypeScript
- **Validation** : Zod + React Hook Form
- **Icônes** : Lucide React

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Compte Supabase (gratuit)

## 🔧 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/ton-username/kinevir.git
cd kinevir
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**

Copier le fichier `.env.example` vers `.env.local` :
```bash
cp .env.example .env.local
```

Puis éditer `.env.local` avec vos propres valeurs :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Configurer la base de données Supabase**

Exécuter les migrations SQL dans l'ordre depuis le dashboard Supabase :
```
supabase/migrations/20251027084044_create_auth_profiles.sql
supabase/migrations/20251029075709_create_pathologies_system.sql
supabase/migrations/20251029084626_create_appointments_system.sql
supabase/migrations/20251029084644_create_exercises_wellness_system.sql
supabase/migrations/20251029091438_create_practitioners_and_acts_system.sql
supabase/migrations/20251029091457_create_practitioner_availability_system.sql
supabase/migrations/20251029092941_seed_admin_practitioner_account.sql
supabase/migrations/20251029171746_create_joints_system.sql
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🚀 Déploiement sur Vercel

1. **Créer un compte Vercel** (si pas déjà fait)

2. **Connecter votre repository GitHub**

3. **Configurer les variables d'environnement** dans Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (votre domaine de production)

4. **Déployer** 🎉

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📁 Structure du projet

```
kinevir/
├── app/                      # Pages et routes Next.js 13
│   ├── pathologies/          # Pages pathologies
│   ├── appointment/          # Prise de rendez-vous
│   ├── practitioner/         # Espace praticien
│   ├── api/                  # Routes API
│   └── ...
├── components/               # Composants React
│   ├── pathologies/          # Composants pathologies
│   ├── appointments/         # Composants rendez-vous
│   ├── practitioner/         # Composants praticien
│   ├── seo/                  # Composants SEO
│   └── ui/                   # Composants UI (Radix)
├── lib/                      # Utilitaires et configurations
│   ├── supabase.ts           # Client Supabase
│   ├── types/                # Types TypeScript
│   └── utils/                # Fonctions utilitaires
├── supabase/
│   └── migrations/           # Migrations SQL
└── public/                   # Fichiers statiques
```

## 🔐 Sécurité

- Row Level Security (RLS) activé sur toutes les tables Supabase
- Authentification gérée par Supabase Auth
- Variables d'environnement pour les secrets
- Protection des routes sensibles (praticien, admin)

## 📈 SEO

- ✅ Sitemap.xml dynamique
- ✅ robots.txt configuré
- ✅ Métadonnées Open Graph
- ✅ Twitter Cards
- ✅ Schema.org (données structurées médicales)
- ✅ URLs SEO-friendly
- ✅ Génération statique des pages pathologies

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

**Kinevir Team**

## 🙏 Remerciements

- Next.js team pour le framework
- Supabase pour la solution backend
- Radix UI pour les composants accessibles
- shadcn/ui pour les composants UI
