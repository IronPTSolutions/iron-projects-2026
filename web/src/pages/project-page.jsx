import ProjectAuthorCard from "../components/project-author-card";
import ProjectReview from "../components/project-review";
import useProject from "../hooks/use-project";

/** Calcula la media de ratings de las reviews. */
function averageRating(reviews) {
  if (!reviews?.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

function ProjectPage() {
  const { project, loading } = useProject();

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-2/3 rounded-lg bg-slate-700/60" />
        <div className="h-64 rounded-2xl bg-slate-800/50" />
        <div className="h-40 rounded-2xl bg-slate-800/50" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Hero section ── */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-6 sm:p-8 shadow-lg shadow-black/10">
        {/* Header: title + badges */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {project.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {project.module && (
                <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-400">
                  Module {project.module}
                </span>
              )}
              {project.promotion && (
                <span className="rounded-lg bg-slate-700/40 border border-slate-600/30 px-2.5 py-1 text-xs font-medium text-slate-400">
                  {project.promotion}
                </span>
              )}
              {project.reviews?.length > 0 && (
                <span className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-400">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {averageRating(project.reviews)} ({project.reviews.length})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Image gallery */}
        {project.images?.length > 0 && (
          <div className="mb-6 overflow-hidden rounded-xl border border-slate-700/50">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        {/* Description */}
        {project.description && (
          <p className="text-slate-300 leading-relaxed mb-6">
            {project.description}
          </p>
        )}

        {/* Action links */}
        <div className="flex flex-wrap items-center gap-3">
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

      {/* ── Author section ── */}
      <ProjectAuthorCard author={project.author} />

      {/* ── Reviews section ── */}
      {project.reviews?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Reviews
            <span className="ml-2 text-sm font-normal text-slate-400">
              ({project.reviews.length})
            </span>
          </h2>

          <div className="space-y-4">
            {project.reviews.map((review) => (
              <ProjectReview review={review} key={review.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
