"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sidebar, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import {
  Bookmark,
  LogOut,
  MessageCircle,
  RefreshCwIcon,
  Settings,
  User,
} from "lucide-react";
import { useAuthActions, useCurrentUser } from "@/lib/hooks/useStore";
import api from "@/lib/api/axios";
import { useRouter } from "next/navigation";

const AppSideBar = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const { logout, refreshUser } = useAuthActions();
  async function handleLogout() {
    logout();
    //* Logout from the server
    await api.get("/auth/logout");
    //* Redirect user to login page
    router.replace("/login");
  }
  const links = [
    {
      url: "/chat",
      icon: MessageCircle,
      index: 1,
      name: "Chat",
    },
    {
      url: `/${user?.username}`,
      icon: User,
      index: 2,
      name: "Profile",
    },
    {
      url: "/bookmarks",
      icon: Bookmark,
      index: 3,
      name: "Bookmarks",
    },
    {
      url: "/settings",
      icon: Settings,
      index: 4,
      name: "Settings",
    },
  ];
  return (
    <Sidebar>
      <SidebarMenu className="pl-5 pt-5 bg-black h-full outline-none border-none">
        <SidebarMenuItem className="">
          <Link href={`/${user?.username}`}>
            <Avatar>
              <AvatarImage
                src={user?.avatar || `https://github.com/shadcn.png`}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <p className="font-bold">{user?.username}</p>
          <p className="text-sm text-gray-500">@{user?.username}</p>

          <div className="flex justify-start gap-4 pt-5">
            <p className="text-gray-500 text-sm">
              <span className="font-bold text-white">
                {user?.followingCount}{" "}
              </span>{" "}
              following
            </p>
            <p className="text-gray-500 text-sm">
              <span className="font-bold text-white">
                {user?.followersCount}{" "}
              </span>{" "}
              followers
            </p>
          </div>
          <div
            onClick={() => refreshUser()}
            className="pt-5 flex items-center justify-start gap-2"
          >
            <RefreshCwIcon />
            <p className="text-sky-500 text-sm">Refresh Details</p>
          </div>
          <div className="pt-2">
            {links.map((l) => (
              <Link
                href={l.url}
                className="py-3 pt-5 flex justify-start gap-3 items-center"
                key={l.index}
              >
                <l.icon />
                <p className="font-bold text-sm">{l.name}</p>
              </Link>
            ))}
          </div>
          <div
            onClick={handleLogout}
            className="pt-2 pl-1 flex items-center justify-start"
          >
            <LogOut />
            <p className="font-bold text-sm">Log out</p>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
};

export default AppSideBar;
