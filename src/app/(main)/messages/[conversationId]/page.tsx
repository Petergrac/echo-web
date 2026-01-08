"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Phone, Video, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/types/user-type";
import { useChat } from "@/lib/hooks/useChat";
import {
  useConversation,
  useLeaveConversation,
  useMessages,
} from "@/lib/hooks/api/chat";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.conversationId as string;

  const {
    activeConversation,
    getMessages,
    getTypingUsers,
    selectConversation,
    sendMessage,
    isUserOnline,
  } = useChat();

  const { data: conversationData } = useConversation(conversationId);
  const {
    data: messagesData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessages(conversationId);
  const { mutate: leaveConversation } = useLeaveConversation();

  const [replyTo, setReplyTo] = useState<any>(null);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] =
    useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  //* Load conversation when page loads
  useEffect(() => {
    if (conversationData && !activeConversation) {
      selectConversation(conversationData);
    }
  }, [conversationData, activeConversation, selectConversation]);

  //* Combine API messages with WebSocket messages
  const apiMessages =
    messagesData?.pages.flatMap((page) => page.messages) || [];
  const socketMessages = getMessages(conversationId);
  const allMessages = [...apiMessages, ...socketMessages]
    .filter(
      (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  //* Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const typingUsers = getTypingUsers(conversationId);

  const handleSend = (content: string, file?: File) => {
    sendMessage(content, "TEXT", replyTo?.id, file);
    setReplyTo(null);
  };

  const handleLeaveConversation = () => {
    if (confirm("Are you sure you want to leave this conversation?")) {
      leaveConversation(conversationId, {
        onSuccess: () => {
          router.push("/messages");
        },
      });
    }
  };

  if (!conversationData && !activeConversation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading conversation...</p>
      </div>
    );
  }

  const conversation = activeConversation || conversationData;
  const isDirectMessage = conversation?.type === "DIRECT";

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/messages")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation?.avatar} />
              <AvatarFallback>
                {conversation?.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                  {conversation?.name ||
                    (isDirectMessage &&
                      conversation?.participants[0]?.username) ||
                    "Unknown"}
                </h2>

                {isDirectMessage && conversation?.participants[0] && (
                  <Badge
                    variant={
                      isUserOnline(conversation.participants[0].id)
                        ? "default"
                        : "outline"
                    }
                  >
                    {isUserOnline(conversation.participants[0].id)
                      ? "Online"
                      : "Offline"}
                  </Badge>
                )}
              </div>

              {typingUsers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {typingUsers.map((u) => u.username).join(", ")} is typing...
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirectMessage && (
            <>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </>
          )}

          {!isDirectMessage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsParticipantsDialogOpen(true)}
            >
              <Users className="h-5 w-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setIsParticipantsDialogOpen(true)}
              >
                View Participants
              </DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem>Change Theme</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLeaveConversation}
              >
                Leave Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        {allMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center space-y-2">
              <Avatar className="h-16 w-16 mx-auto">
                <AvatarImage src={conversation?.avatar} />
                <AvatarFallback>
                  {conversation?.name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">Start a conversation</h3>
              <p className="text-muted-foreground">
                Send your first message below
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {allMessages.map((message, index) => {
              const previousMessage = allMessages[index - 1];
              const isSameSender =
                previousMessage?.sender.id === message.sender.id;
              const timeDiff = previousMessage
                ? new Date(message.createdAt).getTime() -
                  new Date(previousMessage.createdAt).getTime()
                : Infinity;

              const showAvatar = !isSameSender || timeDiff > 5 * 60 * 1000; // 5 minutes

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender.id === "current"} // Replace with actual current user ID
                  showAvatar={showAvatar}
                />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <MessageInput
        conversationId={conversationId}
        onSend={handleSend}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />

      {/* Participants Dialog */}
      <Dialog
        open={isParticipantsDialogOpen}
        onOpenChange={setIsParticipantsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Participants ({conversation?.participants?.length || 0})
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            {conversation?.participants?.map((participant: UserType) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>
                      {participant.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{participant.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {isUserOnline(participant.id) ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                {participant.isAdmin && (
                  <Badge variant="secondary">Admin</Badge>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <InfiniteScrollTrigger
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </div>
  );
}
