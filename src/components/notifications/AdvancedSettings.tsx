"use client";

import { NotPrefDto } from "@/types/notification";
import UXPreferences from "./UXPreferences";
import MutedUsers from "./MutedUsers";
import MutedKeywords from "./MutedKeywords";

interface AdvancedSettingsProps {
  preferences: NotPrefDto;
  onUpdate: <K extends keyof NotPrefDto>(key: K, value: NotPrefDto[K]) => void;
}

export default function AdvancedSettings({
  preferences,
  onUpdate,
}: AdvancedSettingsProps) {
  return (
    <div className="space-y-6">
      <UXPreferences preferences={preferences} onUpdate={onUpdate} />
      <MutedUsers preferences={preferences} onUpdate={onUpdate} />
      <MutedKeywords preferences={preferences} onUpdate={onUpdate} />
    </div>
  );
}
