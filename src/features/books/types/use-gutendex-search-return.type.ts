import type { GutendexBook } from "../schemas/gutendex.schema";

export type UseGutendexSearchReturn = {
  apiSearchTerm: string;
  results: GutendexBook[];
  isLoading: boolean;
  hasSearched: boolean;
  errorMessage: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setApiSearchTerm: (value: string) => void;
  searchBooks: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  resetSearch: () => void;
};