import ProfileClient from "@/components/profile/ProfileClient";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: username.toUpperCase(),
  };
}
export default async function UserProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return <ProfileClient username={username}>{children}</ProfileClient>;
}
