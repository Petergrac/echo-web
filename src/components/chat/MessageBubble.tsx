import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreVertical, Reply, ThumbsUp } from "lucide-react";
import { useChat } from "@/lib/hooks/useChat";
import Image from "next/image";
import { ChatMessage } from "@/types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showAvatar: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar,
}: MessageBubbleProps) {
  const { addReaction } = useChat();

  const handleReaction = (emoji: string) => {
    addReaction(message.id, emoji);
  };

  const handleReply = () => {
  };

  return (
    <div
      className={cn("flex gap-3 mb-4", isOwn ? "flex-row-reverse" : "flex-row")}
    >
      {showAvatar && !isOwn && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>{message.sender.username.charAt(0)}</AvatarFallback>
        </Avatar>
      )}

      {showAvatar && isOwn && <div className="w-8" />}

      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {showAvatar && (
          <p className="text-xs text-muted-foreground mb-1">
            {message.sender.username}
          </p>
        )}

        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted rounded-tl-none"
          )}
        >
      
            <div
              className={cn(
                "border-l-2 pl-2 mb-2 text-sm",
                isOwn
                  ? "border-primary-foreground/30"
                  : "border-muted-foreground/30"
              )}
            >
              <p className="font-medium">{message.sender.username}</p>
              <p className="truncate">{message.content}</p>
            </div>

          <p className="whitespace-pre-wrap">{message.content}</p>

          {message.media && (
            <div className="mt-2">
              <Image
                src={message.media}
                alt="Message media"
                className="rounded-lg max-w-full max-h-64 object-cover"
                width={256}
                height={256}
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-1 gap-4">
            <span className="text-xs opacity-70">
              {format(new Date(message.createdAt), "HH:mm")}
              {message.isSending && " • Sending..."}
              {message.isError && " • Failed"}
            </span>

            <div className="flex items-center gap-1">
              {message.reactions?.map((reaction, index) => (
                <span
                  key={index}
                  className="text-xs bg-background/50 px-1 rounded"
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex gap-1 mt-1",
            isOwn ? "flex-row-reverse" : "flex-row"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => handleReaction("👍")}
          >
            <ThumbsUp className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleReply}
          >
            <Reply className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
