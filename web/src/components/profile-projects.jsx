import { Link } from "react-router-dom";
import { deleteProject } from "../services/api-service";
import { useAuth } from "../contexts/auth-context";

/**
 * Componente que muestra los proyectos del usuario organizados por módulo (1, 2, 3).
 *
 * Características:
 * - Agrupa los proyectos del usuario en 3 columnas, una por módulo.
 * - Cada proyecto muestra su título, enlaces a GitHub/Live y un botón de eliminar.
 * - Si un módulo no tiene proyecto, muestra un placeholder con enlace para crear uno.
 * - Al eliminar un proyecto, actualiza el estado global del usuario sin recargar la página.
 */
const MODULES = [1, 2, 3];

export default function ProfileProjects({ projects = [] }) {
  const { user, reloadUser } = useAuth();

  // Agrupa los proyectos por módulo usando reduce
  const projectsByModule = MODULES.reduce((acc, mod) => {
    acc[mod] = projects.filter((p) => p.module === mod);
    return acc;
  }, {});

  /**
   * Elimina un proyecto tras confirmación del usuario.
   * Actualiza el estado global filtrando el proyecto eliminado.
   */
  async function onDeleteProject(id) {
    if (!confirm("Are you sure?")) {
      return;
    }

    await deleteProject(id);

    // Actualiza el estado del usuario eliminando el proyecto del array local
    reloadUser({
      ...user,
      projects: user.projects.filter((p) => p.id !== id),
    });
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">My Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MODULES.map((mod) => (
          <div key={mod} className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Module {mod}
            </h3>
            {projectsByModule[mod].length > 0 ? (
              projectsByModule[mod].map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:border-indigo-500/30"
                >
                  <h4 className="text-base font-semibold text-white truncate mb-3">
                    {project.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    {project.githubRepo && (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-1.5 text-xs text-slate-300 transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-400"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
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
                        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:bg-indigo-400 active:scale-[0.98]"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
                    <button
                      type="button"
                      onClick={() => onDeleteProject(project.id)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/20 cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <Link
                to="/projects/new"
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-700/50 bg-slate-800/20 p-8 text-slate-500 transition-all duration-200 hover:border-indigo-500/30 hover:text-indigo-400 hover:bg-slate-800/40"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="text-sm font-medium">Add project</span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
