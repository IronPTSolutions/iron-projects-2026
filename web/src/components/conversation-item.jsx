/**
 * Formatea una fecha como texto relativo ("ahora", "hace 5m", "ayer", etc.).
 * Útil para mostrar timestamps compactos en la lista de conversaciones.
 */
function formatRelativeDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "ahora";
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays === 1) return "ayer";
  if (diffDays < 7) return `hace ${diffDays}d`;
  return date.toLocaleDateString();
}

/**
 * Item individual de la lista de conversaciones.
 *
 * Muestra:
 * - Avatar del otro usuario (imagen o inicial).
 * - Nombre del usuario y timestamp relativo del último mensaje.
 * - Preview del último mensaje (truncado a 50 caracteres).
 * - Badge con el contador de mensajes no leídos (si > 0).
 * - Estilo seleccionado con borde indigo a la izquierda.
 *
 * @param {{ conversation: object, isSelected: boolean, onClick: function }} props
 */
export default function ConversationItem({ conversation, isSelected, onClick }) {
  const { user, lastMessage, unread } = conversation;
  const preview =
    lastMessage?.body?.length > 50
      ? lastMessage.body.slice(0, 50) + "..."
      : lastMessage?.body;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-slate-700/50 border-l-2 border-indigo-500"
          : "hover:bg-slate-800/50 border-l-2 border-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-600/50"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300 uppercase">
            {user?.name?.charAt(0) || "?"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-white truncate">
            {user?.name || "Usuario"}
          </p>
          {lastMessage && (
            <span className="text-[10px] text-slate-500 shrink-0 ml-2">
              {formatRelativeDate(lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-slate-400 truncate">{preview}</p>
          {unread > 0 && (
            <span className="shrink-0 ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white px-1.5">
              {unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
