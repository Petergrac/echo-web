import { create } from "zustand";

interface UniversalType {
  //* States
  mutedUsers: string[];

  //* Actions
  setMutedUsers: (mutedUsers: string[]) => void;
}

export const useUniversalStore = create<UniversalType>((set) => ({
  mutedUsers: [],
  setMutedUsers: (mutedUsers) => set({ mutedUsers }),
}));
