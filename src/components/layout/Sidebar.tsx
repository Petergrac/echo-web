"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sidebar, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Bookmark, LogOut, MessageCircle, Settings, User } from "lucide-react";
const links = [
  {
    url: "/chat",
    icon: MessageCircle,
    index: 1,
    name: "Chat",
  },
  {
    url: "/profile",
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
  {
    url: "/logout",
    icon: LogOut,
    index: 5,
    name: "Log Out",
  },
];
const AppSideBar = () => {
  return (
    <Sidebar>
      <SidebarMenu className="pl-5 pt-5 bg-black h-full outline-none border-none">
        <SidebarMenuItem className="">
          <Link href={`/johndoe`}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <p className="font-bold">JohnDoe</p>
          <p className="text-sm text-gray-500">@johndoe</p>

          <div className="flex justify-start gap-4 pt-5">
            <p className="text-gray-500 text-sm">
              <span className="font-bold text-white">120 </span> following
            </p>
            <p className="text-gray-500 text-sm">
              <span className="font-bold text-white">200 </span> followers
            </p>
          </div>
          <div className="pt-5">
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
        </SidebarMenuItem>
      </SidebarMenu>
    </Sidebar>
  );
};

export default AppSideBar;
