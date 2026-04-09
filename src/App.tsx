import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { GutendexSearchProvider } from "./contexts/fetched-books.provider";
import { LibraryProvider } from "./contexts/my-books-provider";
import { GutendexSearchSection } from "./features/books/components/GutendexSearchSection";
import { LibrarySection } from "./features/books/components/LibrarySection";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <GutendexSearchSection /> },
      { path: "library", element: <LibrarySection /> },
    ],
  },
]);

function App() {
  return (
    <LibraryProvider>
      <GutendexSearchProvider>
        <RouterProvider router={router} />
      </GutendexSearchProvider>
    </LibraryProvider>
  );
}

export default App;