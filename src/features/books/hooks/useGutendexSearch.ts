import { useCallback, useReducer, useRef, useState } from "react";
import { searchGutendexBooks } from "../api/gutendex.service";
import type { UseGutendexSearchReturn } from "../types/use-gutendex-search-return.type";
import type { GutendexBook } from "../schemas/gutendex.schema";

type SearchState = {
  results: GutendexBook[];
  isLoading: boolean;
  hasSearched: boolean;
  errorMessage: string | null;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type SearchAction =
  | { type: "SEARCH_START" }
  | {
      type: "SEARCH_SUCCESS";
      payload: {
        results: GutendexBook[];
        page: number;
        hasNext: boolean;
        hasPrevious: boolean;
      };
    }
  | { type: "SEARCH_ERROR"; payload: string }
  | { type: "CLEAR_RESULTS" }
  | { type: "RESET" };

const initialSearchState: SearchState = {
  results: [],
  isLoading: false,
  hasSearched: false,
  errorMessage: null,
  currentPage: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case "SEARCH_START":
      return { ...state, isLoading: true, errorMessage: null };

    case "SEARCH_SUCCESS":
    return {
      ...state,
      results: action.payload.results,
      currentPage: action.payload.page,
      hasNextPage: action.payload.hasNext,
      hasPreviousPage: action.payload.hasPrevious,
      hasSearched: true,
      isLoading: false,
    };

    case "SEARCH_ERROR":
      return {
        ...state,
        results: [],
        hasNextPage: false,
        hasPreviousPage: false,
        errorMessage: action.payload,
        isLoading: false,
      };

    case "CLEAR_RESULTS":
      return {
        ...state,
        results: [],
        currentPage: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        errorMessage: null,
      };

    case "RESET":
      return initialSearchState;
  }
};

export const useGutendexSearch = (): UseGutendexSearchReturn => {
  // apiSearchTerm reste un useState car c'est un champ de saisie indépendant : l'utilisateur le met à jour lettre par lettre,
  // et il n'a pas de lien de transition avec les autres states.
  const [apiSearchTerm, setApiSearchTerm] = useState("");
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  /**
   * Permet d'annuler un appel réseau obsolète si l'utilisateur
   * lance une nouvelle recherche avant que la précédente n'ait répondu.
   */
  const abortControllerRef = useRef<AbortController | null>(null);

  const searchBooks = useCallback(
    async (params?: { page?: number; term?: string }) => {
      const page = params?.page ?? 1;
      const rawTerm = params?.term ?? apiSearchTerm;
      const trimmedTerm = rawTerm.trim();

      if (!trimmedTerm) {
        dispatch({ type: "CLEAR_RESULTS" });
        return;
      }

      // Annule la requête précédente si elle est encore en vol
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      dispatch({ type: "SEARCH_START" });

      try {
        const response = await searchGutendexBooks({
          query: trimmedTerm,
          page,
          signal: controller.signal,
        });

        dispatch({
          type: "SEARCH_SUCCESS",
          payload: {
            results: response.results,
            page,
            hasNext: Boolean(response.next),
            hasPrevious: Boolean(response.previous),
          },
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to search books in Gutendex", error);
        dispatch({
          type: "SEARCH_ERROR",
          payload: "An error occurred while searching books.",
        });
      }
    },
    [apiSearchTerm],
  );

  const goToNextPage = useCallback(async () => {
    if (!state.hasNextPage || state.isLoading) {
      return;
    }

    await searchBooks({ page: state.currentPage + 1 });
  }, [state.currentPage, state.hasNextPage, state.isLoading, searchBooks]);

  const goToPreviousPage = useCallback(async () => {
    if (!state.hasPreviousPage || state.isLoading || state.currentPage <= 1) {
      return;
    }

    await searchBooks({ page: state.currentPage - 1 });
  }, [state.currentPage, state.hasPreviousPage, state.isLoading, searchBooks]);

  const resetSearch = useCallback(() => {
    setApiSearchTerm("");
    dispatch({ type: "RESET" });
  }, []);

  return {
    apiSearchTerm,
    results: state.results,
    isLoading: state.isLoading,
    hasSearched: state.hasSearched,
    errorMessage: state.errorMessage,
    currentPage: state.currentPage,
    hasNextPage: state.hasNextPage,
    hasPreviousPage: state.hasPreviousPage,
    setApiSearchTerm,
    searchBooks,
    goToNextPage,
    goToPreviousPage,
    resetSearch,
  };
};