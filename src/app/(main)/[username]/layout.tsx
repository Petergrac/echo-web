import ProfileClient from "@/components/profile/ProfileClient";

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
