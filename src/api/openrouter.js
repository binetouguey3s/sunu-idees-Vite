// ============================================================
// OPENROUTER — Appel IA + Nettoyage de la réponse
// ============================================================

// Appel au proxy Vercel qui contacte OpenRouter
export async function appelOpenRouter(titre, description) {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titre, description })
    });

    const result = await response.json();

    if (!response.ok || result.error) {
        console.error('Erreur OpenRouter proxy:', result.error);
        return null;
    }

    const data = result.data;
    const texte = data?.choices?.[0]?.message?.content || '';
    return texte.trim();
}

// Nettoyer et normaliser la réponse brute de l'IA
export function normaliserCategorie(texte) {
    if (!texte || typeof texte !== 'string') return null;

    const propre = texte
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .trim()
        .toLowerCase();

    if (/pedagogie|pedago|enseignement|education/.test(propre)) return 'Pedagogie';
    if (/evenement|event|celebration/.test(propre)) return 'Evenement';
    if (/vie de campus|campus|etudiant/.test(propre)) return 'Vie de campus';
    if (/amelioration|technique/.test(propre)) return 'Amelioration technique';

    return null;
}