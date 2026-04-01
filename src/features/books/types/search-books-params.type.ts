export type SearchBooksParams = {
  query: string;
  page?: number;
  signal?: AbortSignal;
};