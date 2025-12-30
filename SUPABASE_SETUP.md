# Configuration Supabase pour Covalto

## 🎯 Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte gratuit
3. Cliquez sur "New Project"
4. Remplissez les informations :
   - **Name**: Covalto
   - **Database Password**: (générez un mot de passe fort)
   - **Region**: Montreal (ou le plus proche)
   - **Pricing Plan**: Free

### 2. Créer la table `manifestations_interet`

Dans l'éditeur SQL de Supabase, exécutez ce script :

```sql
-- Créer la table manifestations_interet
CREATE TABLE manifestations_interet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('volunteer', 'nonprofit', 'business')),
  quartier TEXT,
  motivation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer un index sur l'email pour des recherches rapides
CREATE INDEX idx_manifestations_email ON manifestations_interet(email);

-- Créer un index sur la date de création
CREATE INDEX idx_manifestations_created ON manifestations_interet(created_at DESC);
```

### 3. Appliquer la sécurité RLS

**IMPORTANT** : Exécutez le script de sécurité complet :

```bash
# Le fichier supabase_security.sql contient toute la configuration de sécurité
```

Dans Supabase **SQL Editor**, copiez et exécutez le contenu de [supabase_security.sql](supabase_security.sql)

Ce script configure :
- ✅ Row Level Security (RLS)
- ✅ Protection contre les doublons d'email
- ✅ Politiques d'accès appropriées
- ✅ Vue de statistiques
- ✅ Triggers automatiques

### 4. Configurer les variables d'environnement

1. Dans Supabase, allez dans **Project Settings** > **API**
2. Copiez :
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

3. Dans le fichier `.env` à la racine du projet :

```bash
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

**IMPORTANT** : Pas de guillemets autour des valeurs !

### 5. Redémarrer le serveur de développement

```bash
npm run dev
```

## 📊 Structure de la table

| Colonne      | Type      | Description                           |
|--------------|-----------|---------------------------------------|
| id           | UUID      | Identifiant unique (auto-généré)      |
| first_name   | TEXT      | Prénom de la personne                 |
| email        | TEXT      | Courriel (unique)                     |
| role         | TEXT      | volunteer, nonprofit, ou business     |
| quartier     | TEXT      | Quartier (optionnel)                  |
| motivation   | TEXT      | Message de motivation                 |
| created_at   | TIMESTAMP | Date de création (auto)               |
| updated_at   | TIMESTAMP | Date de modification (auto)           |

## 🔒 Sécurité

### Protection active :

✅ **Row Level Security (RLS)** - Politiques d'accès configurées
✅ **Email unique** - Empêche les doublons (contrainte DB + politique RLS)  
✅ **Rate limiting client** - 1 soumission par minute par email
✅ **Validation des données** - Côté client ET serveur
✅ **SQL injection** - Protection automatique via Supabase client
✅ **XSS** - React échappe automatiquement les valeurs

### Politiques RLS actives :

1. **Insertion publique** : Autorisée uniquement si l'email n'existe pas déjà
2. **Lecture** : Réservée aux utilisateurs authentifiés (admin futur)
3. **Mise à jour/Suppression** : Bloquée pour tous

### Comment vérifier la sécurité :

```sql
-- Voir les politiques actives
SELECT * FROM pg_policies WHERE tablename = 'manifestations_interet';

-- Vérifier que RLS est activé
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'manifestations_interet';
```

## 📈 Prochaines étapes

1. **Dashboard admin** : Pour visualiser les manifestations
2. **Notifications** : Email automatique de confirmation
3. **Statistiques** : Tableau de bord avec métriques
4. **Export** : Télécharger les données en CSV
5. **CAPTCHA** : Ajouter hCaptcha ou Turnstile pour bloquer les bots

## 🧪 Tester la sécurité

### Test 1 : Soumission normale
1. Remplissez le formulaire avec un nouvel email
2. ✅ Devrait fonctionner

### Test 2 : Doublon d'email
1. Soumettez avec le même email qu'avant
2. ✅ Devrait afficher "Cette adresse courriel est déjà enregistrée"

### Test 3 : Rate limiting
1. Soumettez un formulaire
2. Essayez immédiatement avec un autre email
3. ✅ Devrait demander d'attendre 60 secondes

### Test 4 : Validation
1. Essayez un prénom de 1 caractère
2. Essayez un email invalide
3. Essayez une motivation < 20 caractères
4. ✅ Toutes devraient être bloquées

## 🆘 Dépannage

### Erreur 42501 (RLS Policy Violation)
- Vérifiez que le script `supabase_security.sql` a été exécuté
- Vérifiez les politiques avec : `SELECT * FROM pg_policies WHERE tablename = 'manifestations_interet'`

### Les données ne s'affichent pas
- Assurez-vous d'être **authentifié** pour lire les données
- Les utilisateurs anonymes ne peuvent qu'insérer, pas lire

### Erreur 23505 (Unique Violation)
- Normal ! L'email existe déjà dans la base
- Le service devrait automatiquement afficher le bon message d'erreur
