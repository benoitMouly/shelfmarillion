import {
  createContext,
  createElement, use,
  type ReactNode,
} from "react";
import { useLibrary } from "../features/books/hooks/useLibrary";
import type { UseLibraryReturn } from "../features/books/types/use-library-return.type";

// Contexte React pour la bibliothèque perso.
// Sans contexte, App.tsx devait transmettre chaque donnée et chaque
// action (books, addBook, removeBook, filtres, pagination etc) en props
// à travers tous les composants. Cela créé du props drilling, donc des compo qui reçoivent des props dont ils s'en fichent
//
// Avec ce contexte, n'importe quel composant descendant du Provider
// peut accéder directement aux données via un simple hook,
// sans que les composants parents aient besoin de les relayer. C'est un peu comme redux toolkit mais en natif dans React, sans dépendance externe.

const LibraryContext = createContext<UseLibraryReturn | null>(null);

// Provider : composant wrapper qui instancie le hook useLibrary()
// et injecte toute sa valeur de retour dans le contexte.
//
// Il doit être placé en haut de l'arbre, au-dessus de tous les
// composants qui ont besoin d'accéder à la biblio.
// , donc dans App.tsx.
//
// createElement est utilisé à la place de JSX car le fichier est
// en .ts (pas .tsx). Le résultat est pareil que si jefaisi ça:
//   return <LibraryContext.Provider value={library}>{children}</LibraryContext.Provider>

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const library = useLibrary();

  return createElement(LibraryContext.Provider, { value: library }, children);
};

// Hook personnalisé pour consommer le contexte de la bibblio. 
// Une bonne pratique recommandée par la communauté React pour éviter les erreurs d'utilisation du contexte. 
// Ce hook encapsule la logique de vérification et de typage. Plus simple et plus sûr 

// Avantages par rapport à un use(LibraryContext) direct dans les composants :
// -> Vérification automatique : lève une erreur explicite si le
//     composant est utilisé en dehors du Provider.
// -> Typage strict : le retour est UseLibraryReturn (jamais null),
//    ce qui simplifie le code des compo qui consomment.
// -> API unique : les composants n'ont pas besoin de connaître le
//     nom interne du contexte, ils importent juste ce hook.

export const useLibraryContext = (): UseLibraryReturn => {
  const context = use(LibraryContext);

  if (!context) {
    throw new Error(
      "useLibraryContext needs to be used inside a <LibraryProvider>. " +
        "Make sure the component is wrapped with the Provider.",
    );
  }

  return context;
};