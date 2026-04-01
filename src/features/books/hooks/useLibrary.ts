import { useEffect, useMemo, useState } from "react";
import { getStoredLibrary, saveLibrary } from "../storage/library.storage";
import type { LibraryBook } from "../types/library-book.type";
import type { ReadFilter } from "../types/library-filter.type";
import type { UseLibraryReturn } from "../types/use-library-return.type";
import { normalizeString } from "../utils/normalize-string";

export const useLibrary = (): UseLibraryReturn => {
  const [books, setBooks] = useState<LibraryBook[]>(getStoredLibrary); // appelé une seule fois au montage grâce à la référence, évite les re-renders infinis
  const [librarySearchTerm, setLibrarySearchTerm] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");

  useEffect(() => {
    saveLibrary(books);
  }, [books]);

  // TODO: attention aux re-renders, il faudrait peut-être optimiser en utilisant useCallback ou en déplaçant la logique d'ajout dans un reducer
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

  return {
    books,
    filteredBooks,
    librarySearchTerm,
    readFilter,
    addBook,
    removeBook,
    toggleReadStatus,
    setLibrarySearchTerm,
    setReadFilter,
    clearLibrary,
  };
};