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

interface EmailNotificationsProps {
  preferences: NotPrefDto;
  onUpdate: <K extends keyof NotPrefDto>(key: K, value: NotPrefDto[K]) => void;
}

export default function EmailNotifications({
  preferences,
  onUpdate,
}: EmailNotificationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Control what notifications you receive via email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <NotificationToggle
          label="Email Digest"
          description="Weekly summary of your activity"
          checked={preferences.emailDigest}
          onCheckedChange={(checked) => onUpdate("emailDigest", checked)}
        />
        <NotificationToggle
          label="System Emails"
          description="Important system notifications via email"
          checked={preferences.emailSystem}
          onCheckedChange={(checked) => onUpdate("emailSystem", checked)}
        />
      </CardContent>
    </Card>
  );
}
