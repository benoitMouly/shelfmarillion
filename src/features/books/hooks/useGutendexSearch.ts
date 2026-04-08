import { useCallback, useRef, useState } from "react";
import { searchGutendexBooks } from "../api/gutendex.service";
import type { UseGutendexSearchReturn } from "../types/use-gutendex-search-return.type";
import type { GutendexBook } from "../schemas/gutendex.schema";

export const useGutendexSearch = (): UseGutendexSearchReturn => {

  // TODO: refactor avec red<ucer pour éviter tous ces useState imbriqués et les dépendances dans les callbacks
  const [apiSearchTerm, setApiSearchTerm] = useState("");
  const [results, setResults] = useState<GutendexBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

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
        setResults([]);
        setCurrentPage(1);
        setHasNextPage(false);
        setHasPreviousPage(false);
        setErrorMessage(null);
        return;
      }

      // Annule la requête précédente si elle est encore en vol
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await searchGutendexBooks({
          query: trimmedTerm,
          page,
          signal: controller.signal,
        });

        setResults(response.results);
        setCurrentPage(page);
        setHasNextPage(Boolean(response.next));
        setHasPreviousPage(Boolean(response.previous));
        setHasSearched(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Failed to search books in Gutendex", error);
        setResults([]);
        setHasNextPage(false);
        setHasPreviousPage(false);
        setErrorMessage("An error occurred while searching books.");
      } finally {
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    },
    [apiSearchTerm],
  );

  const goToNextPage = useCallback(async () => {
    if (!hasNextPage || isLoading) {
      return;
    }

    await searchBooks({ page: currentPage + 1 });
  }, [currentPage, hasNextPage, isLoading, searchBooks]);

  const goToPreviousPage = useCallback(async () => {
    if (!hasPreviousPage || isLoading || currentPage <= 1) {
      return;
    }

    await searchBooks({ page: currentPage - 1 });
  }, [currentPage, hasPreviousPage, isLoading, searchBooks]);

  const resetSearch = useCallback(() => {
    setApiSearchTerm("");
    setResults([]);
    setCurrentPage(1);
    setHasNextPage(false);
    setHasPreviousPage(false);
    setErrorMessage(null);
    setHasSearched(false);
  }, []);

  return {
    apiSearchTerm,
    results,
    isLoading,
    hasSearched,
    errorMessage,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    setApiSearchTerm,
    searchBooks,
    goToNextPage,
    goToPreviousPage,
    resetSearch,
  };
};