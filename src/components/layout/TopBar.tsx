"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSidebar } from "../ui/sidebar";
import { useCurrentUser } from "@/lib/hooks/useStore";

const TopBar = () => {
  const { toggleSidebar } = useSidebar();
  const user = useCurrentUser();
  return (
    <div className="fixed top-0 z-0 w-full bg-black backdrop:blur-2xl  flex-col supports-backdrop-filter:bg-background/80 flex sm:w-[600px] outline">
      <div className="pl-6 pt-4 sm:hidden" onClick={toggleSidebar}>
        <Avatar>
          <AvatarImage src={user?.avatar || `https://github.com/shadcn.png`} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="w-full justify-around flex">
        <Link
          href={`/following`}
          className="pt-3 pb-1 text-xl border-b-5 border-sky-600 font-bold"
        >
          For You
        </Link>
        <Link
          href={`/following`}
          className="pt-3 pb-1 text-xl border-b-5 border-sky-600 font-bold"
        >
          Following
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
