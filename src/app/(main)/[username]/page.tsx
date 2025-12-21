"use client";
import ProfileBar from "@/components/profile/ProfileBar";
import ProfileMedia from "@/components/profile/ProfileMedia";
import api from "@/lib/api/axios";
import { UserType } from "@/types/user-type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const { username } = useParams();
  //* Fetch user
  const {
    data: user,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const response = await api.get(`users/${username}`);
      return response.data as UserType;
    },
  });
  if (isLoading) return <p>Loading....</p>;
  if (isError) {
    <p className="">Failed to fetch user {error.message}</p>;
  }
  if (!user) return <div>There is no user</div>;
  return (
    <>
      <ProfileBar username={user.username} postCount={user.postCount} />
      <ProfileMedia user={user} />
    </>
  );
};

export default ProfilePage;
