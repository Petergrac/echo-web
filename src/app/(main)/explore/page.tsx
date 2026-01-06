"use client";
import ExploreTabs from "@/components/explore/ExploreTabs";
import PostsList from "@/components/explore/PostList";
import TopBar from "@/components/explore/TopBar";
import { useState } from "react";

const Explore = () => {
  const [feedType, setFeedType] = useState<string>("for-you");
  return (
    <>
      <TopBar />
      <ExploreTabs setType={setFeedType} />
      <PostsList feedType={feedType} />
    </>
  );
};

export default Explore;
