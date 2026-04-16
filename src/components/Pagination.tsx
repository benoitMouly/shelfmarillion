type PaginationProps = {
  currentPage: number;
  totalPages?: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading?: boolean;
  onGoToPage: (page: number) => void;
  ariaLabel: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
};


export const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  isLoading = false,
  onGoToPage,
  ariaLabel,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  onPageSizeChange,
}: PaginationProps) => {
  const canGoFirst = hasPreviousPage;
  const canGoLast = totalPages !== undefined && currentPage < totalPages;
  const showPageSizeSelector = pageSize !== undefined && onPageSizeChange !== undefined;

  return (
    <nav aria-label={ariaLabel} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {totalPages !== undefined ? (
          <button
            type="button"
            onClick={() => onGoToPage(1)}
            disabled={!canGoFirst || isLoading}
            aria-label="First page"
            className="rounded-input border border-border-default px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            ««
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => onGoToPage(currentPage - 1)}
          disabled={!hasPreviousPage || isLoading}
          className="rounded-input border border-border-default px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-text-body" aria-live="polite" aria-atomic="true">
          Page {currentPage}{totalPages !== undefined ? ` / ${totalPages}` : ""}
        </span>

        <button
          type="button"
          onClick={() => onGoToPage(currentPage + 1)}
          disabled={!hasNextPage || isLoading}
          className="rounded-input border border-border-default px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
{/* visible uniquement si totalPages est connu */}
        {totalPages !== undefined ? (
          <button
            type="button"
            onClick={() => onGoToPage(totalPages)}
            disabled={!canGoLast || isLoading}
            aria-label="Last page"
            className="rounded-input border border-border-default px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            »»
          </button>
        ) : null}
      </div>

      {showPageSizeSelector ? (
        <div className="flex items-center gap-2">
          <label htmlFor="page-size-select" className="text-sm text-text-subtle">
            Results per page
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-input border border-border-input px-2 py-1 text-sm outline-none transition focus:border-border-focus"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </nav>
  );
};
