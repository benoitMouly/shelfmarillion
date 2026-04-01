import { describe, expect, it, vi } from "vitest";
import type { GutendexBook } from "../features/books/schemas/gutendex.schema";
import { mapGutendexBookToLibraryBook } from "../features/books/utils/map-gutendex-book";

describe("mapGutendexBookToLibraryBook", () => {
  it("should map a Gutendex book to a LibraryBook", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T10:00:00.000Z"));

    const gutendexBook: GutendexBook = {
      id: 123,
      title: "Pride and Prejudice",
      subjects: ["Love stories", "England -- Fiction"],
      authors: [
        {
          name: "Austen, Jane",
          birth_year: 1775,
          death_year: 1817,
        },
      ],
      summaries: ["A classic novel."],
      translators: [],
      bookshelves: ["Best Books Ever Listings"],
      languages: ["en"],
      copyright: false,
      media_type: "Text",
      formats: {
        "image/jpeg": "https://example.com/cover.jpg",
        "text/html": "https://example.com/book.html",
      },
      download_count: 9999,
    };

    const result = mapGutendexBookToLibraryBook(gutendexBook);

    expect(result).toEqual({
      id: 123,
      title: "Pride and Prejudice",
      authors: ["Austen, Jane"],
      coverUrl: "https://example.com/cover.jpg",
      languages: ["en"],
      subjects: ["Love stories", "England -- Fiction"],
      bookshelves: ["Best Books Ever Listings"],
      downloadCount: 9999,
      isRead: false,
      addedAt: "2026-04-01T10:00:00.000Z",
    });

    vi.useRealTimers();
  });

  it("should return null coverUrl when no image format is available", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T10:00:00.000Z"));

    const gutendexBook: GutendexBook = {
      id: 456,
      title: "No Cover Book",
      subjects: [],
      authors: [],
      summaries: [],
      translators: [],
      bookshelves: [],
      languages: ["fr"],
      copyright: null,
      media_type: "Text",
      formats: {
        "text/plain": "https://example.com/book.txt",
      },
      download_count: 10,
    };

    const result = mapGutendexBookToLibraryBook(gutendexBook);

    expect(result.coverUrl).toBeNull();
    expect(result.authors).toEqual([]);
    expect(result.isRead).toBe(false);

    vi.useRealTimers();
  });
});