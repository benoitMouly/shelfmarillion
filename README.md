# shelfmarillion

Exercice technique réalisé dans le cadre d'une demande de la direction d'attineos

---

## Objectif

Créer une application React de gestion d'une bibliothèque de livres personnelle :

- Recherche de livres via l'API [Gutendex](https://gutendex.com/) et ajout à la bibliothèque
- Listing, filtrage (lu / non lu) et recherche dans la bibliothèque
- Persistance en `localStorage` (front only, pas de backend)

---

## Stack

React 19 · TypeScript 5 · Vite · Tailwind CSS 4 · Zod · Vitest

Ressources utilisées: 
Claude Sonnet a été utilisé pour:
- le design, theme.css rajouté pour le modifier facilement via tailwind
- audit accessbilité en complément d'extensions Chrome
- Grosse ébauche de tests complétés et corrigés par mes besoins
ChatGPT a été utilisé pour: 
- Réflexion sur l'architecture
Gutendex a été utilisé pour: 
- La doc de l'api 
- Les types attendus

Préférence pour des types plutôt que des interfaces côté TS,
mon organisation des TYPES est subjective j'aurai pu les mettre par dossier
plutot que des les regrouper tous entre eux
---

## Installation

```bash
git clone https://github.com/benoitMouly/shelfmarillion.git
cd shelfmarillion
git checkout preprod
npm install
npm run dev
```

L'application tourne sur `http://localhost:5173` par défaut.

---

## Commandes disponibles

```bash
npm run dev            # Serveur de développement
npm run build          # Build de production
npm run preview        # Prévisualise le build en local
npm run test           # Tests unitaires (passe unique)
npm run test:watch     # Tests en mode watch
npm run test:ci        # Tests + rapport de couverture
npm run lint           # Analyse ESLint
npm run format         # Formatage Prettier
npm run format:check   # Vérifie le formatage sans modifier
```

## Améliorations

- Internationalisation (i18n)
- Refacto des conditions dans les composants
- Design
- Sécurité Content Security Policy dans les headers pour plus de sécu (pas de sripts, d'inline etc)
- Rajouter des placeholder/fallback si jamais des données sont manquantes
- Test end2end avec des scénarios type playwright ou cypress
- Amélioration des tri de livres dans la library

-> Enjoy Maxime et Julien :) <-
