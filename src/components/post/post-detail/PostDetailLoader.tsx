import { Skeleton } from "../../ui/skeleton";

const PostDetailLoader = () => {
  return (
    <div className="pl-5">
      <div className="flex items-center max-w-full justify-between">
        <Skeleton className="rounded-full w-20 h-20" />
        <Skeleton className="rounded-2xl w-20 h-10" />
      </div>
      <div className="pt-4">
        <Skeleton className="h-10 w-full rounded-full pt-5" />
      </div>
      <div className="pt-2">
        <Skeleton className="h-50" />
      </div>
      <div className="pt-1">
        <Skeleton className="h-5 w-full" />
      </div>

      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="pt-4">
          <Skeleton className="h-10 w-full" />{" "}
        </div>
      ))}
    </div>
  );
};

export default PostDetailLoader;
