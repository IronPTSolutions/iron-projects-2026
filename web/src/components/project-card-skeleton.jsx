/**
 * Skeleton placeholder que imita la estructura de ProjectCard.
 * Se muestra mientras los proyectos están cargando.
 */
export default function ProjectCardSkeleton() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-black/20 animate-pulse">
      {/* Header: title + module badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="h-5 w-3/5 rounded-lg bg-slate-700/60" />
        <div className="h-7 w-10 shrink-0 rounded-lg bg-slate-700/60" />
      </div>

      {/* Promotion */}
      <div className="h-4 w-1/4 rounded-md bg-slate-700/40 mb-4" />

      {/* Author */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-full bg-slate-700/60" />
        <div className="h-4 w-2/5 rounded-md bg-slate-700/40" />
      </div>

      {/* Links */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-24 rounded-xl bg-slate-700/40" />
        <div className="h-9 w-20 rounded-xl bg-indigo-500/10" />
      </div>
    </div>
  );
}
