"use client";
import { UserType } from "@/types/user-type";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FollowDropDown from "./FollowCard";
import { useState } from "react";

const FollowCard = ({
  user,
  followType,
}: {
  user: UserType;
  followType: "followers" | "following";
}) => {
  const router = useRouter();
  const [showCard, setShowCard] = useState(false);
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
            <button className="border-2 py-1 rounded-full px-3">
              {user.isFollowing
                ? "Unfollow"
                : followType == "followers"
                ? "Follow Back"
                : "Unfollow"}
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

export default FollowCard;
