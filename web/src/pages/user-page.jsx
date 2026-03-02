import { Link } from "react-router-dom";
import ProjectCard from "../components/project-card";
import useUser from "../hooks/user-user";

export default function UserPage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-48 rounded-2xl bg-slate-800/50" />
        <div className="h-40 rounded-2xl bg-slate-800/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Profile Card ── */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-32 h-32 rounded-2xl object-cover border-2 border-slate-700/50 shadow-lg"
            />
            {user.promotion && (
              <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-400">
                {user.promotion}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-5">
            {/* Name & email */}
            <div>
              <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
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
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                {user.email}
              </div>
            </div>

            {/* Location */}
            {user.location && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
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
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {user.location}
              </div>
            )}

            {/* Bio */}
            {user.bio && (
              <p className="text-sm text-slate-300 leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Languages */}
            {user.languages?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
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
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                    />
                  </svg>
                  Languages
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-lg bg-slate-700/50 border border-slate-600/30 px-2.5 py-1 text-xs font-medium text-slate-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            <div className="flex items-center gap-3 pt-1">
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-400"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-400"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>

            {/* Member since */}
            {user.createdAt && (
              <p className="text-xs text-slate-500">
                Member since{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Projects section ── */}
      {user.projects?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            {user.name?.split(" ")[0]}&apos;s Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.projects.map((project) => (
              <Link to={`/projects/${project.id}`} key={project.id}>
                <ProjectCard project={{ ...project, author: user }} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
