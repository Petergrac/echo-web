import ProfileBar from "@/components/profile/ProfileBar";
import ProfileMedia from "@/components/profile/ProfileMedia";
import ProfileTab from "@/components/profile/ProfileTab";
import { UserType } from "@/types/user-type";
const Profile = ({ user }: { user: UserType }) => {
  return (
    <>
      <ProfileBar username={user.username} postCount={user.postCount} />
      <ProfileMedia user={user} />
      <ProfileTab username={user.username} />
    </>
  );
};

export default Profile;
