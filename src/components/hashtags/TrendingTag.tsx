"use client";

import { useTrendingTags } from "@/lib/hooks/useGeneralHook";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export interface TagType {
  id: string;
  tag: string;
}
const TagComponent = () => {
  //* 0.Get Trending tags
  const { data: trendingTags, isLoading, isError } = useTrendingTags();
  if (isLoading) {
    return <Skeleton className="h-5 w-full rounded-2xl mt-20" />;
  }
  if (isError) {
    return (
      <p className="text-center text-red-800  mt-20">
        Error Loading Trending Tags
      </p>
    );
  }
  return (
    <>
      <p className="text-center text-gray-400 text-sm  mt-20">
        Trending Hashtags
      </p>
      <div className="my-3 flex items-center justify-center gap-4">
        {trendingTags?.map((tag: TagType) => (
          <Link
            href={`/hashtag/${tag.tag}/`}
            key={tag.id}
            className="text-sm hover:bg-[#0070ef] transition font-bold bg-sky-900 rounded-2xl px-4 text-sky-500"
          >
            #{tag.tag}
          </Link>
        ))}
      </div>
    </>
  );
};

export default TagComponent;
