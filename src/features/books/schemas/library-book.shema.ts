import { z } from "zod";

export const libraryBookSchema = z.object({
  id: z.number(),
  title: z.string(),
  authors: z.array(z.string()),
  coverUrl: z.string().nullable(),
  languages: z.array(z.string()),
  subjects: z.array(z.string()),
  bookshelves: z.array(z.string()),
  downloadCount: z.number(),
  isRead: z.boolean(),
  addedAt: z.string(),
});

export const libraryBooksSchema = z.array(libraryBookSchema);