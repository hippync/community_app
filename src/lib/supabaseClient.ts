import { createClient } from '@supabase/supabase-js';

// Vite exposes environment variables on import.meta.env; we narrow the expected keys here.
interface CollaboroImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface CollaboroImportMeta extends ImportMeta {
  readonly env: CollaboroImportMetaEnv;
}

const env = (import.meta as CollaboroImportMeta).env;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

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
