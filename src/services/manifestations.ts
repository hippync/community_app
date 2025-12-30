import { supabase } from '../lib/supabaseClient';

export interface ManifestationInteret {
  id?: string;
  firstName: string;
  email: string;
  role: string;
  quartier?: string;
  motivation: string;
  created_at?: string;
}

// Rate limiter côté client (stockage en mémoire)
const submissionTracker = new Map<string, number>();

export const manifestationsService = {
  /**
   * Créer une nouvelle manifestation d'intérêt
   * Inclut validation et rate limiting côté client
   */
  async create(data: ManifestationInteret) {
    // 1. Validation des données
    if (!data.firstName?.trim() || data.firstName.trim().length < 2) {
      throw new Error('Le prénom doit contenir au moins 2 caractères');
    }

    if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Adresse courriel invalide');
    }

    if (!data.role) {
      throw new Error('Le rôle est requis');
    }

    if (!data.motivation?.trim() || data.motivation.trim().length < 20) {
      throw new Error('La motivation doit contenir au moins 20 caractères');
    }

    // 2. Rate limiting côté client (1 soumission par minute par email)
    const emailKey = data.email.toLowerCase().trim();
    const now = Date.now();
    const lastSubmission = submissionTracker.get(emailKey);

    if (lastSubmission && now - lastSubmission < 60000) {
      const waitTime = Math.ceil((60000 - (now - lastSubmission)) / 1000);
      throw new Error(`Veuillez attendre ${waitTime} secondes avant de soumettre à nouveau`);
    }

    // 3. Insérer dans Supabase (la contrainte UNIQUE gérera les doublons)
    // Ne pas utiliser .select() car RLS bloque SELECT pour les utilisateurs anonymes
    const { error } = await supabase
      .from('manifestations_interet')
      .insert([
        {
          first_name: data.firstName.trim(),
          email: emailKey,
          role: data.role,
          quartier: data.quartier?.trim() || null,
          motivation: data.motivation.trim(),
        },
      ]);

    if (error) {
      console.error('Erreur Supabase:', error.code, error.message, error.details);
      
      // Vérifier si c'est une erreur de contrainte unique (doublon)
      if (error.code === '23505') {
        throw new Error('EMAIL_DUPLICATE');
      }

      // Autres erreurs
      throw new Error(error.message || 'Erreur lors de l\'enregistrement');
    }

    // 4. Mettre à jour le tracker de soumissions
    submissionTracker.set(emailKey, now);

    return { success: true, email: emailKey };
  },

  /**
   * Vérifier si un email existe déjà
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('manifestations_interet')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return false;
    }

    return !!data;
  },

  /**
   * Obtenir toutes les manifestations (pour l'administration future)
   * Requiert une authentification
   */
  async getAll() {
    const { data, error } = await supabase
      .from('manifestations_interet')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Obtenir les statistiques (utilise la vue SQL)
   */
  async getStats() {
    const { data, error } = await supabase
      .from('manifestations_stats')
      .select('*')
      .single();

    if (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      return null;
    }

    return data;
  },
};
