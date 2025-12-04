import { Bell, Home, MessageCircleMoreIcon, Search } from "lucide-react";
import Link from "next/link";

const BottomBar = () => {
  return (
    <div className="fixed bottom-30 left-0 justify-between py-4 px-7 w-[480px] flex items-center outline">
      <Link href={`/home`}>
        <Home color="#beef00" />
      </Link>
      <Link href={`/search`}>
        <Search />
      </Link>
      <Link href={`/notifications`}>
        <Bell />
      </Link>
      <Link href={`/chats`}>
        <MessageCircleMoreIcon />
      </Link>
    </div>
  );
};

export default BottomBar;
