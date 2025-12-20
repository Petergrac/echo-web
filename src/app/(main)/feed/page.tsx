"use client";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import TweetComposer from "@/components/post/create-post/TweetComposer";
import PostsList from "@/components/post/view-post(s)/PostList";

const Feed = () => {
  const [feedType, setFeedType] = useState<"forYou" | "following">("forYou");

  return (
    <div className="flex flex-col w-full">
      <TopBar onFeedTypeChange={setFeedType} currentFeedType={feedType} />
      <TweetComposer feedType={feedType} />
      <PostsList feedType={feedType} />
    </div>
  );
};

export default Feed;
