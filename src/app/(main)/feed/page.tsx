import TopBar from "@/components/layout/TopBar";
import TweetComposer from "@/components/post/create-post/TweetComposer";
import PostsList from "@/components/post/PostList";

const Feed = () => {
  return (
    <div className="flex flex-col w-full">
      <TopBar />
      <TweetComposer />
      <PostsList />
    </div>
  );
};

export default Feed;
