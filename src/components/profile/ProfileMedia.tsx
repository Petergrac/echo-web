"use client";

import api from "@/lib/api/axios";
import { useCurrentUser } from "@/lib/hooks/useStore";
import { UserType } from "@/types/user-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "lucide-react";
import Image from "next/image";
import { startTransition, useOptimistic, useState } from "react";

const ProfileMedia = ({ user }: { user: UserType }) => {
  const [showBio, setShowBio] = useState(false);
  const [preview, setPreview] = useState(false);
  const [prev, setPrev] = useState<{
    url: string | "";
    type: "banner" | "avatar";
  }>({
    url: "",
    type: "banner",
  });
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  //* 1.Optimistically update the UI
  const [optimisticFollowing, updateFollow] = useOptimistic(
    user.isFollowing,
    (state, newState: boolean) => newState
  );
  //* 2.Fire real API and invalidate the user state
  const toggleFollow = useMutation({
    mutationFn: async () => {
      return await api.post(`/users/${user.username}/follow`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user.username] });
    },
  });
  //* Fire the UI update & mutation
  const handleFollow = () => {
    startTransition(() => {
      updateFollow(!user.isFollowing);
      toggleFollow.mutate();
    });
  };

  const isOwnProfile = currentUser?.username === user.username;
  return (
    <div className="mt-14 relative">
      {preview && prev.url && (
        <div className="fixed inset-0 z-9999 w-full h-full flex items-center justify-center bg-black/95">
          <button
            onClick={() => setPreview(false)}
            className="absolute top-4 left-4 text-white text-2xl"
          >
            ✕
          </button>
          <Image
            src={prev.url}
            className={
              prev.type === "banner"
                ? `aspect-video object-cover h-50 object-center w-full`
                : "aspect-square rounded-full h-100 object-center object-cover"
            }
            height={prev.type === "banner" ? 200 : 400}
            width={prev.type === "banner" ? 600 : 400}
            alt="image-preview"
          />
        </div>
      )}
      <Image
        src={user.avatar}
        onClick={() => {
          setPreview(true);
          setPrev({
            url: user.avatar,
            type: "banner",
          });
        }}
        className="aspect-video object-cover h-50 object-center w-full"
        alt="avatar"
        width={600}
        height={200}
      />
      <Image
        src={user.avatar}
        onClick={() => {
          setPreview(true);
          setPrev({
            url: user.avatar,
            type: "avatar",
          });
        }}
        className="profile-icon"
        width={120}
        height={120}
        alt=""
      />
      <div className="w-full pr-5 flex justify-end">
        <button
          onClick={isOwnProfile ? undefined : handleFollow}
          className={`${
            !optimisticFollowing && !isOwnProfile
              ? "bg-white text-black"
              : optimisticFollowing
              ? "ring ring-gray-400"
              : "ring ring-sky-400"
          } p-2 my-3 text-sm font-bold rounded-full transition hover:bg-sky-500 hover:text-black`}
        >
          {isOwnProfile
            ? "Edit Profile"
            : optimisticFollowing
            ? "Unfollow"
            : "Follow"}
        </button>
      </div>
      <div className="flex flex-col pl-4 mt-5">
        <p className="font-bold text-2xl">{user.firstName}</p>
        <p className="text-gray-400 text-sm pb-1">@{user.username}</p>
        <p
          className={`overflow-clip text-shadow-muted ${showBio ? "" : "h-5"}`}
        >
          {user.bio}
        </p>
        {user.bio && user.bio.length > 50 && (
          <span
            onClick={() => setShowBio(!showBio)}
            className="text-sm hover:underline text-sky-500"
          >
            {showBio ? "Less" : "More"}
          </span>
        )}
        <div className="pt-2 flex items-center justify-start gap-2">
          <Calendar className="text-gray-400" size={19} />
          <p className="text-gray-400">
            Joined{" "}
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex text-gray-500 text-sm pt-2 items-center gap-4 justify-start">
          <p className="">
            <span className="text-white font-bold">{user.followingCount} </span>
            Following
          </p>
          <p className="">
            <span className="text-white font-bold">{user.followersCount} </span>
            Followers
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileMedia;
