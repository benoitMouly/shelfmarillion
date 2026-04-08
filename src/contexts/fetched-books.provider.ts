import {
  createContext,
  createElement,
  use,
  type ReactNode,
} from "react";
import { useGutendexSearch } from "../features/books/hooks/useGutendexSearch";
import type { UseGutendexSearchReturn } from "../features/books/types/use-gutendex-search-return.type";

const GutendexSearchContext = createContext<UseGutendexSearchReturn | null>(
  null,
);

export const GutendexSearchProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const search = useGutendexSearch();

  return createElement(
    GutendexSearchContext.Provider,
    { value: search },
    children,
  );
};

// Hook personnalisé pour consommer le contexte de recherche.
// Même logique que useLibraryContext : vérification du Provider
// et typage strict du retour.

export const useGutendexSearchContext = (): UseGutendexSearchReturn => {
  const context = use(GutendexSearchContext);

  if (!context) {
    throw new Error(
      "useGutendexSearchContext needs to be used inside a <GutendexSearchProvider>. " +
        "Make sure the component is wrapped with the Provider.",
    );
  }

  return context;
};