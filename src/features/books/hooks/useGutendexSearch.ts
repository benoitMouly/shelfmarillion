import { useCallback, useReducer, useRef, useState } from "react";
import { searchGutendexBooks } from "../api/gutendex.service";
import type { UseGutendexSearchReturn } from "../types/use-gutendex-search-return.type";
import type { GutendexBook } from "../schemas/gutendex.schema";

type SearchState = {
  allResults: GutendexBook[];
  totalCount: number;
  nextApiPage: number | null;
  isLoading: boolean;
  hasSearched: boolean;
  errorMessage: string | null;
};

type SearchAction =
  | { type: "SEARCH_START" }
  | {
      type: "SEARCH_SUCCESS";
      payload: {
        results: GutendexBook[];
        totalCount: number;
        nextApiPage: number | null;
      };
    }
  | { type: "SEARCH_ERROR"; payload: string }
  | { type: "CLEAR_RESULTS" }
  | { type: "RESET" };

const DEFAULT_PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE);

const initialSearchState: SearchState = {
  allResults: [],
  totalCount: 0,
  nextApiPage: null,
  isLoading: false,
  hasSearched: false,
  errorMessage: null,
};

const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case "SEARCH_START":
      return { ...state, isLoading: true, errorMessage: null };

    // on ajoute les nouveaux résultats à la suite du buffer equi existe 
    case "SEARCH_SUCCESS":
      return {
        ...state,
        allResults: [...state.allResults, ...action.payload.results],
        totalCount: action.payload.totalCount,
        nextApiPage: action.payload.nextApiPage,
        hasSearched: true,
        isLoading: false,
      };

    case "SEARCH_ERROR":
      return {
        ...state,
        allResults: [],
        totalCount: 0,
        nextApiPage: null,
        errorMessage: action.payload,
        isLoading: false,
      };

    case "CLEAR_RESULTS":
      return {
        ...state,
        allResults: [],
        totalCount: 0,
        nextApiPage: null,
        hasSearched: false,
        errorMessage: null,
      };

    case "RESET":
      return initialSearchState;
  }
};

export const useGutendexSearch = (): UseGutendexSearchReturn => {
  const [apiSearchTerm, setApiSearchTerm] = useState("");
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  const [displayPage, setDisplayPage] = useState(1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const currentQueryRef = useRef("");
  const totalPages = state.totalCount > 0 ? Math.ceil(state.totalCount / DEFAULT_PAGE_SIZE) : 0;
  const hasNextPage = displayPage < totalPages;
  const hasPreviousPage = displayPage > 1;

  const startIndex = (displayPage - 1) * DEFAULT_PAGE_SIZE;
  const displayedResults = state.allResults.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE);

  const searchBooks = useCallback(async () => {
    const trimmedTerm = apiSearchTerm.trim();

    if (!trimmedTerm) {
      dispatch({ type: "CLEAR_RESULTS" });
      setDisplayPage(1);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    currentQueryRef.current = trimmedTerm;
    dispatch({ type: "CLEAR_RESULTS" });
    dispatch({ type: "SEARCH_START" });

    try {
      const response = await searchGutendexBooks({
        query: trimmedTerm,
        page: 1,
        signal: controller.signal,
      });

      dispatch({
        type: "SEARCH_SUCCESS",
        payload: {
          results: response.results,
          totalCount: response.count,
          nextApiPage: response.next ? 2 : null,
        },
      });
      setDisplayPage(1);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      console.error("Failed to search books in Gutendex", error);
      dispatch({
        type: "SEARCH_ERROR",
        payload: "An error occurred while searching books.",
      });
    }
  }, [apiSearchTerm]);

  const goToPage = useCallback(
    async (page: number) => {
      if (state.isLoading || page < 1 || page > totalPages) return;

      const neededItems = page * DEFAULT_PAGE_SIZE;

      if (neededItems > state.allResults.length && state.nextApiPage !== null) {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        dispatch({ type: "SEARCH_START" });

        try {
          const newResults: GutendexBook[] = [];
          let bufferLength = state.allResults.length;
          let nextPage: number | null = state.nextApiPage;
          let latestCount = state.totalCount;

          while (neededItems > bufferLength && nextPage !== null) {
            const response = await searchGutendexBooks({
              query: currentQueryRef.current,
              page: nextPage,
              signal: controller.signal,
            });

            newResults.push(...response.results);
            bufferLength += response.results.length;
            latestCount = response.count;
            nextPage = response.next ? nextPage + 1 : null;
          }

          dispatch({
            type: "SEARCH_SUCCESS",
            payload: {
              results: newResults,
              totalCount: latestCount,
              nextApiPage: nextPage,
            },
          });
        } catch (error) {
          if (error instanceof DOMException) return;

          console.error("Failed to load page", error);
          dispatch({
            type: "SEARCH_ERROR",
            payload: "An error occurred while loading the page.",
          });
          return;
        }
      }

      setDisplayPage(page);
    },
    [state.isLoading, state.allResults.length, state.nextApiPage, state.totalCount, totalPages],
  );

  const goToNextPage = useCallback(async () => {
    if (!hasNextPage || state.isLoading) return;
    await goToPage(displayPage + 1);
  }, [hasNextPage, state.isLoading, goToPage, displayPage]);

  const goToPreviousPage = useCallback(async () => {
    if (!hasPreviousPage || state.isLoading) return;
    await goToPage(displayPage - 1);
  }, [hasPreviousPage, state.isLoading, goToPage, displayPage]);

  const resetSearch = useCallback(() => {
    setApiSearchTerm("");
    setDisplayPage(1);
    currentQueryRef.current = "";
    dispatch({ type: "RESET" });
  }, []);

  return {
    apiSearchTerm,
    results: displayedResults,
    isLoading: state.isLoading,
    hasSearched: state.hasSearched,
    errorMessage: state.errorMessage,
    currentPage: displayPage,
    totalPages,
    totalCount: state.totalCount,
    hasNextPage,
    hasPreviousPage,
    setApiSearchTerm,
    searchBooks,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    resetSearch,
  };
};