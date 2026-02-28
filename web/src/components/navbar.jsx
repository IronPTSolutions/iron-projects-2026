import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

/**
 * Barra de navegación principal.
 *
 * Características:
 * - Sticky en la parte superior con efecto glassmorphism (backdrop-blur).
 * - Logo "IronProjects" con enlace al home.
 * - Links de navegación (Home, Projects) — ocultos en mobile.
 * - Menú de usuario (dropdown) con avatar, info, enlace al perfil y logout.
 * - Responsive: menú hamburguesa en pantallas pequeñas.
 *
 * Utiliza la misma paleta de colores (slate + indigo) que el resto de la app.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const { user, userLogout } = useAuth(); // Datos del usuario autenticado
  const [menuOpen, setMenuOpen] = useState(false); // Controla el dropdown / menú mobile

  /** Cierra la sesión en el servidor y redirige al login. */
  const handleLogout = async () => {
    await userLogout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 transition-colors group-hover:bg-indigo-500/20">
              <svg
                className="h-5 w-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-6 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm12-5H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Iron<span className="text-indigo-400">Projects</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1"></div>

          {/* Right side: User menu */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 transition-colors hover:border-slate-600 hover:bg-slate-800 cursor-pointer"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-300 uppercase">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-300 max-w-30 truncate">
                    {user.name || user.email}
                  </span>
                  <svg
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-slate-700/50 bg-slate-800/95 backdrop-blur-xl p-1.5 shadow-2xl shadow-black/30">
                      {/* User Info */}
                      <div className="px-3 py-2.5 border-b border-slate-700/50 mb-1.5">
                        <p className="text-sm font-medium text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white"
                      >
                        <svg
                          className="h-4 w-4 text-slate-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-slate-700/50 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 py-3">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/projects"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
            >
              Projects
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
