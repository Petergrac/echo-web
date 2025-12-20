import { Skeleton } from "@/components/ui/skeleton";

const ReplyLoader = () => {
  return (
    <div className="ml-3">
      <div className="flex gap-3 items-center pt-5 pb-2">
        <Skeleton className="w-15 h-15 rounded-full" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-10 w-60 mb-3" />
      <Skeleton className="h-10 w-30" />
    </div>
  );
};

export default ReplyLoader;
