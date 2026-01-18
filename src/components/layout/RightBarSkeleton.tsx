"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Home,
  Search,
  BellIcon,
  MessageSquareIcon,
  Bookmark,
  User2,
} from "lucide-react";

const RightBarSkeleton = () => {
  const navItems = [
    { icon: Home },
    { icon: Search },
    { icon: BellIcon },
    { icon: MessageSquareIcon },
    { icon: Bookmark },
    { icon: User2 },
  ];

  return (
    <div className="min-w-20 max-w-[602px] h-screen flex flex-col justify-between sticky top-0 left-0 border-l border-border bg-background">
      <div className="flex flex-col pt-10 justify-between items-center md:items-start px-2 md:px-6">
        {/* Navigation Skeletons */}
        {navItems.map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-3 w-fit">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="hidden md:block h-5 w-16 rounded" />
          </div>
        ))}

        {/* More Button Skeleton */}
        <div className="flex items-center gap-3 p-3 w-fit">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="hidden md:block h-5 w-12 rounded" />
        </div>

        {/* Post Button Skeleton */}
        <div className="mt-6 w-full md:w-auto">
          <Skeleton className="w-12 h-12 rounded-full md:hidden mx-auto" />
          <Skeleton className="hidden md:block h-10 w-24 rounded-full" />
        </div>
      </div>

      {/* User Profile Skeleton */}
      <div className="p-2 md:p-4">
        <div className="flex items-center gap-3 p-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="hidden md:flex flex-col items-start flex-1 gap-1">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
          </div>
          <Skeleton className="hidden md:block w-5 h-5 rounded" />
        </div>
      </div>
    </div>
  );
};

export default RightBarSkeleton;