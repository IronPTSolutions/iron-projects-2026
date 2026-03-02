import { Link } from "react-router-dom";
import StarRating from "./start-rating";

export default function ProjectReview({ review }) {
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
