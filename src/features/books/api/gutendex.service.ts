import { gutendexResponseSchema, type GutendexResponse } from "../schemas/gutendex.schema";
import type { SearchBooksParams } from "../types/search-books-params.type";

const GUTENDEX_BASE_URL = import.meta.env.VITE_GUTENDEX_BASE_URL;
const MAX_CACHE_SIZE = import.meta.env.VITE_MAX_CACHE_SIZE;


export class GutendexApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GutendexApiError";
  }
}


const searchCache = new Map<string, GutendexResponse>();

const getCacheKey = (query: string, page: number): string =>
  `${query.trim().toLowerCase()}:${page}`;

export const clearSearchCache = (): void => {
  searchCache.clear();
};

export const searchGutendexBooks = async ({
  query,
  page = 1,
  signal,
}: SearchBooksParams): Promise<GutendexResponse> => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }

  const cacheKey = getCacheKey(trimmedQuery, page);
  const cached = searchCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const url = new URL(GUTENDEX_BASE_URL);
  url.searchParams.set("search", trimmedQuery);
  url.searchParams.set("page", String(page));

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new GutendexApiError("Unable to fetch books from Gutendex.");
  }

  const json = await response.json() as unknown;
  const parsed = gutendexResponseSchema.parse(json);

  if (searchCache.size >= MAX_CACHE_SIZE) {
    // Supprime la première entrée insérée (LRU simplifié)
    const firstKey = searchCache.keys().next().value;
    if (firstKey !== undefined) {
      searchCache.delete(firstKey);
    }
  }

  searchCache.set(cacheKey, parsed);

  return parsed;
};