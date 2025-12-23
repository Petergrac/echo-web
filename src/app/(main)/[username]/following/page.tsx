"use client";
import ProfileBar from "@/components/profile/ProfileBar";
import FollowCard from "@/components/shared/followers";
import FollowTabs from "@/components/shared/FollowTab";
import InfiniteScrollTrigger from "@/components/shared/infiniteScrollTrigger";
import api from "@/lib/api/axios";
import { useUniversalInfiniteQuery } from "@/lib/hooks/useUniversalInfiniteQuery";
import { UserType } from "@/types/user-type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const UserFollowers = () => {
  const { username } = useParams() as { username: string };
  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useQuery<UserType>({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await api.get(`users/${username}`);
      return response.data;
    },
  });
  //* Fetch user followers
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUniversalInfiniteQuery<UserType>(
    ["user", username, "followers"],
    `users/${username}/followers`,
    15
  );
  if (isLoading || userLoading) return;
  if (isError || userError) {
    return <p className="py-10">Failed to load user following</p>;
  }
  //* 2. Flatten the nested pages into a single array
  const rawUsers = data?.pages.flatMap((page) => page.items) ?? [];

  //* 3. Deduplicate by post ID
  const allFollowers = Array.from(
    new Map(rawUsers.map((user) => [user.id, user])).values()
  );
  if (!user) return;
  return (
    <>
      <ProfileBar username={user.username} firstName={user.firstName} />
      <div className="pt-15" />
      <FollowTabs username={user.username} />
      {allFollowers.length > 0 &&
        allFollowers.map((follower) => (
          <FollowCard
            followType="following"
            user={follower}
            key={follower.id}
          />
        ))}
      <InfiniteScrollTrigger
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export default UserFollowers;
