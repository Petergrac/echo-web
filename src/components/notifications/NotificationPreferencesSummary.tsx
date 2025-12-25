"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, Smartphone } from "lucide-react";
import { NotPrefDto } from "@/types/notification";

interface NotificationPreferencesSummaryProps {
  preferences: NotPrefDto;
}

export default function NotificationPreferencesSummary({
  preferences,
}: NotificationPreferencesSummaryProps) {
  const activeInAppCount = [
    preferences.likes,
    preferences.replies,
    preferences.reposts,
    preferences.follows,
    preferences.mentions,
    preferences.system,
  ].filter(Boolean).length;

  const activeEmailCount = [
    preferences.emailDigest,
    preferences.emailSystem,
  ].filter(Boolean).length;

  const activePushCount = [
    preferences.pushLikes,
    preferences.pushReplies,
    preferences.pushReposts,
    preferences.pushFollows,
    preferences.pushMentions,
    preferences.pushSystem,
  ].filter(Boolean).length;
  console.log(preferences.mutedUsers);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SummaryItem
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          label="In-App Notifications"
          activeCount={activeInAppCount}
          totalCount={6}
        />

        <SummaryItem
          icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          label="Email Notifications"
          activeCount={activeEmailCount}
          totalCount={2}
        />

        <SummaryItem
          icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
          label="Push Notifications"
          activeCount={activePushCount}
          totalCount={6}
        />

        {preferences.mutedUsers.length > 0 && (
          <div>
            <p className="text-sm font-medium">
              Muted Users: {preferences.mutedUsers.length}
            </p>
          </div>
        )}

        {preferences.mutedKeywords.length > 0 && (
          <div>
            <p className="text-sm font-medium">
              Muted Keywords: {preferences.mutedKeywords.length}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SummaryItemProps {
  icon: React.ReactNode;
  label: string;
  activeCount: number;
  totalCount: number;
}

function SummaryItem({
  icon,
  label,
  activeCount,
  totalCount,
}: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <Badge variant="outline">
        {activeCount} of {totalCount} active
      </Badge>
    </div>
  );
}
