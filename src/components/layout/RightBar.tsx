import { Filter, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

const RightBar = () => {
  return (
    <div className="border-l overflow-y-auto pb-40 px-6 pt-1 min-w-80 max-w-[602px] hidden md:flex min-h-screen justify-start flex-col ">
      {/*//TODO-> SEARCH  */}
      <div className="outline-1 justify-between  hover:outline-sky-500 py-2 mt-2 flex gap-1 rounded-full px-2 w-full">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent outline-none"
        />
        <Filter className="text-gray-500"/>
      </div>
      {/* //todo ==> WHATS HAPPENING(trending hashtags) */}
      <div className="outline-1 rounded-md mt-8 p-2">
        <h1 className="text-xl font-extrabold p-2">What&apos;s happening</h1>
        <div className="transition hover:bg-gray-500/30 w-full rounded-sm p-2">
          <p className="text-xs text-gray-500">Sports.Trending</p>
          <p className="">Chukwueze</p>
          <p className="text-xs text-gray-500">23.8 posts</p>
        </div>
        <div className="transition hover:bg-gray-500/30 w-full rounded-sm p-2">
          <p className="text-xs text-gray-500">Sports.Trending</p>
          <p className="">Chukwueze</p>
          <p className="text-xs text-gray-500">23.8 posts</p>
        </div>
        <div className="transition hover:bg-gray-500/30 w-full rounded-sm p-2">
          <p className="text-xs text-gray-500">Sports.Trending</p>
          <p className="">Chukwueze</p>
          <p className="text-xs text-gray-500">23.8 posts</p>
        </div>{" "}
        <div className="transition hover:bg-gray-500/30 w-full rounded-sm p-2">
          <p className="text-xs text-gray-500">Sports.Trending</p>
          <p className="">Chukwueze</p>
          <p className="text-xs text-gray-500">23.8 posts</p>
        </div>
        <Link
          href={`/connect?userId=klsdfjlsdajfl`}
          className="w-full hover:bg-gray-500/30 px-2 transition text-sky-500"
        >
          Show more
        </Link>
      </div>
      <div className="outline-1 rounded-md mt-8 p-2 w-full">
        <h1 className="text-xl font-extrabold">Who to follow</h1>
        <div className="p-2 flex justify-start items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">Volodmir Zelensky</p>
            <p className="text-gray-500 text-sm">@ZelenskyyUa</p>
          </div>
          <button className="bg-white/90 text-black font-bold px-4 py-2 rounded-full">
            Follow
          </button>
        </div>
        <div className="p-2 flex justify-start items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">Volodmir Zelensky</p>
            <p className="text-gray-500 text-sm">@ZelenskyyUa</p>
          </div>
          <button className="bg-white/90 text-black font-bold px-4 py-2 rounded-full">
            Follow
          </button>
        </div>
        <div className="p-2 flex justify-start items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">Volodmir Zelensky</p>
            <p className="text-gray-500 text-sm">@ZelenskyyUa</p>
          </div>
          <button className="bg-white/90 text-black font-bold px-4 py-2 rounded-full">
            Follow
          </button>
        </div>
        <div className="p-2 flex justify-start items-center gap-2">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">Volodmir Zelensky</p>
            <p className="text-gray-500 text-sm">@ZelenskyyUa</p>
          </div>
          <button className="bg-white/90 text-black font-bold px-4 py-2 rounded-full">
            Follow
          </button>
        </div>
        <Link
          href={`/connect?userId=klsdfjlsdajfl`}
          className="w-full hover:bg-gray-500/30 px-2 transition text-sky-500"
        >
          Show more
        </Link>
      </div>
    </div>
  );
};

export default RightBar;
