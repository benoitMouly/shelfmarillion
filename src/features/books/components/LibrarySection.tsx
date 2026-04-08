import { SectionHeader } from "../../../components/SectionHeader";
import { useLibraryContext } from "../../../contexts/my-books-provider";
import type { ReadFilter } from "../types/library-filter.type";

export const LibrarySection = () => {
  // Accès direct à toutes les données et actions de la bibliothèque
  // via le contexte, sans aucune prop transmise par le parent
  const {
    books,
    filteredBooks,
    paginatedBooks,
    librarySearchTerm,
    readFilter,
    currentPage,
    totalPages,
    setLibrarySearchTerm,
    setReadFilter,
    toggleReadStatus,
    removeBook,
    clearLibrary,
    goToNextPage,
    goToPreviousPage,
  } = useLibraryContext();
  return (
    // aria-labelledby : associe la section à son h2 pour la navigation par landmarks (WCAG 1.3.1)
    <section aria-labelledby="library-section-title" className="rounded-card border border-border-default bg-surface-card p-6 shadow-card">
      <SectionHeader
        titleId="library-section-title"
        title="My library"
        subtitle={`${books.length} book${books.length > 1 ? "s" : ""} in your library`}
      >
        <button
          type="button"
          onClick={clearLibrary}
          disabled={books.length === 0}
          className="rounded-input border border-danger-200 px-4 py-2 text-sm text-danger-700 transition hover:bg-danger-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear library
        </button>
      </SectionHeader>

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <div>
          <label
            htmlFor="library-search"
            className="mb-1 block text-sm font-medium text-text-subtle"
          >
            Search in my library
          </label>
          <input
            id="library-search"
            type="text"
            value={librarySearchTerm}
            onChange={(event) => setLibrarySearchTerm(event.target.value)}
            placeholder="Search by title or author"
            className="w-full rounded-input border border-border-input px-4 py-2 text-sm outline-none transition focus:border-border-focus"
          />
        </div>

        <div>
          <label
            htmlFor="read-filter"
            className="mb-1 block text-sm font-medium text-text-subtle"
          >
            Status
          </label>
          <select
            id="read-filter"
            value={readFilter}
            onChange={(event) => setReadFilter(event.target.value as ReadFilter)}
            className="w-full rounded-input border border-border-input px-4 py-2 text-sm outline-none transition focus:border-border-focus"
          >
            <option value="all">All</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      {books.length === 0 ? (
        <p className="text-sm text-text-muted">
          Your library is empty. Add books from Gutendex.
        </p>
      ) : null}

      {books.length > 0 && filteredBooks.length === 0 ? (
        // role="status" : annonce poliment qu'aucun livre ne correspond aux critères (WCAG 4.1.3)
        <p className="text-sm text-text-muted" role="status" aria-atomic="true">
          No books match your current search or filter.
        </p>
      ) : null}

      {/* sr-only + aria-live : annonce discrètement le nombre de résultats filtrés au lecteur
          d'écran quand la recherche ou le filtre change, sans perturber la navigation (WCAG 4.1.3) */}
      {books.length > 0 ? (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {filteredBooks.length === 0
            ? "No books match your current search or filter."
            : `${filteredBooks.length} book${filteredBooks.length > 1 ? "s" : ""} displayed.`}
        </p>
      ) : null}

      {filteredBooks.length > 0 ? (
        <div className="space-y-4">
          <ul className="grid gap-4">
            {paginatedBooks.map((book) => (
            <li
              key={book.id}
              className="flex flex-col gap-4 rounded-input border border-border-default p-4 sm:flex-row sm:items-start"
            >
              <div className="h-32 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={`Cover of ${book.title}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
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
                      ? book.authors.join(", ")
                      : "Unknown author"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-text-subtle">
                  <span>Status: {book.isRead ? "Read" : "Unread"}</span>
                  <span>Languages: {book.languages.join(", ") || "N/A"}</span>
                  <span>Downloads: {book.downloadCount}</span>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => toggleReadStatus(book.id)}
                  aria-label={`Mark "${book.title}" as ${book.isRead ? "unread" : "read"}`}
                  className="rounded-input border border-border-default px-4 py-2 text-sm transition hover:bg-surface-muted"
                >
                  Mark as {book.isRead ? "unread" : "read"}
                </button>

                <button
                  type="button"
                  onClick={() => removeBook(book.id)}
                  aria-label={`Remove "${book.title}" from library`}
                  className="rounded-input border border-danger-200 px-4 py-2 text-sm text-danger-700 transition hover:bg-danger-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          </ul>

          {totalPages > 1 ? (
            <nav aria-label="Library pagination" className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
                className="rounded-input border border-border-default px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-text-body" aria-live="polite" aria-atomic="true">
                Page {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages}
                className="rounded-input border border-border-default px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};