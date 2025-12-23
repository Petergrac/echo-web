"use client";

import {
  BellIcon,
  Bookmark,
  Feather,
  Home,
  MessageCircle,
  MessageSquareIcon,
  MoreHorizontal,
  RefreshCcwIcon,
  Search,
  Settings,
  User2,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuthStore, useCurrentUser } from "@/lib/hooks/useStore";
import api from "@/lib/api/axios";

const LeftBar = () => {
  const router = useRouter();

  const user = useCurrentUser();
  const { logout, refreshUser } = useAuthStore();

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Explore" },
    { href: "/notifications", icon: BellIcon, label: "Notifications" },
    { href: "/messages", icon: MessageSquareIcon, label: "Messages" },
    { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { href: `/${user?.username || ""}`, icon: User2, label: "Profile" },
  ];
  async function handleLogout() {
    logout();
    //* Logout from the server
    await api.get("/auth/logout");
    //* Redirect user to login page
    router.replace("/login");
  }
  return (
    <div className="max-w-[602px] h-screen flex flex-col justify-between sticky top-0 left-0 border-r border-border">
      <div className="flex flex-col pt-10 justify-between items-center md:items-start px-2 md:px-6 w-full">
        <div
          onClick={() => refreshUser()}
          className="pl-3 hidden  gap-2 md:flex items-center justify-start"
        >
          <RefreshCcwIcon />
          <p className="text-sm">Refresh User</p>
        </div>
        {/* Navigation Items */}
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center  gap-3 p-3 rounded-full hover:bg-accent transition-colors w-fit group"
          >
            <item.icon className="w-6 h-6" />
            <span className="hidden md:inline text-lg">{item.label}</span>
            <span className="md:hidden sr-only">{item.label}</span>
          </Link>
        ))}

        {/* More Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 p-3 rounded-full hover:bg-accent transition-colors w-fit outline-none">
            <MoreHorizontal className="w-6 h-6" />
            <span className="hidden md:inline text-lg">More</span>
            <span className="md:hidden sr-only">More</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-black glow">
            <DropdownMenuItem asChild>
              <Link
                href="/chats"
                className="flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chats</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Post Button */}
        <button className="mt-6 flex items-center outline-6 justify-center gap-2 p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full">
          <Feather className="w-6 h-6 md:hidden" />
          <span className="hidden md:inline font-bold w-full">Post</span>
          <span className="md:hidden sr-only">Post</span>
        </button>
      </div>

      {/* User Profile Dropdown */}
      <div className="p-2 md:p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none w-full">
            <div className="flex items-center gap-3 p-2 rounded-full hover:bg-accent transition-colors">
              <Avatar>
                <AvatarImage
                  src={user?.avatar || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start flex-1">
                <p className="font-semibold truncate">
                  {user?.firstName || "User"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  @{user?.username || "username"}
                </p>
              </div>
              <MoreHorizontal className="hidden md:block w-5 h-5 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56 bg-black glow">
            <DropdownMenuItem asChild>
              <button
                onClick={() => router.push(`/${user?.username}`)}
                className="w-full flex items-center gap-2 cursor-pointer"
              >
                <User2 className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                onClick={() => router.push("/bookmarks")}
                className="w-full flex items-center gap-2 cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                <span>Bookmarks</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/settings"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                onClick={() => router.push("/login")}
                className="w-full flex items-center gap-2 cursor-pointer"
              >
                <User2 className="w-4 h-4" />
                <span>Switch Account</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LeftBar;
