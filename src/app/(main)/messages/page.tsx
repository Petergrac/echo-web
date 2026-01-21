"use client";

import { useState } from "react";
import { ConversationListItem } from "@/components/chat/ConversationListItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserType } from "@/types/user-type";
import { useChat } from "@/lib/hooks/useChat";
import { useCreateConversation } from "@/lib/hooks/api/chat";
import api from "@/lib/api/axios";
import Link from "next/link";
import { Conversation } from "@/types/chat";
import BackBar from "@/components/post/post-detail/Back-Bar";

export default function MessagesPage() {
  const { conversations, loadingConversations } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [conversationName, setConversationName] = useState("");

  const { mutate: createConversation, isPending } = useCreateConversation();

  //* Fetch users for creating new conversations
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/users/active/all-users?page=1&limit=100`,
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });

  const filteredConversations = conversations.filter((conv: Conversation) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    const name =
      conv.name || conv.participants.map((p) => p.user.username).join(", ");

    return (
      name.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  const handleCreateConversation = (type: "direct" | "group") => {
    if (type === "direct" && selectedUsers.length === 1) {
      createConversation(
        {
          type: "direct",
          participantIds: selectedUsers,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setSelectedUsers([]);
          },
        },
      );
    } else if (type === "group" && selectedUsers.length > 0) {
      createConversation(
        {
          type: "group",
          participantIds: selectedUsers,
          name: conversationName || undefined,
        },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setSelectedUsers([]);
            setConversationName("");
          },
        },
      );
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <BackBar type="Messages" push={true} />
      <div className="border-b p-4 pt-19">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Messages</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Chat</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="direct" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="direct">Direct Message</TabsTrigger>
                  <TabsTrigger value="group">Group Chat</TabsTrigger>
                </TabsList>

                <TabsContent value="direct" className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Select a user to start a direct message
                    </p>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {users?.users?.map((user: UserType) => (
                          <div
                            key={user.id}
                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-accent ${
                              selectedUsers.includes(user.id) ? "bg-accent" : ""
                            }`}
                            onClick={() => toggleUserSelection(user.id)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <p className="font-medium">{user.username}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Button
                    onClick={() => handleCreateConversation("direct")}
                    disabled={selectedUsers.length !== 1 || isPending}
                    className="w-full"
                  >
                    Start Chat
                  </Button>
                </TabsContent>

                <TabsContent value="group" className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Group name (optional)"
                      value={conversationName}
                      onChange={(e) => setConversationName(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Select users to add to the group
                    </p>
                    <ScrollArea className="h-[250px]">
                      <div className="space-y-2">
                        {users?.users?.map((user: UserType) => (
                          <div
                            key={user.id}
                            className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-accent ${
                              selectedUsers.includes(user.id) ? "bg-accent" : ""
                            }`}
                            onClick={() => toggleUserSelection(user.id)}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>
                                {user.username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <p className="font-medium">{user.username}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.firstName} {user.lastName}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <Button
                    onClick={() => handleCreateConversation("group")}
                    disabled={selectedUsers.length === 0 || isPending}
                    className="w-full"
                  >
                    Create Group
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loadingConversations ? (
          <div className="p-8 text-center">
            <p>Loading conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquarePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No conversations yet</h3>
            <p className="text-muted-foreground">
              Start a conversation by clicking &quot;New Chat&quot;
            </p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation: Conversation) => (
              <Link href={`/messages/${conversation.id}`} key={conversation.id}>
                <ConversationListItem conversation={conversation} />
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
