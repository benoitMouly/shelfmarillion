import type { LibraryBook } from "./library-book.type";
import type { ReadFilter } from "./library-filter.type";

export type AddBookResult =
  | { success: true }
  | { success: false; reason: "duplicate" };

export type UseLibraryReturn = {
  books: LibraryBook[];
  filteredBooks: LibraryBook[];
  librarySearchTerm: string;
  readFilter: ReadFilter;
  addBook: (book: LibraryBook) => AddBookResult;
  removeBook: (bookId: number) => void;
  toggleReadStatus: (bookId: number) => void;
  setLibrarySearchTerm: (value: string) => void;
  setReadFilter: (value: ReadFilter) => void;
  clearLibrary: () => void;
};