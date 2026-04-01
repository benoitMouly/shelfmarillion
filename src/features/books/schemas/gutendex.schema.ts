import { z } from "zod";

export const gutendexPersonSchema = z.object({
  name: z.string(),
  birth_year: z.number().nullable(),
  death_year: z.number().nullable(),
});

export const gutendexFormatsSchema = z.record(z.string(), z.string());

export const gutendexBookSchema = z.object({
  id: z.number(),
  title: z.string(),
  subjects: z.array(z.string()),
  authors: z.array(gutendexPersonSchema),
  summaries: z.array(z.string()),
  translators: z.array(gutendexPersonSchema),
  bookshelves: z.array(z.string()),
  languages: z.array(z.string()),
  copyright: z.boolean().nullable(),
  media_type: z.string(),
  formats: gutendexFormatsSchema,
  download_count: z.number(),
});

export const gutendexResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(gutendexBookSchema),
});

export type GutendexBook = z.infer<typeof gutendexBookSchema>;
export type GutendexResponse = z.infer<typeof gutendexResponseSchema>;