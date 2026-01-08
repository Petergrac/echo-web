import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/lib/hooks/useChat";
import { Conversation } from "@/stores/chat-store";
import { formatDistanceToNow } from "date-fns";

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected?: boolean;
}

export function ConversationListItem({
  conversation,
  isSelected,
}: ConversationListItemProps) {
  const { selectConversation, isUserOnline } = useChat();

  const getDisplayName = () => {
    if (conversation.name) return conversation.name;

    //* For direct messages, show other participant's name
    if (
      conversation.type === "DIRECT" &&
      conversation.participants.length > 0
    ) {
      const otherParticipant = conversation.participants[0]; // You'll need to filter current user
      return otherParticipant.username;
    }

    return "Unknown";
  };

  const getAvatar = () => {
    if (conversation.avatar) return conversation.avatar;

    if (
      conversation.type === "DIRECT" &&
      conversation.participants.length > 0
    ) {
      const otherParticipant = conversation.participants[0];
      return otherParticipant.avatar;
    }

    return undefined;
  };

  const getOnlineStatus = () => {
    if (
      conversation.type === "DIRECT" &&
      conversation.participants.length > 0
    ) {
      const otherParticipant = conversation.participants[0];
      return isUserOnline(otherParticipant.id);
    }
    return false;
  };

  return (
    <div
      className={`flex items-center p-4 hover:bg-accent cursor-pointer transition-colors ${
        isSelected ? "bg-accent" : ""
      }`}
      onClick={() => selectConversation(conversation)}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={getAvatar()} alt={getDisplayName()} />
          <AvatarFallback>
            {getDisplayName().charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {getOnlineStatus() && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-semibold truncate">{getDisplayName()}</p>
          {conversation.lastMessageAt && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(conversation.lastMessageAt), {
                addSuffix: true,
              })}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-muted-foreground truncate">
            {conversation.lastMessage?.content || "No messages yet"}
          </p>

          {conversation.unreadCount > 0 && (
            <Badge variant="default" className="ml-2">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
