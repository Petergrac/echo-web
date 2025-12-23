"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Followers", href: "/followers" },
  { name: "Following", href: "/following" },
];

const FollowTabs = ({ username }: { username: string }) => {
  const pathname = usePathname();
  return (
    <div className="flex border-b border-gray-800 mt-2">
      {tabs.map((tab) => {
        const fullHref = `/${username}${tab.href}`;
        const isActive = pathname === fullHref;

        return (
          <Link
            key={tab.name}
            href={fullHref}
            className={`flex-1 flex justify-center hover:bg-white/10 transition pb-4 pt-4 relative`}
          >
            <span
              className={`${
                isActive ? "font-bold text-white" : "text-gray-500"
              }`}
            >
              {tab.name}
            </span>
            {isActive && (
              <div className="absolute bottom-0 h-1 w-16 bg-sky-500 rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default FollowTabs;
