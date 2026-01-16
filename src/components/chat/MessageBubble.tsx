import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Reply, ThumbsUp, Trash2 } from "lucide-react";
import { useChat } from "@/lib/hooks/useChat";
import Image from "next/image";
import { ChatMessage } from "@/types/chat";
import EmojiPickerButton from "../post/create-post/EmojiPicker";
import { Dispatch, SetStateAction } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteMessage } from "@/lib/hooks/api/chat";
import Link from "next/link";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  setReplyToMessage?: Dispatch<SetStateAction<ChatMessage | null>>;
  editMessage: Dispatch<
    SetStateAction<{
      content: string;
      messageId: string;
    } | null>
  >;
  showAvatar: boolean;
}

export function MessageBubble({
  message,
  isOwn,
  showAvatar,
  setReplyToMessage,
  editMessage,
}: MessageBubbleProps) {
  const { addReaction } = useChat();
  const deleteMessage = useDeleteMessage(message.conversationId);

  const handleReaction = (emoji: string) => {
    addReaction(message.id, emoji);
  };

  const handleReply = () => {
    if (setReplyToMessage) {
      setReplyToMessage(message as unknown as ChatMessage);
    }
  };
  console.log(message)
  return (
    <div
      className={cn("flex gap-3 mb-4", isOwn ? "flex-row-reverse" : "flex-row")}
    >
      {showAvatar && !isOwn && (
        <Link href={`/${message.sender.username}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} />
            <AvatarFallback>{message.sender.username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
      )}
      <div
        className={cn(
          "flex flex-col max-w-[70%]",
          isOwn ? "items-end" : "items-start"
        )}
      >
        {showAvatar && (
          <Link
            href={`/${message.sender.username}`}
            className="text-xs text-muted-foreground mb-1"
          >
            {message.sender.username}
          </Link>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isOwn
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-muted rounded-tl-none"
          )}
        >
          <div className="flex flex-col">
            {message.replyTo && (
              <div className="border-l-2 pl-2 mb-2 border-muted/50 opacity-50">
                <p className="font-medium">
                  {message.replyTo.sender.username === message.sender.username
                    ? "You"
                    : message.replyTo.sender.username}
                </p>
                <p className="whitespace-pre-wrap">
                  {message.replyTo?.content}
                </p>
              </div>
            )}
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          {message.media?.type.startsWith("image/") && (
            <div className="mt-2">
              <Image
                src={message.media.url}
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
          <div className="h-7 w-7">
            <EmojiPickerButton
              onEmojiSelect={(emoji) => addReaction(message.id, emoji)}
            />
          </div>
          {isOwn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="text-red-500 text-xs"
                  onClick={() =>
                    deleteMessage.mutate({
                      messageId: message.id,
                      forEveryone: true,
                      conversationId: message.conversationId,
                    })
                  }
                >
                  <Trash2 className="text-red-500" scale={0.5} />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editMessage({
                      content: message.content,
                      messageId: message.id,
                    })
                  }
                  className="text-xs"
                >
                  <Pencil /> Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
