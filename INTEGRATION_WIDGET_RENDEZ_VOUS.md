# 📅 Intégration du Widget Rendez-vous sur Kinevir.com

Ce guide vous explique comment intégrer le système de prise de rendez-vous dans votre site kinevir.com.

## 🎯 Options d'intégration

Vous avez **3 options** pour intégrer le système de rendez-vous :

### Option 1 : Lien direct (Le plus simple) ⭐ RECOMMANDÉ

Ajoutez simplement un lien vers la page de rendez-vous :

```html
<a href="https://votre-app.vercel.app/appointment" class="btn btn-primary">
  Prendre rendez-vous
</a>
```

**Avantages** :
- ✅ Aucun code à intégrer
- ✅ Fonctionne immédiatement
- ✅ Mises à jour automatiques
- ✅ Meilleure performance

**Inconvénient** :
- ❌ L'utilisateur quitte kinevir.com temporairement

---

### Option 2 : iFrame intégré

Intégrez la page directement dans votre site :

```html
<iframe
  src="https://votre-app.vercel.app/widget/appointment"
  width="100%"
  height="800"
  frameborder="0"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
  title="Prendre rendez-vous"
></iframe>
```

**Configuration responsive** :

```html
<div style="position: relative; padding-bottom: 80%; height: 0; overflow: hidden;">
  <iframe
    src="https://votre-app.vercel.app/widget/appointment"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 12px;"
    title="Prendre rendez-vous"
  ></iframe>
</div>
```

**Avantages** :
- ✅ L'utilisateur reste sur kinevir.com
- ✅ Intégration visuelle dans votre design

**Inconvénients** :
- ❌ Nécessite un espace fixe sur la page
- ❌ Peut avoir des problèmes de hauteur

---

### Option 3 : Modal/Popup avec script JavaScript

Affichez le widget dans une modale élégante :

#### Étape 1 : Ajoutez le script dans `<head>`

```html
<script src="https://votre-app.vercel.app/kinevir-widget.js"></script>
```

#### Étape 2 : Ajoutez un bouton

```html
<button onclick="KinevirWidget.open()">
  📅 Prendre rendez-vous
</button>
```

#### Exemple complet avec style :

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://votre-app.vercel.app/kinevir-widget.js"></script>
  <style>
    .btn-appointment {
      background: linear-gradient(135deg, #fb8500, #ffb703);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(251, 133, 0, 0.3);
      transition: all 0.3s ease;
    }

    .btn-appointment:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(251, 133, 0, 0.4);
    }
  </style>
</head>
<body>
  <button class="btn-appointment" onclick="KinevirWidget.open()">
    📅 Prendre rendez-vous
  </button>
</body>
</html>
```

**Options avancées** :

```javascript
// Ouvrir avec un praticien spécifique
KinevirWidget.open({ practitionerId: 'abc123' });

// Ouvrir en mode urgence
KinevirWidget.open({ emergency: true });

// Fermer programmatiquement
KinevirWidget.close();

// Événements
KinevirWidget.on('appointment:created', (data) => {
  console.log('Rendez-vous créé:', data);
});
```

**Avantages** :
- ✅ Meilleure expérience utilisateur
- ✅ L'utilisateur reste sur kinevir.com
- ✅ Modale élégante et moderne
- ✅ Options de personnalisation

**Inconvénient** :
- ❌ Nécessite un peu de JavaScript

---

## 🎨 Exemples d'intégration sur Kinevir.com

### Dans la page d'accueil

```html
<!-- Hero Section -->
<section class="hero">
  <h1>Votre santé, notre priorité</h1>
  <p>Prenez rendez-vous en quelques clics</p>

  <!-- Option 1: Lien direct -->
  <a href="https://votre-app.vercel.app/appointment" class="btn-hero">
    📅 Prendre rendez-vous
  </a>

  <!-- OU Option 3: Modal -->
  <button class="btn-hero" onclick="KinevirWidget.open()">
    📅 Prendre rendez-vous
  </button>
</section>
```

### Dans la navigation

```html
<nav>
  <ul>
    <li><a href="/">Accueil</a></li>
    <li><a href="/pathologies">Pathologies</a></li>
    <li><a href="/about">À propos</a></li>
    <li>
      <a href="https://votre-app.vercel.app/appointment" class="nav-cta">
        Rendez-vous
      </a>
    </li>
  </ul>
</nav>
```

### Page dédiée

Créez une page `/rendez-vous.html` avec l'iframe :

```html
<!DOCTYPE html>
<html>
<head>
  <title>Prendre rendez-vous - Kinevir</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #f8f9fa;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #219ebc;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📅 Prendre rendez-vous</h1>

    <iframe
      src="https://votre-app.vercel.app/widget/appointment"
      width="100%"
      height="900"
      frameborder="0"
      style="border: none; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
    ></iframe>
  </div>
</body>
</html>
```

---

## 📝 Configuration requise

### Variables d'environnement

Si vous hébergez l'application, assurez-vous d'avoir :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_publique
```

### Base de données Supabase

Les tables suivantes doivent être créées (déjà fait si vous avez appliqué les migrations) :

- ✅ `practitioners` - Liste des praticiens
- ✅ `appointment_acts` - Types de consultations
- ✅ `practitioner_recurring_availability` - Disponibilités récurrentes
- ✅ `practitioner_availability_exceptions` - Exceptions (congés, etc.)
- ✅ `appointments` - Rendez-vous créés

---

## 🚀 Déploiement

### 1. Déployer sur Vercel (gratuit)

```bash
# Dans le dossier du projet
vercel
```

Suivez les instructions. Vous obtiendrez une URL comme :
`https://kinevir-app.vercel.app`

### 2. Configurer le domaine personnalisé (optionnel)

Dans Vercel Dashboard :
1. Allez dans Settings > Domains
2. Ajoutez `app.kinevir.com` ou `rendez-vous.kinevir.com`
3. Configurez les DNS selon les instructions

### 3. Remplacer les URLs

Partout où vous voyez `https://votre-app.vercel.app`, remplacez par votre URL réelle.

---

## 🎨 Personnalisation visuelle

### Couleurs Kinevir

Le widget utilise déjà les couleurs de votre charte graphique :

```css
--kinevir-orange: #fb8500      /* CTA principal */
--kinevir-yellow: #ffb703      /* Accents */
--kinevir-blue: #219ebc        /* Titres */
--kinevir-dark-blue: #023047   /* Textes */
--kinevir-light-blue: #8ecae6  /* Fond clair */
```

### Adapter le style de l'iframe

Pour mieux intégrer l'iframe dans votre design :

```html
<style>
  .appointment-widget {
    border: 2px solid #219ebc;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(33, 158, 188, 0.15);
    background: white;
  }
</style>

<div class="appointment-widget">
  <iframe src="https://votre-app.vercel.app/widget/appointment" ...></iframe>
</div>
```

---

## ✅ Checklist d'intégration

- [ ] Choisir la méthode d'intégration (Lien direct, iFrame, ou Modal)
- [ ] Déployer l'application sur Vercel
- [ ] Noter l'URL de déploiement
- [ ] Remplacer `https://votre-app.vercel.app` par votre URL
- [ ] Tester la prise de rendez-vous
- [ ] Vérifier l'affichage sur mobile
- [ ] Configurer Google Analytics (optionnel)
- [ ] Ajouter le lien dans la navigation de kinevir.com

---

## 🆘 Aide et support

### Problèmes courants

**L'iframe ne s'affiche pas** :
- Vérifiez que l'URL est correcte
- Assurez-vous qu'il n'y a pas de bloqueur de contenu
- Testez dans un autre navigateur

**La hauteur de l'iframe est incorrecte** :
- Utilisez une hauteur fixe comme `800px` ou `900px`
- Ou utilisez la version responsive avec `padding-bottom`

**Le widget JavaScript ne fonctionne pas** :
- Vérifiez que le script est bien chargé (Console F12)
- Assurez-vous que l'URL du script est correcte
- Testez avec la console JavaScript ouverte

### Support technique

Pour toute question :
1. Vérifiez les logs dans la Console (F12)
2. Testez l'URL directement dans le navigateur
3. Contactez l'équipe technique

---

## 📊 Suivi Analytics

### Avec Google Analytics

```html
<!-- Ajoutez dans <head> de votre site -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Événements à tracker

```javascript
// Lien direct
<a href="..." onclick="gtag('event', 'click', {
  'event_category': 'appointment',
  'event_label': 'hero_button'
});">Prendre RDV</a>

// Modal
KinevirWidget.on('appointment:created', (data) => {
  gtag('event', 'appointment_created', {
    'event_category': 'conversion',
    'value': data.price
  });
});
```

---

## 🎉 C'est terminé !

Votre système de prise de rendez-vous est maintenant intégré à kinevir.com.

**Recommandation** : Commencez avec l'**Option 1 (Lien direct)** pour tester, puis passez à l'**Option 3 (Modal)** pour une meilleure expérience utilisateur.
