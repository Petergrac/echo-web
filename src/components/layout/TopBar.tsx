"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSidebar } from "../ui/sidebar";
import { useCurrentUser } from "@/stores/useStore";
import clsx from "clsx";

interface TopBarProps {
  onFeedTypeChange?: (type: "forYou" | "following") => void;
  currentFeedType?: "forYou" | "following";
}

const TopBar = ({
  onFeedTypeChange,
  currentFeedType = "forYou",
}: TopBarProps) => {
  const { toggleSidebar } = useSidebar();
  const user = useCurrentUser();

  const handleTabClick = (type: "forYou" | "following") => {
    if (onFeedTypeChange) {
      onFeedTypeChange(type);
    }
  };

  return (
    <div className="fixed top-0 z-56 w-full bg-black/80 backdrop-blur-2xl flex-col supports-backdrop-filter:bg-background/80 flex sm:w-[600px] outline">
      <div className="pl-6 pt-4 sm:hidden" onClick={toggleSidebar}>
        <Avatar>
          <AvatarImage src={user?.avatar || `https://github.com/shadcn.png`} />
          <AvatarFallback>
            {user &&
              user?.firstName.slice(0, 1).toUpperCase() +
                user?.lastName.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <nav className="w-full justify-around flex">
        <button
          onClick={() => handleTabClick("forYou")}
          className={clsx(
            "pt-3 pb-1 text-xl transition-all duration-200",
            currentFeedType === "forYou"
              ? "border-b-4 border-sky-600 font-bold"
              : "text-gray-500 hover:text-gray-300"
          )}
        >
          For You
        </button>
        <button
          onClick={() => handleTabClick("following")}
          className={clsx(
            "pt-3 pb-1 text-xl transition-all duration-200",
            currentFeedType === "following"
              ? "border-b-4 border-sky-600 font-bold"
              : "text-gray-500 hover:text-gray-300"
          )}
        >
          Following
        </button>
      </nav>
    </div>
  );
};

export default TopBar;
