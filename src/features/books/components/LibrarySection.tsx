import { ConfirmButton } from "../../../components/ConfirmButton";
import { Pagination } from "../../../components/Pagination";
import { SectionHeader } from "../../../components/SectionHeader";
import { useLibraryContext } from "../../../contexts/my-books-provider";
import type { ReadFilter } from "../types/library-filter.type";
import { LibraryBookCard } from "./LibraryBookCard";

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
    pageSize,
    setLibrarySearchTerm,
    setReadFilter,
    setPageSize,
    toggleReadStatus,
    removeBook,
    clearLibrary,
    goToPage,
  } = useLibraryContext();
  return (
    // aria-labelledby : associe la section à son h2 pour la navigation par landmarks (WCAG 1.3.1)
    <section aria-labelledby="library-section-title" className="rounded-card border border-border-default bg-surface-card p-6 shadow-card">
      <SectionHeader
        titleId="library-section-title"
        title="My library"
        subtitle={`${books.length} book${books.length > 1 ? "s" : ""} in your library`}
      >
        <ConfirmButton
          label="Clear library"
          onConfirm={clearLibrary}
          disabled={books.length === 0}
        />
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
              <LibraryBookCard
                key={book.id}
                book={book}
                onToggleRead={toggleReadStatus}
                onRemove={removeBook}
              />
          ))}
          </ul>

          {totalPages > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={currentPage < totalPages}
              hasPreviousPage={currentPage > 1}
              onGoToPage={goToPage}
              ariaLabel="Library pagination"
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
};