import { Link } from "react-router-dom";
import StarRating from "./start-rating";
import { useAuth } from "../contexts/auth-context";
import { deleteReview } from "../services/api-service";

/**
 * Tarjeta de review individual dentro de la página de detalle de proyecto.
 *
 * Muestra:
 * - Avatar y nombre del autor (enlace a su perfil) con su promoción.
 * - Rating con estrellas (StarRating).
 * - Texto del comentario.
 * - Botón de eliminar (solo visible si el usuario autenticado es el autor de la review).
 * - Fecha de creación formateada.
 *
 * @param {{ review: object, reloadProject: function }} props
 */
export default function ProjectReview({ review, reloadProject }) {
  const { user } = useAuth();

  return (
    <div
      key={review.id}
      className="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-5 shadow-lg shadow-black/10"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <img
          src={review.author?.avatarUrl}
          alt={review.author?.name}
          className="w-10 h-10 rounded-full border border-slate-600/40 object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">
          {/* Author info + rating */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-sm font-medium text-white">
                <Link to={`/users/${review.author.id}`}>
                  {review.author?.name}
                </Link>
              </span>
              <span className="ml-2 text-xs text-slate-500">
                {review.author?.promotion}
              </span>
            </div>
            <StarRating rating={review.rating} />
          </div>

          {/* Comment */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {review.comment}
          </p>

          {review.author.id === user.id && (
            <button
              onClick={async () => {
                await deleteReview(review.project, review.id);
                await reloadProject();
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/30 active:scale-[0.97]"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </button>
          )}

          {/* Date */}
          <p className="mt-2 text-xs text-slate-500">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
