import { LIBRARY_STORAGE_KEY } from "./library.storage.constants";
import type { LibraryBook } from "../types/library-book.type";
import { libraryBooksSchema } from "../schemas/library-book.shema";

export const getStoredLibrary = (): LibraryBook[] => {
  try {
    const rawValue = window.localStorage.getItem(LIBRARY_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);
    return libraryBooksSchema.parse(parsedValue);
  } catch (error) {
    console.error("Failed to read library from localStorage", error);
    return [];
  }
};

export const saveLibrary = (books: LibraryBook[]): void => {
  try {
    window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error("Failed to save library to localStorage", error);
  }
};