"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { EmptyState } from "@/components/notifications/EmptyState";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import Link from "next/link";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const { notifications, unreadCount, markAsRead, clearNotifications } =
    useNotifications();
  const mutation = useMutation({
    mutationFn: () => {
      return api.patch("notifications/read-all");
    },
    onSuccess: () => {
      setIsMarkingAll(false);
    },
  });
  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const handleMarkAllAsRead = () => {
    setIsMarkingAll(true);
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    unreadIds.forEach(markAsRead);
    mutation.mutate();
  };

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="h-7 w-7" />
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread · {notifications.length} total
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
            Mark all read
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearNotifications}
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
        <div className="mt-6">
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
                <div key={notification.id} className="border rounded-lg">
                  <NotificationItem
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
