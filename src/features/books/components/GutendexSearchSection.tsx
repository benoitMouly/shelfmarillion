import { useState } from "react";
import type { SubmitEvent } from "react";
import { BookCardSkeleton } from "../../../components/BookCardSkeleton";
import { Pagination } from "../../../components/Pagination";
import { SectionHeader } from "../../../components/SectionHeader";
import { useGutendexSearchContext } from "../../../contexts/fetched-books.provider";
import { useLibraryContext } from "../../../contexts/my-books-provider";
import type { GutendexBook } from "../schemas/gutendex.schema";
import { mapGutendexBookToLibraryBook } from "../utils/map-gutendex-book";

export const GutendexSearchSection = () => {
  // Accès direct aux données de recherche via le contexte,
  // plus besoin de recevoir mille props depuis le parent
  const {
    apiSearchTerm,
    results,
    isLoading,
    hasSearched,
    errorMessage,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    setApiSearchTerm,
    searchBooks,
    goToPage,
  } = useGutendexSearchContext();

  // Accès au contexte de la bibliothèque pour :
  // - savoir si un livre est déjà ajouté (libraryBookIds)
  // - ajouter de nouveaux livres (addBook)
  const { addBook, books } = useLibraryContext();
  const libraryBookIds = new Set(books.map((book) => book.id));
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(null);
    await searchBooks();
  };

  const handleAddBook = (book: GutendexBook) => {
    const mappedBook = mapGutendexBookToLibraryBook(book);
    const result = addBook(mappedBook);

    if (!result.success) {
      setFeedbackMessage("This book is already in your library.");
      return;
    }

    setFeedbackMessage(`"${book.title}" was added to your library.`);
  };

  return (
    <section aria-labelledby="gutendex-section-title" className="rounded-card border border-border-default bg-surface-card p-6 shadow-card">
      <SectionHeader
        titleId="gutendex-section-title"
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
          className="w-full rounded-input border border-border-input px-4 py-2 text-sm outline-none ring-0 transition focus:border-border-focus"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-input bg-primary-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {feedbackMessage ? (
        // aria-live="polite" : annonce le message sans interrompre l'utilisateur (WCAG 4.1.3)
        <p className="mb-4 text-sm text-text-subtle" aria-live="polite" aria-atomic="true">
          {feedbackMessage}
        </p>
      ) : null}

      {errorMessage ? (
        // role="alert" (= aria-live="assertive") : interrompt immédiatement le lecteur d'écran
        // car une erreur est une information critique qui ne doit pas attendre (WCAG 4.1.3)
        <p className="mb-4 text-sm text-danger-600" role="alert" aria-atomic="true">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && !hasSearched && !errorMessage ? (
        // aria-live="polite" : annonce l'état initial au lecteur d'écran (WCAG 4.1.3)
        <p className="text-sm text-text-muted" aria-live="polite">
          No results yet. Start by searching for a book.
        </p>
      ) : null}

      {!isLoading && hasSearched && !errorMessage && results.length === 0 ? (
        // role="status" : annonce poliment qu'aucun résultat n'a été trouvé après la recherche
        // sans interrompre — équivalent sémantique de aria-live="polite" (WCAG 4.1.3)
        <p className="text-sm text-text-muted" role="status" aria-atomic="true">
          No books found for your search. Try a different title or author.
        </p>
      ) : null}

      {isLoading ? (
        // aria-busy : signale aux technologies d'assistance que la liste est en cours de
        // chargement — aria-label donne un contexte à la liste vide (WCAG 4.1.3)
        <ul aria-busy="true" aria-label="Loading search results" className="grid gap-4">
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
                  className="flex flex-col gap-4 rounded-input border border-border-default p-4 sm:flex-row sm:items-start"
                >
                  <div className="h-32 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={`Cover of ${book.title}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      // aria-hidden : texte purement décoratif, l'absence de couverture
                      // est déjà implicite pour les lecteurs d'écran (WCAG 1.1.1)
                      <div aria-hidden="true" className="flex h-full w-full items-center justify-center text-xs text-text-muted">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-text-heading">{book.title}</h3>
                      <p className="text-sm text-text-body">
                        {book.authors.length > 0
                          ? book.authors.map((author) => author.name).join(", ")
                          : "Unknown author"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-text-subtle">
                      <span>Languages: {book.languages.join(", ") || "N/A"}</span>
                      <span>Downloads: {book.download_count}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddBook(book)}
                      disabled={isAlreadyAdded}
                      // aria-label : contextualise le bouton avec le titre du livre pour les lecteurs
                      // d'écran — évite la répétition de "Add to library" sans contexte (WCAG 2.4.6)
                      aria-label={isAlreadyAdded ? `"${book.title}" already in library` : `Add "${book.title}" to library`}
                      className="rounded-input border border-border-default px-4 py-2 text-sm font-medium text-text-heading transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isAlreadyAdded ? "Already added" : "Add to library"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="text-sm text-text-subtle">
            {totalCount} {totalCount > 1 ? "results" : "result"} found
          </p>

          {/* aria-live="polite" + aria-atomic : annonce discrètement le numéro de page
              courant au lecteur d'écran après chaque changement de page (WCAG 4.1.3) */}
          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Page {currentPage} of {totalPages}, {totalCount} {totalCount > 1 ? "results" : "result"}
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            isLoading={isLoading}
            onGoToPage={(page) => void goToPage(page)}
            ariaLabel="Search results pagination"
          />
        </div>
      ) : null}
    </section>
  );
};