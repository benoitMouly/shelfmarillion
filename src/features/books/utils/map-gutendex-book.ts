import type { GutendexBook } from "../schemas/gutendex.schema";
import type { LibraryBook } from "../types/library-book.type";

// To 
const getCoverUrl = (formats: Record<string, string>): string | null => {
  return (
    formats["image/jpeg"] ??
    formats["image/png"] ??
    formats["image/jpg"] ??
    null
  );
};

export const mapGutendexBookToLibraryBook = (
  book: GutendexBook,
): LibraryBook => {
  return {
    id: book.id,
    title: book.title,
    authors: book.authors.map((author) => author.name),
    coverUrl: getCoverUrl(book.formats),
    languages: book.languages,
    subjects: book.subjects,
    bookshelves: book.bookshelves,
    downloadCount: book.download_count,
    isRead: false,
    addedAt: new Date().toISOString(),
  };
};