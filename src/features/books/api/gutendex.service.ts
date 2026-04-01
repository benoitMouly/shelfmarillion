import { gutendexResponseSchema, type GutendexResponse } from "../schemas/gutendex.schema";

const GUTENDEX_BASE_URL = "https://gutendex.com/books";

export class GutendexApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GutendexApiError";
  }
}

type SearchBooksParams = {
  query: string;
  page?: number;
};

export const searchGutendexBooks = async ({
  query,
  page = 1,
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

  const url = new URL(GUTENDEX_BASE_URL);
  url.searchParams.set("search", trimmedQuery);
  url.searchParams.set("page", String(page));

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new GutendexApiError("Unable to fetch books from Gutendex.");
  }

  const json = await response.json();
  return gutendexResponseSchema.parse(json);
};