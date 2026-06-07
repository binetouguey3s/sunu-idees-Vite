// ============================================================
// VALIDATION & SANITISATION des données du formulaire
// ============================================================

// Supprimer les balises HTML dangereuses
export function sanitiser(texte) {
    return texte
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

// Valider les champs du formulaire
export function validerFormulaire(titre, description, categorie) {
    if (titre.length < 3) {
        alert('Le titre doit contenir au moins 3 caractères.');
        return false;
    }
    if (description.length < 8) {
        alert('La description doit contenir au moins 8 caractères.');
        return false;
    }
    if (!categorie) {
        alert('Veuillez choisir une catégorie.');
        return false;
    }
    return true;
}