import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LibraryBook } from "../features/books/types/library-book.type";
import { getStoredLibrary, saveLibrary } from "../features/books/storage/library.storage";
import { LIBRARY_STORAGE_KEY } from "../features/books/storage/library.storage.constants";

const mockBooks: LibraryBook[] = [
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
];

describe("library.storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getStoredLibrary", () => {
    it("should return an empty array when nothing is stored", () => {
      expect(getStoredLibrary()).toEqual([]);
    });

    it("should return stored books when data is valid", () => {
      window.localStorage.setItem(
        LIBRARY_STORAGE_KEY,
        JSON.stringify(mockBooks),
      );

      expect(getStoredLibrary()).toEqual(mockBooks);
    });

    it("should return an empty array when JSON is invalid", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      window.localStorage.setItem(LIBRARY_STORAGE_KEY, "{invalid-json");

      expect(getStoredLibrary()).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it("should return an empty array when stored data shape is invalid", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      window.localStorage.setItem(
        LIBRARY_STORAGE_KEY,
        JSON.stringify([{ id: "not-a-number" }]),
      );

      expect(getStoredLibrary()).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe("saveLibrary", () => {
    it("should save books into localStorage", () => {
      saveLibrary(mockBooks);

      expect(window.localStorage.getItem(LIBRARY_STORAGE_KEY)).toBe(
        JSON.stringify(mockBooks),
      );
    });

    it("should log an error if localStorage.setItem throws", () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const setItemSpy = vi
        .spyOn(Storage.prototype, "setItem")
        .mockImplementation(() => {
          throw new Error("Quota exceeded");
        });

      saveLibrary(mockBooks);

      expect(setItemSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});