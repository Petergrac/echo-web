"use client";
import { UserType } from "@/types/user-type";
import { create } from "zustand";

export const useCurrentUser = create<UserType>((set) => ({
  id: "",
  setId: (id: string | "") => set({ id }),
  username: "",
  setUsername: (username: string | "") => set({ username }),
  avatar: "",
  setAvatar: (avatar: string | "") => set({ avatar }),
  firstName: "",
  setFirstName: (firstName: string) => set({ firstName }),
  lastName: "",
  setLastName: (lastName: string | "") => set({ lastName }),
  bio: "",
  setBio: (bio: string | "") => set({ bio }),
  emailVerified: false,
  setEmailVerified: (emailVerified: boolean) => set({ emailVerified }),
  createdAt: new Date(),
  setCreatedAt: (createdAt: Date) => set({ createdAt }),
  email: "",
  setEmail: (email: string | "") => set({ email }),
  location: "",
  setLocation: (location: string | "") => set({ location }),
  website: "",
  setWebsite: (website: string | "") => set({ website }),
}));
