/**
 * Tarjeta de proyecto reutilizable.
 *
 * Muestra la información básica de un proyecto:
 * - Título y badge del módulo (1, 2 o 3).
 * - Promoción del autor.
 * - Email del autor con icono de usuario.
 * - Botones de enlace a GitHub y URL en producción.
 *
 * Usa efecto hover con borde indigo para indicar interactividad.
 */
export default function ProjectCard({ project }) {
  return (
    <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-black/20 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-500/5">
      {/* Header: title + module badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white truncate">
          {project.title}
        </h3>
        {project.module && (
          <span className="shrink-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-400">
            {project.module}
          </span>
        )}
      </div>

      {/* Promotion */}
      {project.promotion && (
        <p className="text-sm text-slate-400 mb-4">{project.promotion}</p>
      )}

      {/* Author */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-700/60 border border-slate-600/40">
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <span className="text-sm text-slate-400 truncate">
          {project.author?.email}
        </span>
      </div>

      {/* Links */}
      <div className="flex items-center gap-3">
        {project.githubRepo && (
          <a
            href={project.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-400"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-400 hover:shadow-indigo-500/40 active:scale-[0.98]"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Live
          </a>
        )}
      </div>
    </div>
  );
}
