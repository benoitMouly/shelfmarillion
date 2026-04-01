import type { LibraryBook } from "../types/library-book.type";
import type { ReadFilter } from "../types/library-filter.type";

export type LibrarySectionProps = {
  books: LibraryBook[];
  filteredBooks: LibraryBook[];
  paginatedBooks: LibraryBook[];
  librarySearchTerm: string;
  readFilter: ReadFilter;
  currentPage: number;
  totalPages: number;
  setLibrarySearchTerm: (value: string) => void;
  setReadFilter: (value: ReadFilter) => void;
  toggleReadStatus: (bookId: number) => void;
  removeBook: (bookId: number) => void;
  clearLibrary: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
};