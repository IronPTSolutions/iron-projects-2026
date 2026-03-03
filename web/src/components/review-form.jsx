import { useState } from "react";
import { createReview } from "../services/api-service";

/**
 * Formulario para añadir una review a un proyecto.
 *
 * Comportamiento:
 * - Botón toggle "Write Review" / "Cancel" para mostrar/ocultar el formulario.
 * - Selector de estrellas interactivo (1-5) con efecto hover.
 * - Al seleccionar rating > 0, aparece un textarea para el comentario.
 * - Se envía pulsando Enter dentro del textarea.
 * - Tras enviar, resetea el formulario y recarga el proyecto (reloadProject).
 *
 * @param {{ project: object, reloadProject: function }} props
 */
export default function ReviewForm({ project, reloadProject }) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 backdrop-blur-xl p-6 shadow-lg shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Add a Review</h2>
        <button
          onClick={() => setShowAddReview(!showAddReview)}
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
              d={showAddReview ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}
            />
          </svg>
          {showAddReview ? "Cancel" : "Write Review"}
        </button>
      </div>

      {showAddReview && (
        <div className="space-y-4">
          {/* Star rating selector */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-0.5 transition-transform duration-150 hover:scale-110"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <svg
                    className={`w-6 h-6 transition-colors duration-150 ${
                      star <= (hoverRating || rating)
                        ? "text-amber-400"
                        : "text-slate-600"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm text-slate-400">
                {hoverRating || rating}/5
              </span>
            </div>
          </div>

          {/* Comment textarea */}

          {rating > 0 && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Comment
              </label>
              <textarea
                rows={3}
                placeholder="Share your thoughts about this project..."
                className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 resize-none"
                onKeyUp={async (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    await createReview(project.id, {
                      rating,
                      comment: e.target.value,
                    });

                    e.target.value = "";
                    setRating(0);

                    await reloadProject();
                  }
                }}
              ></textarea>
              <p className="mt-1.5 text-xs text-slate-500">
                Press Enter to submit your review
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
