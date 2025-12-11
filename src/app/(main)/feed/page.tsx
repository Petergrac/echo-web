import TopBar from "@/components/layout/TopBar";
import TweetComposer from "@/components/post/TweetComposer";

const Feed = () => {
  return (
    <div className="flex flex-col w-full">
      <TopBar />
      <TweetComposer />
    </div>
  );
};

export default Feed;
