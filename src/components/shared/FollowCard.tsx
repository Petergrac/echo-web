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
import { UserType } from "@/types/user-type";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FollowDropDown({
  user,
  followType,
}: {
  user: UserType;
  followType: "followers" | "following";
}) {
  const router = useRouter();
  return (
    <Card className="w-full max-w-sm absolute glow">
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
            variant="outline"
            className={`rounded-full font-bold hover:${
              user.isFollowing ? "bg-white" : ""
            }`}
          >
            {user.isFollowing
              ? "Unfollow"
              : followType === "followers"
              ? "Follow Back"
              : "Unfollow"}
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
