import { useCallback, useState } from "react";
import { searchGutendexBooks } from "../api/gutendex.service";
import type { UseGutendexSearchReturn } from "../types/use-gutendex-search-return.type";
import type { GutendexBook } from "../schemas/gutendex.schema";

export const useGutendexSearch = (): UseGutendexSearchReturn => {
  const [apiSearchTerm, setApiSearchTerm] = useState("");
  const [results, setResults] = useState<GutendexBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

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

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await searchGutendexBooks({
          query: trimmedTerm,
          page,
        });

        setResults(response.results);
        setCurrentPage(page);
        setHasNextPage(Boolean(response.next));
        setHasPreviousPage(Boolean(response.previous));
        setHasSearched(true);
      } catch (error) {
        console.error("Failed to search books in Gutendex", error);
        setResults([]);
        setHasNextPage(false);
        setHasPreviousPage(false);
        setErrorMessage("An error occurred while searching books.");
      } finally {
        setIsLoading(false);
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