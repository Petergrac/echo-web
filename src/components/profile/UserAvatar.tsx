"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useCurrentUser } from "@/lib/hooks/useStore";

interface UserAvatarProps {
  className?: string;
  showOnMobile?: boolean;
}

const UserAvatar = ({ className }: UserAvatarProps) => {
  const user = useCurrentUser();

  return (
    <Link href={`/${user?.username}`} className={className}>
      <Avatar>
        <AvatarImage src={user?.avatar || `https://github.com/shadcn.png`} />
        <AvatarFallback>
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
