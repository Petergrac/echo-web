import { create } from "zustand";

interface UniversalType {
  //* States
  mutedUsers: string[];
  soundEnabled: boolean;

  //* Actions
  setMutedUsers: (mutedUsers: string[]) => void;
  setSoundEnabled: (enabled: boolean) => void;
}

export const useUniversalStore = create<UniversalType>((set) => ({
  mutedUsers: [],
  soundEnabled: false,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setMutedUsers: (mutedUsers) => set({ mutedUsers }),
}));
