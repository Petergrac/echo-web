"use client";
import TwitterSearch from "./Search";

const TopBar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4 px-4">
        <div className="flex-1 max-w-[600px]">
          <TwitterSearch />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
