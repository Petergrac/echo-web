"use client";

import React from "react";
import { useProfile } from "@/lib/hooks/user-profile";
import Profile from "./Profile";
import ProfileLoader from "./ProfileLoader";
import { usePathname } from "next/navigation";

interface Props {
  username: string;
  children: React.ReactNode;
}

export default function ProfileClient({ username, children }: Props) {
  const { data: user, isLoading, isError, error } = useProfile(username);
  const pathName = usePathname();

  if (isLoading) return <ProfileLoader />;
  const href = [`/${username}/followers`, `/${username}/following`];
  console.log(pathName, href);
  if (isError && error)
    return (
      <div className="flex justify-start flex-col items-center">
        <p className="pt-20 pb-5">Failed to fetch user {error?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-center bg-white text-black text-sm p-2 rounded-full"
        >
          Try Again
        </button>
      </div>
    );

  if (!user)
    return (
      <div className="py-10 text-red-500 text-center">
        There is no user.Try to log out or refresh user on the left bar
      </div>
    );

  return (
    <>
      {!href.includes(pathName) && <Profile user={user} />}
      <section>{children}</section>
    </>
  );
}
