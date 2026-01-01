"use client";
import { useState } from "react";
import { Bell, CheckCheck, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  useMarkAllAsRead,
  useNotifications,
  useUnreadCount,
} from "@/lib/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { EmptyState } from "@/components/notifications/EmptyState";
import Link from "next/link";
import { useWebSocketStore } from "@/stores/websocket-store";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import BackBar from "@/components/post/post-detail/Back-Bar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { toast } from "sonner";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const {
    notifications,
    totalItems,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useNotifications();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => {
      return api.delete("notifications/delete/delete-all");
    },
    onSuccess: () => {
      toast.success("All notifications have been deleted");
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: () => {
      toast.error("Notifications could not be deleted");
    },
  });

  //* Get unread count (combines REST + WebSocket)
  const { count: unreadCount } = useUnreadCount();
  //* Mutation for marking all as read
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  //* Get clearNotifications from WebSocket store
  const { clearNotifications } = useWebSocketStore();
  //* Filter notifications based on active tab

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;
  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };
  const handleClearAll = () => {
    clearNotifications();
    mutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl pt-18 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Bell className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-2xl pt-18 px-4">
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">
            Failed to load notifications
          </h3>
          <p className="text-muted-foreground mb-4">
            There was an error loading your notifications.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  return (
    <>
      <BackBar type="Notifications" />
      {/* Header */}
      <div className="container mx-auto pt-18 max-w-2xl px-4">
        <div className="flex items-center px-4 justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="h-7 w-7" />
            <div>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread · {totalItems} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isMarkingAll}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              {isMarkingAll ? "Marking..." : "Mark all read"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings/notifications">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "unread")}
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              All notifications
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-2">
              Unread
              {unreadCount > 0 && (
                <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          <Separator />
          {/* Notifications List */}
          <TabsContent value={activeTab} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <EmptyState
                icon={<Bell className="h-12 w-12" />}
                title={`No ${
                  activeTab === "unread" ? "unread" : ""
                } notifications`}
                description={
                  activeTab === "unread"
                    ? "You're all caught up!"
                    : "Notifications will appear here"
                }
              />
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    showActions
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <InfiniteScrollTrigger
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
}
