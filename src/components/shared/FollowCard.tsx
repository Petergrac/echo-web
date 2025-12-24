"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import api from "@/lib/api/axios";
import { FollowType } from "@/types/user-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";

export interface followState {
  viewerFollows: boolean;
  followsViewer: boolean;
}

export default function FollowDropDown({
  user,
  followType,
}: {
  user: FollowType;
  followType: "followers" | "following";
}) {
  const router = useRouter();
  const { username } = useParams() as { username: string };
  const queryClient = useQueryClient();
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
  //* Update UI optimistically
  const [followOptimistic, toggleFollow] = useOptimistic(
    {
      viewerFollows: user.viewerFollows,
      followsViewer: user.followsViewer,
    },
    (state, newState: followState) => ({ ...state, ...newState })
  );
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
    <Card className="w-full max-w-sm z-50 absolute glow">
      <CardHeader>
        <CardTitle>
          <Image
            src={user.avatar}
            alt="avatar"
            className="rounded-full cursor-pointer"
            width={50}
            height={50}
            onClick={() => router.push(`/${user.username}`)}
          />
        </CardTitle>
        <CardAction>
          <Button
            onClick={handleFollow}
            className={`rounded-full font-bold transition ${
              followType === "followers"
                ? followOptimistic.viewerFollows
                  ? "hover:bg-red-600 bg-black text-white border hover:text-white hover:border-red-600"
                  : followOptimistic.followsViewer
                  ? "bg-sky-500 text-white hover:bg-sky-600"
                  : "hover:bg-gray-200"
                : followOptimistic.viewerFollows
                ? "hover:bg-red-600 hover:text-white hover:border-red-600"
                : "hover:bg-gray-200"
            }`}
          >
            {followType === "followers"
              ? followOptimistic.viewerFollows
                ? "Unfollow"
                : followOptimistic.followsViewer
                ? "Follow Back"
                : "Follow"
              : followOptimistic.viewerFollows
              ? "Unfollow"
              : "Follow"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start justify-start cursor-pointer">
          <Link
            href={`/${user.username}`}
            className="font-bold hover:underline"
          >
            {user.firstName}
          </Link>
          <Link
            href={`/${user.username}`}
            className="text-gray-400 text-sm hover:underline"
          >
            @{user.username}
          </Link>
          <p
            className="text-sm"
            onClick={() => router.push(`/${user.username}`)}
          >
            {user.bio} Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptate quidem, autem ullam officiis ipsum ipsa voluptatibus
            labore, inventore enim repellendus blanditiis{" "}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex text-sm justify-start gap-6">
        <Link className="hover:underline" href={`/${user.username}`}>
          {user.followingCount}{" "}
          <span className=" text-gray-500">
            Following
            {Number(user.followingCount) > 0 ? "s" : ""}
          </span>
        </Link>
        <Link className="hover:underline" href={`/${user.username}`}>
          {user.followersCount}{" "}
          <span className="text-sm text-gray-400">
            Follower
            {Number(user.followingCount) > 0 ? "s" : ""}
          </span>
        </Link>
      </CardFooter>
    </Card>
  );
}
