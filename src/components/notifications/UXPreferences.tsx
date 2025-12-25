"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2, Vibrate, Clock } from "lucide-react";
import { NotPrefDto } from "@/types/notification";

interface UXPreferencesProps {
  preferences: NotPrefDto;
  onUpdate: <K extends keyof NotPrefDto>(key: K, value: NotPrefDto[K]) => void;
}

export default function UXPreferences({
  preferences,
  onUpdate,
}: UXPreferencesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>UX Preferences</CardTitle>
        <CardDescription>
          Customize your notification experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5" />
            <div>
              <Label htmlFor="sound-enabled">Notification Sounds</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for notifications
              </p>
            </div>
          </div>
          <Switch
            id="sound-enabled"
            checked={preferences.soundEnabled}
            onCheckedChange={(checked) => onUpdate("soundEnabled", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Vibrate className="h-5 w-5" />
            <div>
              <Label htmlFor="vibration-enabled">Vibration</Label>
              <p className="text-sm text-muted-foreground">
                Vibrate for notifications
              </p>
            </div>
          </div>
          <Switch
            id="vibration-enabled"
            checked={preferences.vibrationEnabled}
            onCheckedChange={(checked) => onUpdate("vibrationEnabled", checked)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5" />
            <Label htmlFor="delivery-timing">Delivery Timing</Label>
          </div>
          <Select
            value={preferences.deliveryTiming}
            onValueChange={(value) => {
              onUpdate("deliveryTiming", value);
            }}
          >
            <SelectTrigger id="delivery-timing">
              <SelectValue placeholder="Select timing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="off">Off</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {getDeliveryTimingDescription(preferences.deliveryTiming)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getDeliveryTimingDescription(timing: string): string {
  switch (timing) {
    case "immediate":
      return "Receive notifications immediately";
    case "scheduled":
      return "Receive notifications at scheduled times";
    case "off":
      return "No notifications will be delivered";
    default:
      return "";
  }
}
