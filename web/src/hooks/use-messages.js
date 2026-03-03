import { useCallback, useEffect, useRef, useState } from "react";
import { getProfile, markMessageAsRead } from "../services/api-service";

/**
 * Hook que gestiona los mensajes del usuario autenticado.
 * Construye las conversaciones agrupadas y hace polling cada 5 segundos.
 */
export default function useMessages() {
  const [conversations, setConversations] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);

  const buildConversations = useCallback((userData) => {
    if (!userData) return;

    const sent = userData.sentMessages || [];
    const received = userData.receivedMessages || [];
    const allMessages = [...sent, ...received];
    const myId = userData.id;

    // Agrupar por "el otro usuario"
    const grouped = {};
    for (const msg of allMessages) {
      const isSender = (msg.sender?.id || msg.sender) === myId;
      const otherUser = isSender ? msg.receiver : msg.sender;
      const otherId = otherUser?.id || otherUser;

      if (!otherId) continue;

      if (!grouped[otherId]) {
        grouped[otherId] = {
          user: otherUser,
          messages: [],
        };
      }
      grouped[otherId].messages.push({
        ...msg,
        isMine: isSender,
      });
    }

    // Ordenar mensajes dentro de cada conversación por createdAt ascendente
    const convList = Object.values(grouped).map((conv) => {
      conv.messages.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
      conv.lastMessage = conv.messages[conv.messages.length - 1];
      conv.unread = conv.messages.filter((m) => !m.isMine && !m.read).length;
      return conv;
    });

    // Ordenar conversaciones por último mensaje (más reciente primero)
    convList.sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt),
    );

    setConversations(convList);

    // Contar total de no leídos
    const total = received.filter((m) => !m.read).length;
    setUnreadCount(total);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const userData = await getProfile();
      buildConversations(userData);
    } catch (_err) {
      // Silenciar errores de polling
    }
  }, [buildConversations]);

  // Fetch inicial y polling
  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 5000);
    return () => clearInterval(intervalRef.current);
  }, [fetchMessages]);

  // Marcar mensajes de una conversación como leídos
  const markAsRead = useCallback(
    async (otherUserId) => {
      if (!conversations) return;
      const conv = conversations.find(
        (c) => (c.user?.id || c.user) === otherUserId,
      );
      if (!conv) return;

      const unreadMessages = conv.messages.filter((m) => !m.isMine && !m.read);

      await Promise.all(
        unreadMessages.map((m) => markMessageAsRead(otherUserId, m.id)),
      );

      if (unreadMessages.length > 0) {
        fetchMessages();
      }
    },
    [conversations, fetchMessages],
  );

  return {
    conversations,
    unreadCount,
    loading: conversations === null,
    refresh: fetchMessages,
    markAsRead,
  };
}
