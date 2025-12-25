"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
}

export function NotificationToggle({
  label,
  description,
  checked,
  onCheckedChange,
  id,
}: NotificationToggleProps) {
  const toggleId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor={toggleId}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={toggleId}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}
