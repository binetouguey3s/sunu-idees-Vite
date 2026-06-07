// ============================================================
// MAIN.JS — Orchestrateur principal
// ============================================================
import { fetchIdees, creerIdee, updateIdee, supprimerIdee } from './api/supabase.js';
import { appelOpenRouter, normaliserCategorie } from './api/openrouter.js';
import { sanitiser, validerFormulaire } from './utils/validation.js';

// ============================================================
// ÉLÉMENTS DOM
// ============================================================
const mur = document.getElementById('mur');
const form = document.getElementById('idee-form');
const inputTitre = document.getElementById('idea-title');
const selectCategorie = document.getElementById('categorie');
const textareaDescription = document.getElementById('description');
const boutonSubmit = form.querySelector('button[type="submit"]');

// ============================================================
// FONCTIONS DOM
// ============================================================
function getCategorieClasse(categorie) {
    switch (categorie) {
        case 'Pedagogie':              return 'cat-pedagogie';
        case 'Evenement':              return 'cat-evenement';
        case 'Vie de campus':          return 'cat-campus';
        case 'Amelioration technique': return 'cat-amelioration';
        default:                       return 'cat-pedagogie';
    }
}

function creerCarte(idee) {
    const carte = document.createElement('div');
    carte.classList.add('carte', getCategorieClasse(idee.categorie));
    carte.setAttribute('data-id', idee.id);

    carte.innerHTML = `
        <span class="categorie-badge">${idee.categorie}</span>
        <h3>${idee.titre}</h3>
        <p>${idee.description}</p>
        <div class="carte-action">
            <button class="btn-modifier"> Modifier</button>
            <button class="btn-supprimer"> Supprimer</button>
        </div>
    `;

    return carte;
}

function afficherIdees(idees) {
    mur.innerHTML = '';

    if (idees.length === 0) {
        mur.innerHTML = '<p style="opacity:0.6;">Aucune idée pour le moment. Sois la première à proposer !</p>';
        return;
    }

    idees.forEach(idee => {
        const carte = creerCarte(idee);
        mur.appendChild(carte);
    });
}

// ============================================================
// GESTION DES ÉVÉNEMENTS
// ============================================================

// ---- Soumission du formulaire ----
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const titre = sanitiser(inputTitre.value.trim());
    const description = sanitiser(textareaDescription.value.trim());
    const categorieSelectionnee = selectCategorie.value;

    if (!validerFormulaire(titre, description, categorieSelectionnee)) return;

    const texteOriginal = boutonSubmit.textContent;
    boutonSubmit.disabled = true;
    boutonSubmit.textContent = '⏳ Analyse IA en cours...';

    try {
        const reponseBrute = await appelOpenRouter(titre, description);
        const categorieIA = normaliserCategorie(reponseBrute);
        const categorieFinale = categorieIA || categorieSelectionnee;

        const ideeEnregistree = await creerIdee({ titre, description, categorie: categorieFinale });
        idees.unshift(ideeEnregistree);
        afficherIdees(idees);
        form.reset();

    } catch (error) {
        console.error('Erreur soumission:', error);

        try {
            const categorieSecours = categorieSelectionnee || 'Amelioration technique';
            const ideeEnregistree = await creerIdee({ titre, description, categorie: categorieSecours });
            idees.unshift(ideeEnregistree);
            afficherIdees(idees);
            form.reset();
            alert(`IA indisponible. Idée enregistrée avec : ${categorieSecours}`);
        } catch (erreurCritique) {
            console.error('Erreur critique:', erreurCritique);
            alert('Impossible d\'enregistrer l\'idée. Vérifie ta connexion.');
        }

    } finally {
        boutonSubmit.disabled = false;
        boutonSubmit.textContent = texteOriginal;
    }
});

// ---- Clics sur le mur ----
mur.addEventListener('click', async function(event) {
    const cible = event.target;
    const carte = cible.closest('.carte');
    if (!carte) return;

    const id = parseInt(carte.getAttribute('data-id'));

    // Supprimer
    if (cible.classList.contains('btn-supprimer')) {
        if (!confirm('Supprimer cette idée définitivement ?')) return;

        try {
            await supprimerIdee(id);
            idees = idees.filter(idee => idee.id !== id);
            afficherIdees(idees);
        } catch (error) {
            alert('Erreur lors de la suppression. Réessaie.');
        }
    }

    // Modifier
    if (cible.classList.contains('btn-modifier')) {
        const idee = idees.find(i => i.id === id);
        if (!idee) return;

        carte.innerHTML = `
            <span class="categorie-badge">${idee.categorie}</span>
            <input type="text" class="edit-titre" value="${idee.titre}">
            <textarea class="edit-description">${idee.description}</textarea>
            <div class="carte-action">
                <button class="btn-sauvegarder" Sauvegarder</button>
                <button class="btn-annuler"> Annuler</button>
            </div>
        `;
    }

    // Sauvegarder
    if (cible.classList.contains('btn-sauvegarder')) {
        const nouveauTitre = sanitiser(carte.querySelector('.edit-titre').value.trim());
        const nouvelleDescription = sanitiser(carte.querySelector('.edit-description').value.trim());

        if (nouveauTitre.length < 3 || nouvelleDescription.length < 8) {
            alert('Titre (min 3 car.) et description (min 10 car.) requis.');
            return;
        }

        try {
            await updateIdee(id, { titre: nouveauTitre, description: nouvelleDescription });
            idees = idees.map(idee =>
                idee.id === id ? { ...idee, titre: nouveauTitre, description: nouvelleDescription } : idee
            );
            afficherIdees(idees);
        } catch (error) {
            alert('Erreur lors de la mise à jour. Réessaie.');
        }
    }

    // Annuler
    if (cible.classList.contains('btn-annuler')) {
        afficherIdees(idees);
    }
});

// ============================================================
// INITIALISATION
// ============================================================
let idees = [];

async function init() {
    mur.innerHTML = '<p style="opacity:0.6;">⏳ Chargement des idées...</p>';
    idees = await fetchIdees();
    afficherIdees(idees);
}

init();