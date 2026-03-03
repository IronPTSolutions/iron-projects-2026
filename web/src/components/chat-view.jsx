import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { sendMessage } from "../services/api-service";
import MessageBubble from "./message-bubble";

/**
 * Vista del chat activo — panel derecho de la página de mensajería.
 *
 * Responsabilidades:
 * - Muestra el header con avatar y nombre del otro usuario (enlace a su perfil).
 * - Renderiza la lista de mensajes con MessageBubble.
 * - Auto-scroll al último mensaje cuando llegan nuevos.
 * - Input de texto con envío al pulsar Enter (sin Shift).
 * - Estado vacío si no hay conversación seleccionada.
 *
 * @param {{ conversation: object|null, otherUserId: string, onMessageSent: function }} props
 */
export default function ChatView({ conversation, otherUserId, onMessageSent }) {
  const [input, setInput] = useState("");    // Texto del input de mensaje
  const [sending, setSending] = useState(false); // Flag de envío en curso
  const messagesEndRef = useRef(null);       // Ref para auto-scroll al final
  const inputRef = useRef(null);             // Ref para auto-focus del input

  const otherUser = conversation?.user;
  const messages = conversation?.messages || [];

  // Auto-scroll suave al último mensaje cuando cambia la longitud del array
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Focus automático en el input al cambiar de conversación
  useEffect(() => {
    inputRef.current?.focus();
  }, [otherUserId]);

  /** Envía el mensaje al servidor y refresca la lista de mensajes. */
  async function handleSend() {
    const body = input.trim();
    if (!body || sending) return;

    setSending(true);
    try {
      await sendMessage(otherUserId, { body });
      setInput("");
      onMessageSent(); // Refresca las conversaciones en el padre
    } catch (_err) {
      // Error al enviar — silenciado
    } finally {
      setSending(false);
    }
  }

  /** Envía con Enter (sin Shift para permitir saltos de línea). */
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  /** Callback tras eliminar un mensaje — refresca en todos los casos. */
  function handleDeleted(messageId) {
    onMessageSent();
  }

  // Estado sin conversación seleccionada
  if (!otherUserId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className="h-16 w-16 text-slate-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-slate-500 text-sm">
            Selecciona una conversacion para empezar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-b border-slate-700/50">
        <Link
          to={`/users/${otherUserId}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {otherUser?.avatarUrl ? (
            <img
              src={otherUser.avatarUrl}
              alt={otherUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-600/50"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-300 uppercase">
              {otherUser?.name?.charAt(0) || "?"}
            </div>
          )}
          <span className="text-sm font-medium text-white">
            {otherUser?.name || "Usuario"}
          </span>
        </Link>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-500">
              Envia el primer mensaje
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            otherUserId={otherUserId}
            onDeleted={handleDeleted}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 py-4 border-t border-slate-700/50">
        <div className="flex items-end gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-xl border border-slate-700/50 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25 transition-all duration-200"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500 text-white transition-all duration-200 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
