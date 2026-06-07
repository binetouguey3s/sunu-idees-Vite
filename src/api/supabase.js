// ============================================================
// SUPABASE — Connexion et opérations sur la base de données
// ============================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const client = createClient(supabaseUrl, supabaseAnonKey);

// Récupérer toutes les idées
export async function fetchIdees() {
    const { data, error } = await client
        .from('idees')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Erreur Supabase fetch:', error);
        throw error;
    }

    return data || [];
}

// Ajouter une idée
export async function creerIdee(idee) {
    const { data, error } = await client
        .from('idees')
        .insert([idee])
        .select()
        .single();

    if (error) {
        console.error('Erreur Supabase insert:', error);
        throw error;
    }

    return data;
}

// Modifier une idée
export async function updateIdee(id, modifications) {
    const { data, error } = await client
        .from('idees')
        .update(modifications)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Erreur Supabase update:', error);
        throw error;
    }

    return data;
}

// Supprimer une idée
export async function supprimerIdee(id) {
    const { error } = await client
        .from('idees')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erreur Supabase delete:', error);
        throw error;
    }
}