# 🔄 Implémentation de la persistance Supabase

Ce guide explique comment activer la sauvegarde en base de données pour les actes et disponibilités des praticiens.

## 📋 Prérequis

✅ Base de données Supabase configurée
✅ Migrations appliquées (tables créées)
✅ Variables d'environnement configurées
✅ Compte praticien lié à un utilisateur

---

## 🎯 Activer la persistance pour les actes

### Étape 1 : Modifier `components/practitioner/acts-manager.tsx`

Remplacez les imports au début du fichier :

```typescript
// AVANT
import { useState } from 'react';

// APRÈS
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';
```

### Étape 2 : Ajouter le chargement depuis Supabase

Remplacez la déclaration de la fonction `ActsManager` :

```typescript
// AVANT
export function ActsManager() {
  const [acts, setActs] = useState<AppointmentAct[]>([
    // ... données de démo ...
  ]);

// APRÈS
export function ActsManager() {
  const { practitionerId } = useAuth();
  const [acts, setActs] = useState<AppointmentAct[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les actes depuis Supabase
  const loadActs = useCallback(async () => {
    if (!practitionerId) return;

    try {
      const { data, error } = await supabase
        .from('appointment_acts')
        .select('*')
        .eq('practitioner_id', practitionerId)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setActs(data || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement des actes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [practitionerId]);

  // Charger les actes au montage du composant
  useEffect(() => {
    loadActs();
  }, [loadActs]);
```

### Étape 3 : Mettre à jour handleSaveAct

Remplacez la fonction `handleSaveAct` :

```typescript
// AVANT
const handleSaveAct = () => {
  // ... logique en mémoire ...
};

// APRÈS
const handleSaveAct = async () => {
  if (!formData.title.trim()) {
    toast.error('Le titre est requis');
    return;
  }

  if (!practitionerId) {
    toast.error('Erreur: praticien non identifié');
    return;
  }

  try {
    if (editingAct) {
      // Mise à jour d'un acte existant
      const { error } = await supabase
        .from('appointment_acts')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingAct.id);

      if (error) throw error;
      toast.success('Acte modifié avec succès');
    } else {
      // Création d'un nouvel acte
      const { error } = await supabase
        .from('appointment_acts')
        .insert({
          practitioner_id: practitionerId,
          ...formData,
          is_active: true,
        });

      if (error) throw error;
      toast.success('Acte créé avec succès');
    }

    // Recharger les actes depuis la base
    await loadActs();
    setIsDialogOpen(false);
  } catch (error: any) {
    toast.error('Erreur lors de la sauvegarde');
    console.error(error);
  }
};
```

### Étape 4 : Mettre à jour handleDeleteAct

Remplacez la fonction `handleDeleteAct` :

```typescript
// AVANT
const handleDeleteAct = (id: string) => {
  setActs(acts.filter((act) => act.id !== id));
  toast.success('Acte supprimé');
};

// APRÈS
const handleDeleteAct = async (id: string) => {
  try {
    // Soft delete : marquer comme inactif
    const { error } = await supabase
      .from('appointment_acts')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    // Retirer de l'affichage local
    setActs(acts.filter((act) => act.id !== id));
    toast.success('Acte supprimé');
  } catch (error: any) {
    toast.error('Erreur lors de la suppression');
    console.error(error);
  }
};
```

### Étape 5 : Ajouter l'état de chargement dans le rendu

Dans le return, ajoutez un indicateur de chargement :

```typescript
<CardContent className="pt-6">
  {loading ? (
    <div className="text-center py-12 text-kinevir-dark-blue/70">
      <p>Chargement des actes...</p>
    </div>
  ) : (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ... reste du code ... */}
      </div>

      {acts.length === 0 && !loading && (
        <div className="text-center py-12 text-kinevir-dark-blue/70">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun acte défini. Créez votre premier acte pour commencer.</p>
        </div>
      )}
    </>
  )}
</CardContent>
```

---

## 🕒 Activer la persistance pour les disponibilités

### Étape 1 : Modifier `components/practitioner/availability-manager.tsx`

Même logique que pour les actes :

```typescript
// Imports
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/auth-provider';

export function AvailabilityManager() {
  const { practitionerId } = useAuth();
  const [loading, setLoading] = useState(true);

  // Charger les disponibilités
  const loadAvailability = useCallback(async () => {
    if (!practitionerId) return;

    try {
      // Charger les créneaux récurrents
      const { data: recurring, error: recurringError } = await supabase
        .from('practitioner_recurring_availability')
        .select('*')
        .eq('practitioner_id', practitionerId)
        .eq('is_active', true)
        .order('day_of_week');

      if (recurringError) throw recurringError;

      // Charger les exceptions
      const { data: exceptions, error: exceptionsError } = await supabase
        .from('practitioner_availability_exceptions')
        .select('*')
        .eq('practitioner_id', practitionerId)
        .gte('exception_date', new Date().toISOString().split('T')[0])
        .order('exception_date');

      if (exceptionsError) throw exceptionsError;

      setRecurringAvailability(recurring || []);
      setExceptions(exceptions || []);
    } catch (error: any) {
      toast.error('Erreur lors du chargement');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [practitionerId]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  // Sauvegarder un créneau récurrent
  const handleAddRecurringSlot = async () => {
    if (!practitionerId) return;

    try {
      const { error } = await supabase
        .from('practitioner_recurring_availability')
        .insert({
          practitioner_id: practitionerId,
          ...newSlot,
          is_active: true,
        });

      if (error) throw error;

      toast.success('Créneau ajouté');
      await loadAvailability();
    } catch (error: any) {
      toast.error('Erreur lors de l\'ajout');
      console.error(error);
    }
  };

  // Supprimer un créneau récurrent
  const handleDeleteRecurring = async (id: string) => {
    try {
      const { error } = await supabase
        .from('practitioner_recurring_availability')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast.success('Créneau supprimé');
      await loadAvailability();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
      console.error(error);
    }
  };

  // Ajouter une exception
  const handleAddException = async () => {
    if (!practitionerId || !newException.exception_date) return;

    try {
      const { error } = await supabase
        .from('practitioner_availability_exceptions')
        .insert({
          practitioner_id: practitionerId,
          ...newException,
        });

      if (error) throw error;

      toast.success('Exception ajoutée');
      await loadAvailability();

      // Réinitialiser le formulaire
      setNewException({
        exception_date: '',
        exception_type: 'unavailable',
        start_time: '',
        end_time: '',
        reason: '',
      });
    } catch (error: any) {
      toast.error('Erreur lors de l\'ajout');
      console.error(error);
    }
  };
}
```

---

## ✅ Vérification de la persistance

### Test 1 : Créer un acte

1. Connectez-vous en tant que praticien
2. Allez dans "Espace Praticien" > "Mes actes"
3. Cliquez sur "Nouvel acte"
4. Remplissez le formulaire et sauvegardez
5. Rafraîchissez la page (F5)
6. ✅ L'acte doit toujours être présent

### Test 2 : Modifier un acte

1. Cliquez sur le bouton "Modifier" d'un acte
2. Changez le titre ou le prix
3. Sauvegardez
4. Rafraîchissez la page
5. ✅ Les modifications doivent être conservées

### Test 3 : Supprimer un acte

1. Cliquez sur le bouton "Supprimer"
2. Rafraîchissez la page
3. ✅ L'acte ne doit plus apparaître

### Test 4 : Vérifier dans Supabase

1. Allez sur supabase.com > Votre projet
2. Allez dans "Table Editor"
3. Sélectionnez la table `appointment_acts`
4. ✅ Vous devez voir vos actes avec `is_active = true`

---

## 🐛 Dépannage

### Erreur : "practitioner_id is null"

**Cause** : Votre utilisateur n'est pas lié à un praticien

**Solution** :
```sql
-- Dans Supabase SQL Editor
UPDATE practitioners
SET user_id = 'VOTRE_USER_ID'
WHERE email = 'votre@email.com';
```

### Erreur : "RLS policy violation"

**Cause** : Les politiques RLS bloquent l'accès

**Solution** : Vérifiez que les politiques existent :
```sql
-- Vérifier les politiques
SELECT * FROM pg_policies
WHERE tablename = 'appointment_acts';
```

Si aucune politique n'existe, exécutez :
```sql
-- Politique pour lire ses propres actes
CREATE POLICY "Practitioners can read own acts"
  ON appointment_acts FOR SELECT
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

-- Politique pour créer des actes
CREATE POLICY "Practitioners can create own acts"
  ON appointment_acts FOR INSERT
  TO authenticated
  WITH CHECK (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );

-- Politique pour modifier ses actes
CREATE POLICY "Practitioners can update own acts"
  ON appointment_acts FOR UPDATE
  TO authenticated
  USING (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    practitioner_id IN (
      SELECT id FROM practitioners WHERE user_id = auth.uid()
    )
  );
```

### Les modifications ne se sauvegardent pas

**Checklist** :
- [ ] Vérifiez que `practitionerId` n'est pas null dans useAuth
- [ ] Vérifiez la console (F12) pour des erreurs
- [ ] Vérifiez que les politiques RLS sont correctes
- [ ] Testez directement dans Supabase SQL Editor :
  ```sql
  SELECT * FROM appointment_acts WHERE practitioner_id = 'VOTRE_PRACTITIONER_ID';
  ```

---

## 📊 Monitoring et logs

### Activer les logs Supabase

Ajoutez dans votre code :

```typescript
// Voir toutes les requêtes
supabase.channel('any').on('*', (payload) => {
  console.log('Supabase event:', payload);
}).subscribe();
```

### Logs utiles dans les fonctions

```typescript
const handleSaveAct = async () => {
  console.log('Saving act with practitionerId:', practitionerId);
  console.log('Form data:', formData);

  try {
    const result = await supabase.from('appointment_acts').insert(...);
    console.log('Insert result:', result);
  } catch (error) {
    console.error('Full error:', error);
  }
};
```

---

## 🎉 C'est terminé !

Votre application sauvegarde maintenant toutes les modifications en base de données Supabase.

**Prochaines étapes** :
1. Implémenter la même logique pour les autres gestionnaires
2. Ajouter des validations côté serveur (Edge Functions)
3. Implémenter un système de backup automatique
4. Ajouter des webhooks pour les notifications

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Hooks with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-react)
