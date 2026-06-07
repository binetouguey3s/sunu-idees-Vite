# 💡 Sunu-Idées — Standardisation & Clean Code

Boîte à idées numérique, collaborative et anonyme pour la promo P9 de Simplon.  
Refactorisée avec **Vite.js** et une architecture modulaire propre.

---

## Lien déployé

    https://sunu-idees-vite2.vercel.app

---

##  Description

**Sunu-Idées** est une Single Page Application (SPA) permettant à chaque membre de la promo P9 de proposer, afficher, modifier et supprimer des idées anonymement et en temps réel.

Les idées sont automatiquement catégorisées par l'IA d'**OpenRouter** (modèle gratuit), puis stockées dans le cloud via **Supabase**, accessibles par toute la communauté.

---

##  Fonctionnalités

- Catégorisation automatique par IA (OpenRouter)
- Stockage cloud en temps réel (Supabase)
- CRUD complet sans rechargement de page
- Validation et sanitisation des données
- Fallback automatique si l'IA est indisponible
- Indicateur de chargement pendant les appels API
- Design responsive (mobile & desktop)

---

##  Technologies

| Outil | Rôle |
|-------|------|
| HTML5 / CSS3 | Structure et style |
| JavaScript ES6+ | Logique applicative |
| Vite.js | Serveur de dev + compilation |
| Supabase | Base de données cloud |
| OpenRouter (Poolside Laguna free) | Catégorisation IA |
| Vercel | Déploiement + proxy API |

---

##  Architecture

```
sunu-idees-vite/
├── api/
│   └── generate.js         # Proxy Vercel → OpenRouter (clé cachée)
├── src/
│   ├── api/
│   │   ├── supabase.js     # Connexion et opérations Supabase
│   │   └── openrouter.js   # Appel IA + normalisation réponse
│   ├── utils/
│   │   └── validation.js   # Sanitisation et validation formulaire
│   └── main.js             # Orchestrateur principal
├── index.html
├── style.css
├── vite.config.js
├── package.json
├── .env.example            # Variables d'environnement (exemple)
├── .gitignore
└── README.md
```

---

##  Variables d'environnement

`.env`


##  Lancement du projet en local

`npm run dev`

