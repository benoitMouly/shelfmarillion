import { NavLink, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export const Layout = () => {
  return (
    <main className="min-h-screen bg-surface-page px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <AppHeader
          title="ShelfMarillion"
          subtitle="Search books from Gutendex and manage your local library."
        />
        <nav aria-label="Main navigation" className="flex gap-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-input border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-primary-900 bg-primary-900 text-white"
                  : "border-border-default text-text-heading hover:bg-surface-muted"
              }`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `rounded-input border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-primary-900 bg-primary-900 text-white"
                  : "border-border-default text-text-heading hover:bg-surface-muted"
              }`
            }
          >
            My library
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </main>
  );
};
