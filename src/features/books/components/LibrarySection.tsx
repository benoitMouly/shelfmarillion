import { SectionHeader } from "../../../components/SectionHeader";
import type { LibraryBook } from "../types/library-book.type";
import type { ReadFilter } from "../types/library-filter.type";

type LibrarySectionProps = {
  books: LibraryBook[];
  filteredBooks: LibraryBook[];
  librarySearchTerm: string;
  readFilter: ReadFilter;
  setLibrarySearchTerm: (value: string) => void;
  setReadFilter: (value: ReadFilter) => void;
  toggleReadStatus: (bookId: number) => void;
  removeBook: (bookId: number) => void;
  clearLibrary: () => void;
};

export const LibrarySection = ({
  books,
  filteredBooks,
  librarySearchTerm,
  readFilter,
  setLibrarySearchTerm,
  setReadFilter,
  toggleReadStatus,
  removeBook,
  clearLibrary,
}: LibrarySectionProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionHeader
        title="My library"
        subtitle={`${books.length} book${books.length > 1 ? "s" : ""} in your library`}
      >
        <button
          type="button"
          onClick={clearLibrary}
          disabled={books.length === 0}
          className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear library
        </button>
      </SectionHeader>

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <div>
          <label
            htmlFor="library-search"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Search in my library
          </label>
          <input
            id="library-search"
            type="text"
            value={librarySearchTerm}
            onChange={(event) => setLibrarySearchTerm(event.target.value)}
            placeholder="Search by title or author"
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-slate-500"
          />
        </div>

        <div>
          <label
            htmlFor="read-filter"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="read-filter"
            value={readFilter}
            onChange={(event) => setReadFilter(event.target.value as ReadFilter)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm outline-none transition focus:border-slate-500"
          >
            <option value="all">All</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
        </div>
      </div>

      {books.length === 0 ? (
        <p className="text-sm text-slate-500">
          Your library is empty. Add books from Gutendex.
        </p>
      ) : null}

      {books.length > 0 && filteredBooks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No books match your current search or filter.
        </p>
      ) : null}

      {filteredBooks.length > 0 ? (
        <ul className="grid gap-4">
          {filteredBooks.map((book) => (
            <li
              key={book.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-start"
            >
              <div className="h-32 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
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
                      ? book.authors.join(", ")
                      : "Unknown author"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                  <span>Status: {book.isRead ? "Read" : "Unread"}</span>
                  <span>Languages: {book.languages.join(", ") || "N/A"}</span>
                  <span>Downloads: {book.downloadCount}</span>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => toggleReadStatus(book.id)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm transition hover:bg-slate-100"
                >
                  Mark as {book.isRead ? "unread" : "read"}
                </button>

                <button
                  type="button"
                  onClick={() => removeBook(book.id)}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm text-red-700 transition hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};