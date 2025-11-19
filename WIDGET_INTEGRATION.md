# Guide d'intégration du widget Kinevir

Ce guide explique comment intégrer le widget de prise de rendez-vous Kinevir sur votre site web.

## Méthode 1 : Script d'intégration (Recommandée)

### Étape 1 : Ajoutez le conteneur HTML

Ajoutez cet élément là où vous souhaitez afficher le widget :

```html
<div id="kinevir-widget"></div>
```

### Étape 2 : Incluez le script

Ajoutez ce script avant la balise de fermeture `</body>` :

```html
<script src="https://app.kinevir.com/kinevir-widget.js"></script>
<script>
  KinevirWidget.init({
    containerId: 'kinevir-widget',
    width: '100%',
    height: '800px',
    redirectUrl: 'https://votre-site.com/confirmation',
    onAppointmentSelected: function(data) {
      console.log('Rendez-vous sélectionné:', data);
      // Vous pouvez ajouter votre logique personnalisée ici
    }
  });
</script>
```

### Options de configuration

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `containerId` | string | `'kinevir-widget'` | ID de l'élément HTML conteneur |
| `width` | string | `'100%'` | Largeur du widget |
| `height` | string | `'800px'` | Hauteur du widget |
| `redirectUrl` | string | `undefined` | URL de redirection après sélection |
| `onAppointmentSelected` | function | `undefined` | Callback appelé lors de la sélection |

---

## Méthode 2 : iframe directe

Si vous préférez intégrer directement l'iframe :

```html
<iframe
  src="https://app.kinevir.com/widget/appointment"
  width="100%"
  height="800"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
  allowtransparency="true"
  title="Widget de prise de rendez-vous Kinevir"
></iframe>
```

---

## Méthode 3 : Intégration React/Next.js

Pour les applications React ou Next.js :

```jsx
'use client'; // Pour Next.js 13+

import { useEffect } from 'react';

export default function AppointmentWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.kinevir.com/kinevir-widget.js';
    script.async = true;

    script.onload = () => {
      if (window.KinevirWidget) {
        window.KinevirWidget.init({
          containerId: 'kinevir-widget',
          onAppointmentSelected: (data) => {
            console.log('Rendez-vous:', data);
            // Rediriger ou sauvegarder les données
          }
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="kinevir-widget" />;
}
```

---

## Méthode 4 : Intégration WordPress

### Via le plugin Custom HTML

1. Allez dans **Apparence > Widgets**
2. Ajoutez un widget **HTML personnalisé**
3. Collez ce code :

```html
<div id="kinevir-widget"></div>
<script src="https://app.kinevir.com/kinevir-widget.js"></script>
<script>
  KinevirWidget.init({
    containerId: 'kinevir-widget',
    width: '100%',
    height: '800px'
  });
</script>
```

### Via un shortcode personnalisé

Ajoutez ce code dans `functions.php` de votre thème :

```php
function kinevir_appointment_widget() {
    return '
        <div id="kinevir-widget"></div>
        <script src="https://app.kinevir.com/kinevir-widget.js"></script>
        <script>
            KinevirWidget.init({
                containerId: "kinevir-widget",
                width: "100%",
                height: "800px"
            });
        </script>
    ';
}
add_shortcode('kinevir_widget', 'kinevir_appointment_widget');
```

Utilisez ensuite `[kinevir_widget]` dans vos pages ou articles.

---

## Gestion des événements

Le widget émet un événement `KINEVIR_APPOINTMENT_SELECTED` contenant :

```javascript
{
  practitioner: {
    id: string,
    full_name: string,
    specialty: string,
    description: string
  },
  act: {
    id: string,
    title: string,
    description: string,
    duration_minutes: number,
    price_euros: number,
    color: string
  },
  date: string, // ISO 8601
  time: string  // Format HH:MM
}
```

### Exemple de traitement

```javascript
KinevirWidget.init({
  containerId: 'kinevir-widget',
  onAppointmentSelected: function(data) {
    // Envoi vers votre backend
    fetch('/api/save-appointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      console.log('Rendez-vous enregistré:', result);
      // Redirection ou affichage confirmation
      window.location.href = '/confirmation?id=' + result.appointmentId;
    });
  }
});
```

---

## Personnalisation CSS

Le widget hérite des styles de votre site. Pour personnaliser l'apparence :

```css
#kinevir-widget {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

#kinevir-widget iframe {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
```

---

## Support et assistance

Pour toute question ou problème d'intégration :

- Email : support@kinevir.com
- Documentation complète : https://docs.kinevir.com
- Exemples de code : https://github.com/kinevir/widget-examples

---

## Exemple complet pour kinevir.com

Voici un exemple complet à ajouter sur votre page kinevir.com :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prendre rendez-vous - Kinevir</title>
  <style>
    .widget-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
    }
  </style>
</head>
<body>
  <div class="widget-container">
    <h1>Prendre rendez-vous</h1>
    <p>Réservez votre consultation en ligne</p>

    <div id="kinevir-widget"></div>
  </div>

  <script src="https://app.kinevir.com/kinevir-widget.js"></script>
  <script>
    KinevirWidget.init({
      containerId: 'kinevir-widget',
      width: '100%',
      height: '800px',
      redirectUrl: 'https://kinevir.com/confirmation',
      onAppointmentSelected: function(data) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
          gtag('event', 'appointment_selected', {
            'practitioner': data.practitioner.full_name,
            'act_type': data.act.title
          });
        }
      }
    });
  </script>
</body>
</html>
```

---

## Sécurité

- Le widget utilise HTTPS exclusivement
- Communication cross-origin sécurisée via postMessage
- Aucune donnée sensible n'est stockée côté client
- Conformité RGPD : les données sont traitées selon notre politique de confidentialité

---

## Mises à jour

Le widget est automatiquement mis à jour. Aucune action n'est requise de votre part pour bénéficier des nouvelles fonctionnalités et corrections de bugs.

Version actuelle : 1.0.0
