import { Skeleton } from "../ui/skeleton";

const ProfileLoader = () => {
  return (
    <div className="mt-14 relative">
      {/* Banner Image Skeleton */}
      <Skeleton className="h-50 aspect-video w-full" />

      {/* Profile Avatar Skeleton */}
      <div className="absolute left-4 top-38">
        {" "}
        {/* Matches profile-icon positioning */}
        <Skeleton className="h-[120px] w-[120px] rounded-full border-4 border-black" />
      </div>

      {/* Action Button (Edit/Follow) Skeleton */}
      <div className="w-full pr-5 flex justify-end">
        <Skeleton className="h-10 w-24 my-3 rounded-full" />
      </div>

      {/* Profile Details Skeleton */}
      <div className="flex flex-col pl-4 mt-5 space-y-3">
        {/* Name and Username */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Name */}
          <Skeleton className="h-4 w-32" /> {/* @username */}
        </div>

        {/* Bio Lines */}
        <div className="space-y-2 mt-2">
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>

        {/* Joined Date */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-5 w-5 rounded-full" /> {/* Calendar Icon */}
          <Skeleton className="h-4 w-36" />
        </div>

        {/* Followers / Following Stats */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
};

export default ProfileLoader;
