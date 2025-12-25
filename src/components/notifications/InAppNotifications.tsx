"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NotificationToggle } from "./NotificationToggle";
import { NotPrefDto } from "@/types/notification";

interface InAppNotificationsProps {
  preferences: NotPrefDto;
  onUpdate: <K extends keyof NotPrefDto>(key: K, value: NotPrefDto[K]) => void;
}

export default function InAppNotifications({
  preferences,
  onUpdate,
}: InAppNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>In-App Notifications</CardTitle>
        <CardDescription>
          Control what notifications you see within the app
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationToggle
          label="Likes"
          description="When someone likes your post"
          checked={preferences.likes}
          onCheckedChange={(checked) => onUpdate("likes", checked)}
        />
        <NotificationToggle
          label="Replies"
          description="When someone replies to your post"
          checked={preferences.replies}
          onCheckedChange={(checked) => onUpdate("replies", checked)}
        />
        <NotificationToggle
          label="Reposts"
          description="When someone reposts your content"
          checked={preferences.reposts}
          onCheckedChange={(checked) => onUpdate("reposts", checked)}
        />
        <NotificationToggle
          label="Follows"
          description="When someone follows you"
          checked={preferences.follows}
          onCheckedChange={(checked) => onUpdate("follows", checked)}
        />
        <NotificationToggle
          label="Mentions"
          description="When someone mentions you"
          checked={preferences.mentions}
          onCheckedChange={(checked) => onUpdate("mentions", checked)}
        />
        <NotificationToggle
          label="System"
          description="Important updates from the platform"
          checked={preferences.system}
          onCheckedChange={(checked) => onUpdate("system", checked)}
        />
      </CardContent>
    </Card>
  );
}
