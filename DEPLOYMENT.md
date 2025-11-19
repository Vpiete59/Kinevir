# 🚀 Guide de Déploiement Kinevir

Ce guide vous accompagne pas à pas pour déployer Kinevir sur Vercel.

## Prérequis

- [ ] Compte GitHub
- [ ] Compte Vercel (gratuit)
- [ ] Projet Supabase créé et migrations exécutées

## Étape 1 : Préparer le repository GitHub

### 1.1 Créer un repository sur GitHub

1. Aller sur [github.com/new](https://github.com/new)
2. Nom du repository : `kinevir` (ou autre nom de votre choix)
3. Description : "Plateforme de physiothérapie en ligne"
4. **Public** ou **Private** (votre choix)
5. **NE PAS** cocher "Add README" (on en a déjà un)
6. Cliquer sur "Create repository"

### 1.2 Pousser votre code sur GitHub

Dans le terminal, depuis le dossier de votre projet :

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit - Kinevir platform"

# Lier au repository distant (remplacer YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/kinevir.git

# Pousser le code
git branch -M main
git push -u origin main
```

✅ Votre code est maintenant sur GitHub !

## Étape 2 : Configurer Vercel

### 2.1 Créer un compte Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur "Sign Up"
3. **Se connecter avec GitHub** (recommandé)
4. Autoriser Vercel à accéder à vos repositories

### 2.2 Importer le projet

1. Dans le dashboard Vercel, cliquer sur **"Add New..."** → **"Project"**
2. Sélectionner votre repository `kinevir`
3. Cliquer sur **"Import"**

### 2.3 Configurer le projet

**Framework Preset** : Next.js (détecté automatiquement)

**Root Directory** : . (laisser vide)

**Build and Output Settings** : 
- Laisser par défaut
- Build Command: `next build`
- Output Directory: `.next`

### 2.4 Configurer les variables d'environnement

⚠️ **CRITIQUE** : Ajouter ces variables avant de déployer

Cliquer sur **"Environment Variables"** et ajouter :

| Name | Value | Source |
|------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xbdinzcidvfgqeemsgyj.supabase.co` | Votre dashboard Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` (votre clé) | Votre dashboard Supabase |
| `NEXT_PUBLIC_SITE_URL` | `https://votre-domaine.vercel.app` | Sera fourni par Vercel |

**💡 Astuce** : Pour `NEXT_PUBLIC_SITE_URL`, vous pouvez d'abord déployer sans, puis revenir l'ajouter après avoir obtenu votre URL Vercel.

### 2.5 Déployer !

1. Cliquer sur **"Deploy"**
2. Attendre 2-3 minutes ⏳
3. 🎉 Votre site est en ligne !

## Étape 3 : Configuration post-déploiement

### 3.1 Mettre à jour NEXT_PUBLIC_SITE_URL

1. Copier l'URL fournie par Vercel (ex: `https://kinevir.vercel.app`)
2. Aller dans **Settings** → **Environment Variables**
3. Ajouter/Modifier `NEXT_PUBLIC_SITE_URL` avec cette URL
4. **Redéployer** : Settings → Deployments → "Redeploy"

### 3.2 Configurer un domaine personnalisé (optionnel)

1. Aller dans **Settings** → **Domains**
2. Ajouter votre domaine (ex: `kinevir.com`)
3. Suivre les instructions DNS de Vercel
4. Attendre la propagation DNS (15-30 min)

### 3.3 Mettre à jour Supabase

Dans votre dashboard Supabase :

1. Aller dans **Authentication** → **URL Configuration**
2. Ajouter votre URL Vercel dans **Site URL**
3. Ajouter dans **Redirect URLs** :
   - `https://votre-domaine.vercel.app/auth/callback`
   - `https://votre-domaine.com/auth/callback` (si domaine custom)

## Étape 4 : Vérifications

### ✅ Checklist de vérification

- [ ] Le site se charge correctement
- [ ] La page d'accueil s'affiche
- [ ] Les pathologies sont visibles (si données en BDD)
- [ ] Le squelette interactif fonctionne
- [ ] L'authentification fonctionne
- [ ] Les formulaires de rendez-vous fonctionnent
- [ ] Le sitemap est accessible : `votresite.com/sitemap.xml`
- [ ] Le robots.txt est accessible : `votresite.com/robots.txt`

### 🐛 Problèmes courants

#### Le site ne se charge pas
- Vérifier les variables d'environnement dans Vercel
- Regarder les logs dans Vercel → Deployments → View Function Logs

#### Erreurs Supabase
- Vérifier que les migrations sont bien exécutées
- Vérifier les URLs de callback dans Supabase
- Vérifier les clés API dans les variables d'environnement

#### 404 sur les pages pathologies
- Vérifier qu'il y a des pathologies publiées en BDD
- Tester `generateStaticParams` en local

## Étape 5 : Optimisations

### 5.1 Google Search Console

1. Aller sur [search.google.com/search-console](https://search.google.com/search-console)
2. Ajouter votre propriété
3. Vérifier avec le meta tag fourni
4. Soumettre votre sitemap : `https://votresite.com/sitemap.xml`

### 5.2 Analytics (optionnel)

Ajouter Google Analytics ou Plausible pour suivre le trafic.

### 5.3 Monitoring

Vercel fournit du monitoring intégré :
- Analytics
- Speed Insights
- Logs en temps réel

## 🎯 Prochaines étapes

1. **Contenu** : Ajouter des pathologies dans Supabase
2. **SEO** : Soumettre le sitemap à Google
3. **Monitoring** : Surveiller les performances
4. **Marketing** : Partager sur les réseaux sociaux

## 📞 Support

En cas de problème :
- Consulter la [documentation Vercel](https://vercel.com/docs)
- Consulter la [documentation Supabase](https://supabase.com/docs)
- Vérifier les logs de déploiement

---

**Félicitations ! 🎉** Votre plateforme Kinevir est maintenant en ligne !
