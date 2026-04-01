import { useEffect, useMemo, useState } from "react";
import { getStoredLibrary, saveLibrary } from "../storage/library.storage";
import type { LibraryBook } from "../types/library-book.type";
import type { ReadFilter } from "../types/library-filter.type";
import type { UseLibraryReturn } from "../types/use-library-return.type";
import { normalizeString } from "../utils/normalize-string";

const PAGE_SIZE = 10;

export const useLibrary = (): UseLibraryReturn => {
  const [books, setBooks] = useState<LibraryBook[]>(getStoredLibrary); // appelé une seule fois au montage grâce à la référence, évite les re-renders infinis
  const [librarySearchTerm, setLibrarySearchTermRaw] = useState("");
  const [readFilter, setReadFilterRaw] = useState<ReadFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    saveLibrary(books);
  }, [books]);

  const setLibrarySearchTerm = (value: string) => {
    setLibrarySearchTermRaw(value);
    setCurrentPage(1);
  };

  const setReadFilter = (value: ReadFilter) => {
    setReadFilterRaw(value);
    setCurrentPage(1);
  };

  const addBook = (book: LibraryBook) => {
    const alreadyExists = books.some((existingBook) => existingBook.id === book.id);

    if (alreadyExists) {
      return { success: false as const, reason: "duplicate" as const };
    }

    setBooks((previousBooks) => [book, ...previousBooks]);
    return { success: true as const };
  };

  const removeBook = (bookId: number) => {
    setBooks((previousBooks) =>
      previousBooks.filter((book) => book.id !== bookId),
    );
  };

  const toggleReadStatus = (bookId: number) => {
    setBooks((previousBooks) =>
      previousBooks.map((book) =>
        book.id === bookId ? { ...book, isRead: !book.isRead } : book,
      ),
    );
  };

  const clearLibrary = () => {
    setBooks([]);
    setCurrentPage(1);
  };

  const filteredBooks = useMemo(() => {
    const normalizedSearch = normalizeString(librarySearchTerm);

    return books.filter((book) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        normalizeString(book.title).includes(normalizedSearch) ||
        book.authors.some((author) =>
          normalizeString(author).includes(normalizedSearch),
        );

      const matchesReadFilter =
        readFilter === "all" ||
        (readFilter === "read" && book.isRead) ||
        (readFilter === "unread" && !book.isRead);

      return matchesSearch && matchesReadFilter;
    });
  }, [books, librarySearchTerm, readFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));

  /**
   * Tranche de filteredBooks correspondant à la page courante.
   * currentPage est borné à totalPages pour éviter une page fantôme
   * si des suppressions réduisent le nombre total de pages.
   */
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBooks = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredBooks.slice(start, start + PAGE_SIZE);
  }, [filteredBooks, safePage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  return {
    books,
    filteredBooks,
    paginatedBooks,
    librarySearchTerm,
    readFilter,
    currentPage: safePage,
    totalPages,
    addBook,
    removeBook,
    toggleReadStatus,
    setLibrarySearchTerm,
    setReadFilter,
    clearLibrary,
    goToNextPage,
    goToPreviousPage,
  };
};