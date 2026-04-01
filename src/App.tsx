import { AppHeader } from "./components/AppHeader";
import { GutendexSearchSection } from "./features/books/components/GutendexSearchSection";
import { LibrarySection } from "./features/books/components/LibrarySection";
import { useGutendexSearch } from "./features/books/hooks/useGutendexSearch";
import { useLibrary } from "./features/books/hooks/useLibrary";
import { mapGutendexBookToLibraryBook } from "./features/books/utils/map-gutendex-book";

function App() {
  const library = useLibrary();
  const gutendexSearch = useGutendexSearch();

  const handleAddBook = (gutendexBook: Parameters<typeof mapGutendexBookToLibraryBook>[0]) => {
    const mappedBook = mapGutendexBookToLibraryBook(gutendexBook);
    return library.addBook(mappedBook);
  };

  return (
    <main className="min-h-screen bg-surface-page px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppHeader
          title="ShelfMarillion"
          subtitle="Search books from Gutendex and manage your local library."
        />

        <GutendexSearchSection
          apiSearchTerm={gutendexSearch.apiSearchTerm}
          results={gutendexSearch.results}
          isLoading={gutendexSearch.isLoading}
          hasSearched={gutendexSearch.hasSearched}
          errorMessage={gutendexSearch.errorMessage}
          currentPage={gutendexSearch.currentPage}
          hasNextPage={gutendexSearch.hasNextPage}
          hasPreviousPage={gutendexSearch.hasPreviousPage}
          setApiSearchTerm={gutendexSearch.setApiSearchTerm}
          searchBooks={gutendexSearch.searchBooks}
          goToNextPage={gutendexSearch.goToNextPage}
          goToPreviousPage={gutendexSearch.goToPreviousPage}
          onAddBook={handleAddBook}
          libraryBookIds={new Set(library.books.map((book) => book.id))}
        />

        <LibrarySection
          books={library.books}
          filteredBooks={library.filteredBooks}
          paginatedBooks={library.paginatedBooks}
          librarySearchTerm={library.librarySearchTerm}
          readFilter={library.readFilter}
          currentPage={library.currentPage}
          totalPages={library.totalPages}
          setLibrarySearchTerm={library.setLibrarySearchTerm}
          setReadFilter={library.setReadFilter}
          toggleReadStatus={library.toggleReadStatus}
          removeBook={library.removeBook}
          clearLibrary={library.clearLibrary}
          goToNextPage={library.goToNextPage}
          goToPreviousPage={library.goToPreviousPage}
        />
      </div>
    </main>
  );
}

export default App;