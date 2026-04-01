export type LibraryBook = {
  id: number;
  title: string;
  authors: string[];
  coverUrl: string | null;
  languages: string[];
  subjects: string[];
  bookshelves: string[];
  downloadCount: number;
  isRead: boolean; // New property to track if the book has been read
  addedAt: string; // New property to track when the book was added to the library
};