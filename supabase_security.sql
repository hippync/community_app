-- ========================================
-- SCRIPT COMPLET SUPABASE - VERSION FONCTIONNELLE
-- Création de la table SANS RLS (pour éviter les erreurs 401)
-- ========================================

-- ÉTAPE 1 : Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS manifestations_interet (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('volunteer', 'nonprofit', 'business')),
  quartier TEXT,
  motivation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÉTAPE 2 : Créer les index pour performance
CREATE INDEX IF NOT EXISTS idx_manifestations_email ON manifestations_interet(email);
CREATE INDEX IF NOT EXISTS idx_manifestations_created ON manifestations_interet(created_at DESC);

-- ÉTAPE 3 : Désactiver RLS (configuration fonctionnelle actuelle)
ALTER TABLE manifestations_interet DISABLE ROW LEVEL SECURITY;

-- ÉTAPE 4 : Supprimer toutes les politiques (pas nécessaires sans RLS)
DROP POLICY IF EXISTS "allow_public_insert" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_authenticated_select" ON manifestations_interet;
DROP POLICY IF EXISTS "Allow public insert" ON manifestations_interet;
DROP POLICY IF EXISTS "Allow authenticated read" ON manifestations_interet;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON manifestations_interet;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_anon_insert" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_auth_select" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_public_insert_with_unique_email" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_authenticated_read_all" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_insert_for_all" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_anon_public_insert" ON manifestations_interet;
DROP POLICY IF EXISTS "allow_all_insert" ON manifestations_interet;

-- ÉTAPE 6 : Politique de lecture pour les utilisateurs authentifiés uniquement
CREATE POLICY "allow_authenticated_read_all"
ON manifestations_interet
FOR SELECT
TO authenticated
USING (true);

-- ÉTAPE 7 : Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ÉTAPE 8 : Trigger pour updated_at
DROP TRIGGER IF EXISTS update_manifestations_updated_at ON manifestations_interet;
CREATE TRIGGER update_manifestations_updated_at
  BEFORE UPDATE ON manifestations_interet
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ÉTAPE 9 : Créer une vue pour les statistiques
CREATE OR REPLACE VIEW manifestations_stats AS
SELECT 
  COUNT(*) as total,
  COUNT(DISTINCT role) as roles_count,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as last_week,
  COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as last_month
FROM manifestations_interet;

-- ÉTAPE 10 : Vérification de la configuration
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename = 'manifestations_interet';

-- ÉTAPE 11 : Afficher les politiques actives
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'manifestations_interet';
