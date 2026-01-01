import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Créer un client vide si les variables ne sont pas configurées (mode développement)
export const supabase = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') 
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
  console.warn('Supabase non configuré. Variables d\'environnement manquantes ou invalides. Mode développement.');
}
