"use client";
import ExploreTabs from "@/components/explore/ExploreTabs";
import PostsList from "@/components/explore/PostList";
import TopBar from "@/components/explore/TopBar";
import BackBar from "@/components/post/post-detail/Back-Bar";
import { useState } from "react";

const Explore = () => {
  const [feedType, setFeedType] = useState<string>("for-you");
  return (
    <>
      <BackBar type="Explore" />
      <div className="mt-15">
        <TopBar />
        <ExploreTabs setType={setFeedType} />
        <PostsList feedType={feedType} />
      </div>
    </>
  );
};

export default Explore;
