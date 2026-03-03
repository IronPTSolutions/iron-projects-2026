import { Link } from "react-router-dom";

/**
 * Tarjeta reutilizable con la información del autor de un proyecto.
 *
 * Muestra:
 * - Avatar del autor con borde redondeado.
 * - Nombre (enlace a su perfil público /users/:id) y email.
 * - Badges de ubicación y promoción.
 * - Bio del autor.
 * - Tags de idiomas/tecnologías.
 * - Iconos con enlaces a GitHub y LinkedIn.
 *
 * @param {{ author: object }} props - Objeto autor con avatarUrl, name, email, etc.
 */
export default function ProjectAuthorCard({ author }) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-6 shadow-lg shadow-black/10">
      <h2 className="text-lg font-semibold text-white mb-4">Author</h2>

      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        {author.avatarUrl && (
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-16 h-16 rounded-full border-2 border-slate-600/40 object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0 space-y-3">
          {/* Name + promotion */}
          <div>
            <p className="text-base font-medium text-white">
              <Link to={`/users/${author.id}`}>{author.name}</Link>
            </p>
            <p className="text-sm text-slate-400">{author.email}</p>
          </div>

          {/* Location + promotion badges */}
          <div className="flex flex-wrap items-center gap-2">
            {author.location && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-700/40 border border-slate-600/30 px-2.5 py-1 text-xs font-medium text-slate-400">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {author.location}
              </span>
            )}
            {author.promotion && (
              <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-400">
                {author.promotion}
              </span>
            )}
          </div>

          {/* Bio */}
          {author.bio && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {author.bio}
            </p>
          )}

          {/* Languages */}
          {author.languages?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {author.languages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-md bg-slate-700/50 border border-slate-600/30 px-2 py-0.5 text-xs text-slate-300"
                >
                  {lang}
                </span>
              ))}
            </div>
          )}

          {/* Social links */}
          <div className="flex items-center gap-3 pt-1">
            {author.githubUrl && (
              <a
                href={author.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-indigo-400"
                title="GitHub"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            )}
            {author.linkedinUrl && (
              <a
                href={author.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-indigo-400"
                title="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
