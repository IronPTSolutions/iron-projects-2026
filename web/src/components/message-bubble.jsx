import { useState } from "react";
import { deleteMessage } from "../services/api-service";

/**
 * Burbuja de mensaje individual dentro del chat.
 *
 * Características:
 * - Alineación: mensajes propios a la derecha (fondo indigo), ajenos a la izquierda (fondo slate).
 * - Timestamp formateado (HH:MM).
 * - Botón de eliminar (solo visible al hacer hover si el mensaje es propio y no leído).
 * - Popover de confirmación antes de eliminar.
 *
 * @param {{ message: object, otherUserId: string, onDeleted: function }} props
 */
export default function MessageBubble({ message, otherUserId, onDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false); // Muestra popover de confirmación
  const [hovering, setHovering] = useState(false);        // Controla visibilidad del botón eliminar

  // Formatea la hora del mensaje (ej: "14:30")
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Solo se puede eliminar un mensaje propio que no ha sido leído por el destinatario
  const canDelete = message.isMine && !message.read;

  /** Elimina el mensaje del servidor y notifica al padre. */
  async function handleDelete() {
    try {
      await deleteMessage(otherUserId, message.id);
      onDeleted(message.id);
    } catch (_err) {
      onDeleted(null); // Signal to refresh on error
    }
    setShowConfirm(false);
  }

  return (
    <div
      className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setShowConfirm(false);
      }}
    >
      <div className="relative max-w-[70%] group">
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            message.isMine
              ? "bg-indigo-500/20 border border-indigo-500/30"
              : "bg-slate-700/50 border border-slate-600/30"
          }`}
        >
          <p className="text-sm text-slate-200 whitespace-pre-wrap break-words">
            {message.body}
          </p>
          <p
            className={`text-[10px] mt-1 ${
              message.isMine ? "text-indigo-400/60" : "text-slate-500"
            }`}
          >
            {time}
          </p>
        </div>

        {/* Botón eliminar */}
        {canDelete && hovering && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className={`absolute top-1 ${
              message.isMine ? "-left-8" : "-right-8"
            } p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        )}

        {/* Confirmación de eliminación */}
        {showConfirm && (
          <div
            className={`absolute top-0 ${
              message.isMine ? "-left-44" : "-right-44"
            } bg-slate-800 border border-slate-700/50 rounded-xl p-3 shadow-2xl shadow-black/30 z-10`}
          >
            <p className="text-xs text-slate-300 mb-2">Eliminar mensaje?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="px-2.5 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors cursor-pointer"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2.5 py-1 text-xs bg-slate-700/50 text-slate-400 border border-slate-600/30 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
