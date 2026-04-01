import type { GutendexBook } from "../schemas/gutendex.schema";

export type UseGutendexSearchReturn = {
  apiSearchTerm: string;
  results: GutendexBook[];
  isLoading: boolean;
  errorMessage: string | null;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setApiSearchTerm: (value: string) => void;
  searchBooks: (params?: { page?: number; term?: string }) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  resetSearch: () => void;
};