import { SearchBar } from "../rightBar/SearchBar";
import { TrendingList } from "../rightBar/TrendingList";
import { WhoToFollow } from "../rightBar/WhoToFollow";

const RightBar = () => {
  return (
    <aside className="border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto pb-20 px-6 pt-2 min-w-80 max-w-[400px] hidden md:flex flex-col gap-4">
      <div className="sticky top-0 bg-background/80 backdrop-blur-md pt-1 pb-2 z-10">
        <SearchBar />
      </div>

      <TrendingList />
      <WhoToFollow />

      <div className="px-4 text-[13px] text-zinc-500 flex flex-wrap gap-x-3 gap-y-1">
        <span className="hover:underline cursor-pointer">Terms of Service</span>
        <span className="hover:underline cursor-pointer">Privacy Policy</span>
        <span className="hover:underline cursor-pointer">Accessibility</span>
        <span>© 2026 Echo Corp.</span>
      </div>
    </aside>
  );
};

export default RightBar;
