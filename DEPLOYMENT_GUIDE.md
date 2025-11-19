# 🚀 Guide de Déploiement Rapide - Kinevir

## ✅ Checklist avant déploiement

### 1. Configuration Supabase (10 min)

#### a) Créer un projet Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter les credentials :
   - Project URL : `https://xxxxx.supabase.co`
   - Anon key : `eyJxxx...`
   - Service role key : `eyJxxx...` (dans Settings > API)

#### b) Appliquer les migrations
1. Dans Supabase Dashboard → SQL Editor
2. Exécuter **dans l'ordre** :
   ```sql
   -- 1. Profils
   supabase/migrations/20251027084044_create_auth_profiles.sql
   
   -- 2. Pathologies
   supabase/migrations/20251029075709_create_pathologies_system.sql
   
   -- 3. Rendez-vous
   supabase/migrations/20251029084626_create_appointments_system.sql
   
   -- 4. Exercices
   supabase/migrations/20251029084644_create_exercises_wellness_system.sql
   
   -- 5. Praticiens
   supabase/migrations/20251029091438_create_practitioners_and_acts_system.sql
   
   -- 6. Disponibilités
   supabase/migrations/20251029091457_create_practitioner_availability_system.sql
   
   -- 7. Seed admin
   supabase/migrations/20251029092941_seed_admin_practitioner_account.sql
   
   -- 8. Articulations
   supabase/migrations/20251029171746_create_joints_system.sql
   ```

#### c) Peupler avec des données d'exemple
```sql
-- Exécuter le fichier seed
supabase/seed_pathologies.sql
```

#### d) Vérifier l'authentification
1. Authentication → Settings
2. Activer "Email Auth"
3. Configurer l'URL du site (sera ajoutée après déploiement)

---

### 2. Déploiement Vercel (15 min)

#### Option A : Via GitHub (Recommandé)

**Étape 1 : Créer un repo GitHub**
```bash
# Initialiser git si ce n'est pas déjà fait
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "🚀 Initial commit - Kinevir app"

# Créer la branche main
git branch -M main

# Ajouter le remote (remplacer par votre URL)
git remote add origin https://github.com/VOTRE-USERNAME/kinevir.git

# Push
git push -u origin main
```

**Étape 2 : Déployer sur Vercel**
1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "New Project"
3. Importer depuis GitHub
4. Sélectionner votre repo `kinevir`
5. Configuration :
   - Framework Preset : **Next.js**
   - Root Directory : `./`
   - Build Command : `npm run build`
   - Output Directory : `.next`

**Étape 3 : Variables d'environnement**

Dans Vercel, onglet "Environment Variables", ajouter :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

**Étape 4 : Déployer**
- Cliquer sur "Deploy"
- Attendre 2-3 minutes
- ✅ Votre app est en ligne !

---

#### Option B : Via CLI Vercel

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer (suivre les prompts)
vercel

# Ajouter les variables d'environnement
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Redéployer avec les env vars
vercel --prod
```

---

### 3. Configuration post-déploiement (5 min)

#### a) Configurer l'URL dans Supabase
1. Supabase Dashboard → Authentication → URL Configuration
2. Site URL : `https://votre-app.vercel.app`
3. Redirect URLs : 
   - `https://votre-app.vercel.app/**`
   - `http://localhost:3000/**` (pour dev)

#### b) Créer un compte admin
1. Aller sur votre app : `https://votre-app.vercel.app/login`
2. S'inscrire avec un email
3. Vérifier l'email dans Supabase Dashboard → Authentication → Users
4. Promouvoir en admin (si nécessaire dans la table `profiles`)

#### c) Tester les fonctionnalités
- ✅ Page d'accueil
- ✅ Squelette interactif (`/pathologies`)
- ✅ Détail pathologie
- ✅ Prise de rendez-vous (`/appointment`)
- ✅ Interface praticien (`/practitioner`)

---

## 🔧 Configuration du domaine personnalisé

### Sur Vercel
1. Settings → Domains
2. Ajouter `kinevir.com` et `www.kinevir.com`
3. Suivre les instructions DNS

### Sur votre registrar (OVH, Cloudflare, etc.)
```
Type  | Name  | Value
------|-------|-------------------------
A     | @     | 76.76.21.21
CNAME | www   | cname.vercel-dns.com
```

### Mettre à jour Supabase
- Authentication → URL Configuration
- Site URL : `https://kinevir.com`

---

## 🎯 Vérifications finales

### Performance
```bash
# Tester le build localement
npm run build
npm run start
```

### SEO
- [ ] Métadonnées présentes sur toutes les pages
- [ ] robots.txt créé (prochaine étape)
- [ ] sitemap.xml créé (prochaine étape)

### Sécurité
- [ ] Variables d'environnement jamais dans le code
- [ ] HTTPS activé (automatique avec Vercel)
- [ ] RLS activé sur toutes les tables Supabase

---

## 📊 Monitoring

### Vercel Dashboard
- Analytics : Voir le trafic
- Logs : Déboguer les erreurs
- Deployments : Historique des déploiements

### Supabase Dashboard
- Database : Surveiller les requêtes
- Auth : Voir les inscriptions
- Logs : Déboguer les erreurs API

---

## 🚨 Résolution de problèmes

### L'app ne se lance pas
1. Vérifier les logs Vercel
2. Vérifier que toutes les env vars sont présentes
3. Vérifier le build localement : `npm run build`

### Erreurs Supabase
1. Vérifier que les migrations sont bien appliquées
2. Vérifier les credentials dans les env vars
3. Vérifier les politiques RLS

### Les pathologies n'apparaissent pas
1. Exécuter le script seed : `supabase/seed_pathologies.sql`
2. Vérifier que `published = true`
3. Vérifier les politiques RLS

---

## 🎉 Prochaines étapes

Maintenant que l'app est en ligne, vous pouvez :

1. **SEO** : Ajouter sitemap.xml, robots.txt, métadonnées enrichies
2. **Contenu** : Ajouter plus de pathologies
3. **n8n** : Intégrer le workflow Perplexity + Claude
4. **Analytics** : Ajouter Google Analytics
5. **Monitoring** : Configurer Sentry pour les erreurs

---

## 📞 Support

- 🐛 Bugs : Créer une issue GitHub
- 💬 Questions : Contact via le site
- 📧 Email : support@kinevir.com
