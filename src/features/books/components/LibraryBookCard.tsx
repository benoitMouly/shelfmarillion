import { ConfirmButton } from "../../../components/ConfirmButton";
import type { LibraryBook } from "../types/library-book.type";

type LibraryBookCardProps = {
  book: LibraryBook;
  onToggleRead: (bookId: number) => void;
  onRemove: (bookId: number) => void;
};

export const LibraryBookCard = ({
  book,
  onToggleRead,
  onRemove,
}: LibraryBookCardProps) => {
  return (
    <li className="flex flex-col gap-4 rounded-input border border-border-default p-4 sm:flex-row sm:items-start">
      <div className="h-32 w-24 shrink-0 overflow-hidden rounded-md bg-surface-muted">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-xs text-text-muted"
          >
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
          onClick={() => onToggleRead(book.id)}
          aria-label={`Mark "${book.title}" as ${book.isRead ? "unread" : "read"}`}
          className="rounded-input border border-border-default px-4 py-2 text-sm transition hover:bg-surface-muted"
        >
          Mark as {book.isRead ? "unread" : "read"}
        </button>

        <ConfirmButton
          label="Remove"
          onConfirm={() => onRemove(book.id)}
          ariaLabel={`Remove "${book.title}" from library`}
        />
      </div>
    </li>
  );
};
