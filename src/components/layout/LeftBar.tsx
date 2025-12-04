import {
  BellIcon,
  Bookmark,
  Feather,
  Home,
  MessageCircle,
  MessageSquareIcon,
  MoreHorizontal,
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
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

const LeftBar = () => {
  return (
    <div className="outline-1 min-w-20 max-w-[602px] max-h-screen flex flex-col justify-between sticky top-0 left-0">
      <div className="flex flex-col pt-10 justify-between items-center md:items-start">
        <Link href="" className="icon-hover">
          <Home />
          <p className="hidden md:block">Home</p>
        </Link>
        <Link href="" className="icon-hover">
          <Search />
          <p className="hidden md:block">Explore</p>
        </Link>
        <Link href="" className="icon-hover">
          <BellIcon />
          <p className="hidden md:block">Notifications</p>
        </Link>
        <Link href="" className="icon-hover">
          <MessageSquareIcon />
          <p className="hidden md:block">Messages</p>
        </Link>
        <Link href="" className="icon-hover">
          <Bookmark />
          <p className="hidden md:block">Bookmarks</p>
        </Link>
        <Link href="" className="icon-hover">
          <User2 />
          <p className="hidden md:block">Profile</p>
        </Link>

        <div className="icon-hover">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center justify-center gap-2">
                <MoreHorizontal />
                <p className="hidden md:block">More</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={`/messages`} className="drop-left justify-start">
                  <MessageCircle />
                  <p>Chats</p>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/settings`} className="drop-left justify-start">
                  <Settings />
                  <p>Settings</p>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Link
          href=""
          className="icon-hover w-full justify-center md:justify-start"
        >
          <Feather
            className="md:hidden bg-white rounded-full justify-center"
            size={40}
            fill="black"
          />
          <p className="hidden md:block w-full py-1 bg-white/90 rounded-2xl text-black font-bold text-center">
            Post
          </p>
        </Link>
      </div>
      <div className="w-full  py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none pl-5 py-1  hover:bg-gray-500/20 rounded-full flex items-center justify-between pr-5 gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="md:flex flex-col items-center cursor-pointer hidden ">
              <p>JohnDoe</p>
              <p className="">@JohnDoez</p>
            </div>
            <MoreHorizontal className="md:block hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="backdrop-blur-2xl shadow-md shadow-white/30">
            <DropdownMenuItem>
              <Link
                href={`/login`}
                className="font-bold hover:bg-gray-400/20 cursor-pointer p-2 w-full rounded-2xl"
              >
                Log in to another account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={`/logout`}
                className="font-bold hover:bg-gray-400/20 cursor-pointer p-2 w-full rounded-2xl"
              >
                Log out @JohnDoe
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LeftBar;
