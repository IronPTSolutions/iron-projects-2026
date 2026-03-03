/**
 * Componente de filtros para la lista de proyectos en la página Home.
 *
 * Filtros disponibles:
 * - Módulo (select): 1, 2, 3 o "All".
 * - Promoción (select): distintas convocatorias disponibles.
 * - Autor (input text): búsqueda por nombre con debounce en el hook useProjects.
 * - Botón Clear: resetea todos los filtros a vacío.
 *
 * Los filtros se gestionan como estado controlado desde el componente padre (HomePage)
 * y se pasan como props junto con su setter.
 *
 * @param {{ filters: object, setFilters: function }} props
 */
export function ProjectsFilters({ filters, setFilters }) {
  const selectClasses =
    "w-full appearance-none rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl px-4 py-2.5 text-sm text-slate-200 shadow-sm transition-all duration-200 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-600";

  return (
    <div className="mb-8 rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-5 shadow-lg shadow-black/10">
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        {/* Module */}
        <div className="w-full sm:w-auto sm:min-w-35">
          <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Module
          </label>
          <select
            name="module"
            className={selectClasses}
            value={filters.module}
            onChange={(e) => setFilters({ ...filters, module: e.target.value })}
          >
            <option value="">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        {/* Promotion */}
        <div className="w-full sm:w-auto sm:min-w-40">
          <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Promotion
          </label>
          <select
            name="promotion"
            className={selectClasses}
            value={filters.promotion}
            onChange={(e) =>
              setFilters({ ...filters, promotion: e.target.value })
            }
          >
            <option value="">All</option>
            <option value="01.2024">01.2024</option>
            <option value="02.2024">02.2024</option>
            <option value="03.2024">03.2024</option>
            <option value="01.2025">01.2025</option>
            <option value="02.2025">02.2025</option>
          </select>
        </div>

        {/* Author */}
        <div className="w-full sm:flex-1">
          <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">
            Author
          </label>
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              name="author"
              type="text"
              placeholder="Search by author…"
              className="w-full rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 shadow-sm transition-all duration-200 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 hover:border-slate-600"
              value={filters.author}
              onChange={(e) =>
                setFilters({ ...filters, author: e.target.value })
              }
            />
          </div>
        </div>

        <button
          className="shrink-0 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-sm text-slate-300 transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:self-end"
          onClick={() => {
            setFilters({ module: "", promotion: "", author: "" });
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
