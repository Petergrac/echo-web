"use client";
import { FollowType } from "@/types/user-type";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import FollowDropDown, { followState } from "./FollowCard";
import { startTransition, useOptimistic, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios";

const FollowCard = ({
  user,
  followType,
}: {
  user: FollowType;
  followType: "followers" | "following";
}) => {
  const router = useRouter();
  const [showCard, setShowCard] = useState(false);

  const { username } = useParams() as { username: string };
  const queryClient = useQueryClient();

  //* Update UI optimistically
  const [followOptimistic, toggleFollow] = useOptimistic(
    {
      viewerFollows: user.viewerFollows,
      followsViewer: user.followsViewer,
    },
    (state, newState: followState) => ({ ...state, ...newState })
  );
  const { className, label } = getFollowButtonConfig(followOptimistic);
  //* Mutate follow
  const mutation = useMutation({
    mutationFn: async () => {
      return await api.post(`users/${user.username}/follow`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", username],
      });
      toast.success(
        user.viewerFollows
          ? `Unfollowed ${user.username}`
          : `Followed ${user.username}`
      );
    },
    onError: () => {
      toast.error("Action failed");
    },
  });

  //* Toggle follow & UI update
  const handleFollow = () => {
    const newState = {
      viewerFollows: !followOptimistic.viewerFollows,
      followsViewer: followOptimistic.followsViewer,
    };
    startTransition(() => {
      toggleFollow(newState);
      mutation.mutate();
    });
  };

  return (
    <div className="">
      <div
        onMouseLeave={() => setShowCard(false)}
        className="px-4 py-3 flex items-start w-full relative gap-2"
      >
        <Image
          src={user.avatar}
          alt="avatar"
          onMouseEnter={() => setShowCard(true)}
          className="rounded-full cursor-pointer"
          width={50}
          height={50}
          onClick={() => router.push(`/${user.username}`)}
        />
        <div className="">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-start">
              <Link
                href={`/${user.username}`}
                className="flex flex-col items-start"
              >
                <p
                  onMouseEnter={() => setShowCard(true)}
                  className="font-bold hover:underline"
                >
                  {user.firstName}
                </p>
                <p
                  onMouseEnter={() => setShowCard(true)}
                  className="text-sm text-gray-400 hover:underline"
                >
                  @{user.username}
                </p>
              </Link>
              <p className="text-gray-300 text-[10px] p-px bg-gray-800">
                {user.isMutual
                  ? "Mutual Follow"
                  : user.followsViewer && "Follows you"}
              </p>
            </div>
            <button
              onClick={handleFollow}
              className={`px-4 py-1 rounded-full text-sm font-semibold transition ${className}`}
            >
              {label}
            </button>
          </div>
          {showCard && <FollowDropDown user={user} followType={followType} />}
          <p
            onClick={() => router.push(`/${user.username}`)}
            className="cursor-pointer"
          >
            {user.bio} Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Corrupti alias, incidunt laboriosam ex reiciendis labore nemo
            modification.
          </p>
        </div>
      </div>
    </div>
  );
};
const getFollowButtonConfig = (state: followState) => {
  if (state.viewerFollows) {
    return {
      label: "Unfollow",
      className:
        "border border-gray-600 text-white hover:bg-red-600 hover:border-red-600",
    };
  }

  if (state.followsViewer) {
    return {
      label: "Follow Back",
      className: "bg-sky-500 text-white hover:bg-sky-600",
    };
  }

  return {
    label: "Follow",
    className: "bg-white text-black hover:bg-gray-200",
  };
};

export default FollowCard;
