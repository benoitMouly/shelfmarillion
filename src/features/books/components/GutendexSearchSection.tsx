import { useState } from "react";
import type { SubmitEvent } from "react";
import { BookCardSkeleton } from "../../../components/BookCardSkeleton";
import { SectionHeader } from "../../../components/SectionHeader";
import type { GutendexBook } from "../schemas/gutendex.schema";
import type { AddBookResult } from "../types/use-library-return.type";

type GutendexSearchSectionProps = {
  apiSearchTerm: string;
  results: GutendexBook[];
  isLoading: boolean;
  hasSearched: boolean;
  errorMessage: string | null;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  setApiSearchTerm: (value: string) => void;
  searchBooks: (params?: { page?: number; term?: string }) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  onAddBook: (book: GutendexBook) => AddBookResult;
  libraryBookIds: Set<number>;
};

export const GutendexSearchSection = ({
  apiSearchTerm,
  results,
  isLoading,
  hasSearched,
  errorMessage,
  currentPage,
  hasNextPage,
  hasPreviousPage,
  setApiSearchTerm,
  searchBooks,
  goToNextPage,
  goToPreviousPage,
  onAddBook,
  libraryBookIds,
}: GutendexSearchSectionProps) => {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(null);
    await searchBooks({ page: 1 });
  };

  const handleAddBook = (book: GutendexBook) => {
    const result = onAddBook(book);

    if (!result.success) {
      setFeedbackMessage("This book is already in your library.");
      return;
    }

    setFeedbackMessage(`"${book.title}" was added to your library.`);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionHeader
        title="Search in Gutendex"
        subtitle="Search for a book by title or author, then add it to your library."
      />

      <form className="mb-4 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="gutendex-search">
          Search books in Gutendex
        </label>

        <input
          id="gutendex-search"
          type="text"
          value={apiSearchTerm}
          onChange={(event) => setApiSearchTerm(event.target.value)}
          placeholder="Search by title or author"
          className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none ring-0 transition focus:border-slate-500"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {feedbackMessage ? (
        <p className="mb-4 text-sm text-slate-700" aria-live="polite">
          {feedbackMessage}
        </p>
      ) : null}

      {errorMessage ? (
        <p className="mb-4 text-sm text-red-600" aria-live="polite">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !hasSearched && !errorMessage ? (
        <p className="text-sm text-slate-500">
          No results yet. Start by searching for a book.
        </p>
      ) : null}

      {!isLoading && hasSearched && !errorMessage && results.length === 0 ? (
        <p className="text-sm text-slate-500">
          No books found for your search. Try a different title or author.
        </p>
      ) : null}

      {isLoading ? (
        <ul className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </ul>
      ) : null}

      {!isLoading && results.length > 0 ? (
        <div className="space-y-4">
          <ul className="grid gap-4">
            {results.map((book) => {
              const isAlreadyAdded = libraryBookIds.has(book.id);
              const coverUrl =
                book.formats["image/jpeg"] ??
                book.formats["image/png"] ??
                book.formats["image/jpg"] ??
                null;

              return (
                <li
                  key={book.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-start"
                >
                  <div className="h-32 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={`Cover of ${book.title}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{book.title}</h3>
                      <p className="text-sm text-slate-600">
                        {book.authors.length > 0
                          ? book.authors.map((author) => author.name).join(", ")
                          : "Unknown author"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>Languages: {book.languages.join(", ") || "N/A"}</span>
                      <span>Downloads: {book.download_count}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddBook(book)}
                      disabled={isAlreadyAdded}
                      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isAlreadyAdded ? "Already added" : "Add to library"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => void goToPreviousPage()}
              disabled={!hasPreviousPage || isLoading}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-slate-600">Page {currentPage}</span>

            <button
              type="button"
              onClick={() => void goToNextPage()}
              disabled={!hasNextPage || isLoading}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};