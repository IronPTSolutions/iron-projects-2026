import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConversationList from "../components/conversation-list";
import ChatView from "../components/chat-view";
import useMessages from "../hooks/use-messages";

/**
 * Página de chat / mensajería (rutas `/chat` y `/chat/:userId`).
 *
 * Layout de dos paneles:
 * - Panel izquierdo: lista de conversaciones (ConversationList).
 * - Panel derecho: vista del chat activo (ChatView).
 *
 * Usa el hook `useMessages()` que hace polling cada 5s para actualizar
 * las conversaciones. Al abrir una conversación, marca los mensajes
 * no leídos como leídos automáticamente.
 */
export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { conversations, loading, refresh, markAsRead } = useMessages();

  // Conversación activa
  const activeConversation = useMemo(() => {
    if (!conversations || !userId) return null;
    return conversations.find((c) => (c.user?.id || c.user) === userId) || null;
  }, [conversations, userId]);

  // Marcar como leídos al abrir una conversación
  useEffect(() => {
    if (userId && activeConversation?.unread > 0) {
      markAsRead(userId);
    }
  }, [userId, activeConversation?.unread, markAsRead]);

  function handleSelectConversation(id) {
    navigate(`/chat/${id}`);
  }

  if (loading) {
    return (
      <div className="animate-pulse flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-8" style={{ height: "calc(100vh - 64px)" }}>
        <div className="w-80 shrink-0 bg-slate-800/30" />
        <div className="flex-1 bg-slate-800/20" />
      </div>
    );
  }

  return (
    <div
      className="flex -mx-4 sm:-mx-6 lg:-mx-8 -my-8 border-t border-slate-700/50"
      style={{ height: "calc(100vh - 64px)" }}
    >
      {/* Panel izquierdo — conversaciones */}
      <div className="w-80 shrink-0 border-r border-slate-700/50 bg-slate-900/50">
        <div className="px-4 py-4 border-b border-slate-700/50">
          <h2 className="text-sm font-semibold text-white">Mensajes</h2>
        </div>
        <ConversationList
          conversations={conversations}
          selectedUserId={userId}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* Panel derecho — chat activo */}
      <div className="flex-1 bg-slate-900/30">
        <ChatView
          conversation={activeConversation}
          otherUserId={userId}
          onMessageSent={refresh}
        />
      </div>
    </div>
  );
}
