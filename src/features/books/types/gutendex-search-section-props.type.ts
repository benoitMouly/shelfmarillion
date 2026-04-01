import type { GutendexBook } from "../schemas/gutendex.schema";
import type { AddBookResult } from "../types/use-library-return.type";

export type GutendexSearchSectionProps = {
  apiSearchTerm: string;
  results: GutendexBook[];
  isLoading: boolean;
  hasSearched: boolean;
  errorMessage: string | null;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setApiSearchTerm: (value: string) => void;
  searchBooks: (params?: { page?: number; term?: string }) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  onAddBook: (book: GutendexBook) => AddBookResult;
  libraryBookIds: Set<number>;
};