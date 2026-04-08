import { AppHeader } from "./components/AppHeader";
import { GutendexSearchProvider } from "./contexts/fetched-books.provider";
import { LibraryProvider } from "./contexts/my-books-provider";
import { GutendexSearchSection } from "./features/books/components/GutendexSearchSection";
import { LibrarySection } from "./features/books/components/LibrarySection";


// AVANT sans context: App instanciait les hooks useLibrary() et useGutendexSearch()
// puis transmettait chacune de leurs valeurs en props aux composants
// enfants (presqe 30 props au total). Chaque ajout de donnée obligeait
// à modifier App, le type props ET le composant enfant.
//
// APRÈS avec context: les Providers encapsulent les hooks et injectent les données
// dans le contexte React. Les composants enfants consomment directement
// le contexte via useLibraryContext() et useGutendexSearchContext().
// App n'a plus qu'à structurer le layout et empiler les Providers.
//
// L'ordre des Providers compte :
//  - LibraryProvider est au-dessus car GutendexSearchSection a besoin
//    des DEUX contextes (recherche + bibliothèque pour "Add to library").
//  - GutendexSearchProvider est en dessous, plus proche des composants
//    qui le consomment.

function App() {
  return (
    <LibraryProvider>
      <GutendexSearchProvider>
        <main className="min-h-screen bg-surface-page px-4 py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <AppHeader
              title="ShelfMarillion"
              subtitle="Search books from Gutendex and manage your local library."
            />

            <GutendexSearchSection />
            <LibrarySection />
          </div>
        </main>
      </GutendexSearchProvider>
    </LibraryProvider>
  );
}

export default App;