import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLibrary } from "../features/books/hooks/useLibrary";
import * as libraryStorage from "../features/books/storage/library.storage";
import type { LibraryBook } from "../features/books/types/library-book.type";

const initialBooks: LibraryBook[] = [
  {
    id: 1,
    title: "Les Misérables",
    authors: ["Victor Hugo"],
    coverUrl: null,
    languages: ["fr"],
    subjects: ["France"],
    bookshelves: [],
    downloadCount: 1200,
    isRead: false,
    addedAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Pride and Prejudice",
    authors: ["Jane Austen"],
    coverUrl: null,
    languages: ["en"],
    subjects: ["Love stories"],
    bookshelves: [],
    downloadCount: 3200,
    isRead: true,
    addedAt: "2026-04-01T11:00:00.000Z",
  },
];

describe("useLibrary", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should load books from storage on mount", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    expect(result.current.books).toEqual(initialBooks);
    expect(libraryStorage.getStoredLibrary).toHaveBeenCalledTimes(1);
  });

  it("should add a new book", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue([]);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    const newBook: LibraryBook = {
      id: 3,
      title: "The Odyssey",
      authors: ["Homer"],
      coverUrl: null,
      languages: ["en"],
      subjects: ["Epic poetry"],
      bookshelves: [],
      downloadCount: 2000,
      isRead: false,
      addedAt: "2026-04-01T12:00:00.000Z",
    };

    act(() => {
      const addResult = result.current.addBook(newBook);
      expect(addResult).toEqual({ success: true });
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0]).toEqual(newBook);
  });

  it("should prevent adding duplicate books", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue([initialBooks[0]]);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      const addResult = result.current.addBook(initialBooks[0]);
      expect(addResult).toEqual({ success: false, reason: "duplicate" });
    });

    expect(result.current.books).toHaveLength(1);
  });

  it("should toggle read status", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue([initialBooks[0]]);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    expect(result.current.books[0].isRead).toBe(false);

    act(() => {
      result.current.toggleReadStatus(1);
    });

    expect(result.current.books[0].isRead).toBe(true);
  });

  it("should remove a book", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      result.current.removeBook(1);
    });

    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].id).toBe(2);
  });

  it("should filter books by library search term on title", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      result.current.setLibrarySearchTerm("misera");
    });

    expect(result.current.filteredBooks).toHaveLength(1);
    expect(result.current.filteredBooks[0].title).toBe("Les Misérables");
  });

  it("should filter books by library search term on author", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      result.current.setLibrarySearchTerm("austen");
    });

    expect(result.current.filteredBooks).toHaveLength(1);
    expect(result.current.filteredBooks[0].authors).toContain("Jane Austen");
  });

  it("should filter only read books", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      result.current.setReadFilter("read");
    });

    expect(result.current.filteredBooks).toHaveLength(1);
    expect(result.current.filteredBooks[0].isRead).toBe(true);
  });

  it("should filter only unread books", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      result.current.setReadFilter("unread");
    });

    expect(result.current.filteredBooks).toHaveLength(1);
    expect(result.current.filteredBooks[0].isRead).toBe(false);
  });

  it("should clear the library", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      result.current.clearLibrary();
    });

    expect(result.current.books).toEqual([]);
    expect(result.current.filteredBooks).toEqual([]);
  });

  // ─── Pagination ────────────────────────────────────────────────────────────

  /** Génère n livres distincts pour tester la pagination. */
  const makeBooks = (count: number): LibraryBook[] =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      title: `Book ${i + 1}`,
      authors: ["Author"],
      coverUrl: null,
      languages: ["en"],
      subjects: [],
      bookshelves: [],
      downloadCount: 0,
      isRead: false,
      addedAt: new Date().toISOString(),
    }));

  it("should start on page 1 with totalPages = 1 when library has fewer books than PAGE_SIZE", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.paginatedBooks).toEqual(initialBooks);
  });

  it("should split books across multiple pages", () => {
    const books = makeBooks(25);
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    // PAGE_SIZE = 10 → 3 pages pour 25 livres
    expect(result.current.totalPages).toBe(3);
    expect(result.current.paginatedBooks).toHaveLength(10);
    expect(result.current.paginatedBooks[0].id).toBe(1);
  });

  it("should navigate to the next page", () => {
    const books = makeBooks(25);
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => {
      result.current.goToNextPage();
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedBooks[0].id).toBe(11);
  });

  it("should navigate to the previous page", () => {
    const books = makeBooks(25);
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => { result.current.goToNextPage(); });
    act(() => { result.current.goToPreviousPage(); });

    expect(result.current.currentPage).toBe(1);
  });

  it("should not go below page 1", () => {
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(initialBooks);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => { result.current.goToPreviousPage(); });

    expect(result.current.currentPage).toBe(1);
  });

  it("should not go beyond the last page", () => {
    const books = makeBooks(10);
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    // 10 livres = exactement 1 page → goToNextPage ne doit rien faire
    act(() => { result.current.goToNextPage(); });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it("should reset to page 1 when search term changes", () => {
    const books = makeBooks(25);
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => { result.current.goToNextPage(); });
    expect(result.current.currentPage).toBe(2);

    act(() => { result.current.setLibrarySearchTerm("Book 1"); });

    expect(result.current.currentPage).toBe(1);
  });

  it("should reset to page 1 when read filter changes", () => {
    const books = makeBooks(25);
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => { result.current.goToNextPage(); });
    expect(result.current.currentPage).toBe(2);

    act(() => { result.current.setReadFilter("read"); });

    expect(result.current.currentPage).toBe(1);
  });

  it("should reset to page 1 and empty books when clearing library", () => {
    const books = makeBooks(25);
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => { result.current.goToNextPage(); });

    act(() => { result.current.clearLibrary(); });

    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedBooks).toEqual([]);
    expect(result.current.totalPages).toBe(1);
  });

  it("last page shows remaining books when count is not a multiple of PAGE_SIZE", () => {
    const books = makeBooks(22); // 3 pages : 10 + 10 + 2
    vi.spyOn(libraryStorage, "getStoredLibrary").mockReturnValue(books);
    vi.spyOn(libraryStorage, "saveLibrary").mockImplementation(() => {});

    const { result } = renderHook(() => useLibrary());

    act(() => { result.current.goToNextPage(); });
    act(() => { result.current.goToNextPage(); });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.paginatedBooks).toHaveLength(2);
    expect(result.current.paginatedBooks[0].id).toBe(21);
  });
});