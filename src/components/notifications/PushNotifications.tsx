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

interface PushNotificationsProps {
  preferences: NotPrefDto;
  onUpdate: <K extends keyof NotPrefDto>(key: K, value: NotPrefDto[K]) => void;
}

export default function PushNotifications({
  preferences,
  onUpdate,
}: PushNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          Control push notifications on your mobile device
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationToggle
          label="Likes"
          description="Push notifications for likes"
          checked={preferences.pushLikes}
          onCheckedChange={(checked) => onUpdate("pushLikes", checked)}
        />
        <NotificationToggle
          label="Replies"
          description="Push notifications for replies"
          checked={preferences.pushReplies}
          onCheckedChange={(checked) => onUpdate("pushReplies", checked)}
        />
        <NotificationToggle
          label="Reposts"
          description="Push notifications for reposts"
          checked={preferences.pushReposts}
          onCheckedChange={(checked) => onUpdate("pushReposts", checked)}
        />
        <NotificationToggle
          label="Follows"
          description="Push notifications for new followers"
          checked={preferences.pushFollows}
          onCheckedChange={(checked) => onUpdate("pushFollows", checked)}
        />
        <NotificationToggle
          label="Mentions"
          description="Push notifications for mentions"
          checked={preferences.pushMentions}
          onCheckedChange={(checked) => onUpdate("pushMentions", checked)}
        />
        <NotificationToggle
          label="System"
          description="Push notifications for system updates"
          checked={preferences.pushSystem}
          onCheckedChange={(checked) => onUpdate("pushSystem", checked)}
        />
      </CardContent>
    </Card>
  );
}
