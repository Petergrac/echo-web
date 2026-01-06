"use client";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

const ProfileBar = ({
  username,
  postCount,
  firstName,
}: {
  username: string;
  postCount?: number;
  firstName?: string;
}) => {
  return (
    <div className="flex border-b justify-between px-5 py-1 bg-transparent backdrop-blur-2xl items-center w-full fixed z-50 sm:max-w-150">
      <Link href={`/feed`} className="flex items-center gap-5">
        <ArrowLeft />
        <div className="flex flex-col items-start">
          <p
            className={`${
              firstName ? "font-bold" : "italic text-red-400"
            } text-lg`}
          >
            {firstName ?? "Anonymous"}
          </p>
          <p className="text-gray-400 text-sm">{postCount ?? 0} posts</p>
          <p className="text-gray-400 text-sm">@{username}</p>
        </div>
      </Link>
      <Link href={`/explore`}>
        <Search className="text-gray-400 mr-5" size={20} />
      </Link>
    </div>
  );
};

export default ProfileBar;
