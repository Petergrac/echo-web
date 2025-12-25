"use client";

import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Mail, Smartphone, Settings } from "lucide-react";
import { toast } from "sonner";
import InAppNotifications from "./InAppNotifications";
import EmailNotifications from "./EmailNotifications";
import PushNotifications from "./PushNotifications";
import AdvancedSettings from "./AdvancedSettings";
import { NotPrefDto } from "@/types/notification";

interface NotificationPreferencesProps {
  initialData?: NotPrefDto;
  onSave?: (data: NotPrefDto) => Promise<void>;
}

export default function NotificationPreferences({
  initialData,
  onSave,
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotPrefDto>(
    initialData || getDefaultPreferences()
  );
  const [isSaving, setIsSaving] = useState(false);
  const previousPreferencesRef = useRef<NotPrefDto | null>(null);

  const updatePreference = (
    key: keyof NotPrefDto,
    value: NotPrefDto[keyof NotPrefDto]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (onSave) {
      //* Store previous state for rollback
      previousPreferencesRef.current = initialData || getDefaultPreferences();

      try {
        setIsSaving(true);
        await onSave(preferences);
      } catch (_) {
        setPreferences(previousPreferencesRef.current);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleReset = () => {
    if (initialData) {
      setPreferences(initialData);
    } else {
      setPreferences(getDefaultPreferences());
    }
    toast.info("Changes reset to original");
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Header />

      <Tabs defaultValue="in-app" className="w-full">
        <div className="mx-auto">
          <TabNavigation />
        </div>

        <TabsContent value="in-app">
          <InAppNotifications
            preferences={preferences}
            onUpdate={updatePreference}
          />
        </TabsContent>

        <TabsContent value="email">
          <EmailNotifications
            preferences={preferences}
            onUpdate={updatePreference}
          />
        </TabsContent>

        <TabsContent value="push">
          <PushNotifications
            preferences={preferences}
            onUpdate={updatePreference}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedSettings
            preferences={preferences}
            onUpdate={updatePreference}
          />
        </TabsContent>
      </Tabs>

      <ActionButtons
        onSave={handleSave}
        onReset={handleReset}
        isLoading={isSaving}
      />
    </div>
  );
}

//* Helper components
function Header() {
  return (
    <div className="justify-center flex items-center gap-2 mb-6">
      <Bell className="h-6 w-6" />
      <h1 className="text-3xl font-bold">Notification Preferences</h1>
    </div>
  );
}

function TabNavigation() {
  return (
    <TabsList className="grid grid-cols-4 mb-8">
      <TabsTrigger value="in-app" className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        In-App
      </TabsTrigger>
      <TabsTrigger value="email" className="flex items-center gap-2">
        <Mail className="h-4 w-4" />
        Email
      </TabsTrigger>
      <TabsTrigger value="push" className="flex items-center gap-2">
        <Smartphone className="h-4 w-4" />
        Push
      </TabsTrigger>
      <TabsTrigger value="advanced" className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Advanced
      </TabsTrigger>
    </TabsList>
  );
}

interface ActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  isLoading: boolean;
}

function ActionButtons({ onSave, onReset, isLoading }: ActionButtonsProps) {
  return (
    <Card className="mt-6">
      <CardFooter className="flex justify-between px-6 py-4">
        <Button variant="outline" onClick={onReset} disabled={isLoading}>
          Reset Changes
        </Button>
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Preferences"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function getDefaultPreferences(): NotPrefDto {
  return {
    id: "",
    posts: true,
    userId: "",
    likes: true,
    replies: true,
    reposts: true,
    follows: true,
    mentions: true,
    system: true,
    emailDigest: true,
    emailSystem: false,
    pushLikes: true,
    pushReplies: true,
    pushReposts: true,
    pushFollows: true,
    pushMentions: true,
    pushSystem: false,
    soundEnabled: true,
    vibrationEnabled: true,
    deliveryTiming: "immediate",
    mutedUsers: [],
    mutedKeywords: [],
  };
}
