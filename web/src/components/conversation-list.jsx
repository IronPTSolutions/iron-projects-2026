import ConversationItem from "./conversation-item";

/**
 * Lista de conversaciones — panel izquierdo de la página de chat.
 *
 * Renderiza un ConversationItem por cada conversación.
 * Si no hay conversaciones, muestra un mensaje de estado vacío.
 *
 * @param {{ conversations: array, selectedUserId: string, onSelect: function }} props
 */
export default function ConversationList({
  conversations,
  selectedUserId,
  onSelect,
}) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full px-6">
        <p className="text-sm text-slate-500 text-center">
          No tienes conversaciones aun
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      {conversations.map((conv) => {
        const userId = conv.user?.id || conv.user;
        return (
          <ConversationItem
            key={userId}
            conversation={conv}
            isSelected={userId === selectedUserId}
            onClick={() => onSelect(userId)}
          />
        );
      })}
    </div>
  );
}
