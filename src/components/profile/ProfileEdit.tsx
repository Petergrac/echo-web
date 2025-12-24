import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { UserType } from "@/types/user-type";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/lib/hooks/useStore";

interface EditProfileDialogProps {
  trigger: React.ReactNode;
  user: UserType;
}
type ProfileChanges = {
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
};
export default function EditProfileDialog({
  trigger,
  user,
}: EditProfileDialogProps) {
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const { fetchCurrentUser } = useAuthActions();
  const mutation = useMutation({
    mutationFn: (changes: ProfileChanges) => {
      const formData = new FormData();
      Object.keys(changes).forEach((key) => {
        formData.append(key, changes[key as keyof typeof changes] as string);
      });
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      return api.patch("users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (response) => {
      const newUsername = response.data.username;
      const oldUsername = user.username;
      if (newUsername !== oldUsername) {
        //*Set data for the NEW key
        queryClient.setQueryData(["user", newUsername], response.data);
        //* Refresh user in the store too
        fetchCurrentUser(true);
        //* Invalidate the old one to clear cache
        queryClient.invalidateQueries({ queryKey: ["user", oldUsername] });
        toast.success("Profile updated successfully");
        //* Redirect browser to new URL
        router.push(`/${newUsername}`);
      } else {
        //* Refresh user in the store too
        fetchCurrentUser(true);
        //* Invalidate user too
        queryClient.invalidateQueries({
          queryKey: ["user", user.username],
        });
        toast.success("Profile updated successfully");
      }
    },
    onError: () => {
      toast.error("Profile could not be updated");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const username = (fd.get("username") as string) || "";
    const firstName = (fd.get("firstName") as string) || "";
    const lastName = (fd.get("lastName") as string) || "";
    const bio = (fd.get("bio") as string) || "";
    const location = (fd.get("location") as string) || "";
    const website = (fd.get("website") as string) || "";
    if (!username.trim() || !firstName.trim() || !lastName.trim()) {
      toast.error("Username, First name and Last name are required");
      return;
    }
    const changes: ProfileChanges = {};
    if (username.trim() !== user.username) changes.username = username.trim();
    if (firstName.trim() !== user.firstName)
      changes.firstName = firstName.trim();
    if (lastName.trim() !== user.lastName) changes.lastName = lastName.trim();
    if (bio !== (user.bio ?? "")) changes.bio = bio;
    if (location !== (user.location ?? "")) changes.location = location;
    if (website !== (user.website ?? "")) changes.website = website;
    //* Call the backend
    mutation.mutate(changes);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden sm:rounded-2xl gap-0">
        {/* Custom Header: Close on left, Title center-ish, Save on right */}
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-2 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-6">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
            <DialogTitle className="text-xl font-bold">
              Edit profile
            </DialogTitle>
          </div>
          <Button
            type="submit"
            form="profile-form"
            className="rounded-full font-bold px-5"
          >
            Save
          </Button>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[80vh]">
          {/* Banner Section */}
          <div className="relative h-48 bg-muted">
            {user.avatar.length > 0 && (
              <Image
                src={user.avatar || "https://github.com/shadcn.png"}
                className="w-full h-full object-cover"
                alt="Banner"
                height={400}
                width={400}
              />
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              {/* Add Camera Icon Button here for uploads */}
            </div>
          </div>

          {/* Avatar Section (Overlapping Banner) */}
          <div className="px-4 -mt-12 mb-4 relative">
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-full border-4 border-background bg-muted overflow-hidden relative group cursor-pointer">
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {user.avatar.length > 0 ? (
                    <Image
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      height={400}
                      width={400}
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-white">
                      <ImageIcon />
                    </div>
                  )}
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        toast.info("File selected");
                        setAvatarFile(file);
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">
                      <ImageIcon />
                    </span>
                  </div>
                </label>
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center pointer-events-none"></div>
            </div>
          </div>

          {/* Form Fields */}
          <form
            id="profile-form"
            className="p-4 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2 border rounded-md p-2 focus-within:ring-2 ring-primary">
              <Label
                htmlFor="username"
                className="text-xs text-muted-foreground"
              >
                Username
              </Label>
              <Input
                id="username"
                name="username"
                defaultValue={user.username}
                className="border-0 p-0 focus-visible:ring-0 h-7 text-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2 border rounded-md p-2 focus-within:ring-2 ring-primary">
                <Label
                  htmlFor="firstName"
                  className="text-xs text-muted-foreground"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  defaultValue={user.firstName}
                  className="border-0 p-0 focus-visible:ring-0 h-7 text-lg"
                />
              </div>
              <div className="space-y-2 border rounded-md p-2 focus-within:ring-2 ring-primary">
                <Label
                  htmlFor="lastName"
                  className="text-xs text-muted-foreground"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  defaultValue={user.lastName}
                  className="border-0 p-0 focus-visible:ring-0 h-7 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2 border rounded-md p-2 focus-within:ring-2 ring-primary">
              <Label htmlFor="bio" className="text-xs text-muted-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={user.bio}
                className="border-0 p-0 focus-visible:ring-0 resize-none min-h-20"
              />
            </div>

            <div className="space-y-2 border rounded-md p-2 focus-within:ring-2 ring-primary">
              <Label
                htmlFor="location"
                className="text-xs text-muted-foreground"
              >
                Location
              </Label>
              <Input
                id="location"
                name="location"
                placeholder="Nakuru, Kenya"
                defaultValue={user.location}
                className="border-0 p-0 focus-visible:ring-0 h-7"
              />
            </div>
            <div className="space-y-2 border rounded-md p-2 focus-within:ring-2 ring-primary">
              <Label
                htmlFor="website"
                className="text-xs text-muted-foreground"
              >
                Website
              </Label>
              <Input
                id="website"
                name="website"
                placeholder="https://* or www.* .com"
                defaultValue={user.website}
                className="border-0 p-0 focus-visible:ring-0 h-7"
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
