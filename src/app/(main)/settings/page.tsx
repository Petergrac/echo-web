"use client";
import BackBar from "@/components/post/post-detail/Back-Bar";
import { useCurrentUser } from "@/stores/useStore";
import Link from "next/link";

const Settings = () => {
  const user = useCurrentUser();
  return (
    <>
      <BackBar type="Settings" />
      <div className="flex flex-col w-full justify-start px-4 gap-4 pt-18">
        <Link
          className="hover:bg-muted rounded-sm py-2"
          href={`/settings/notifications`}
        >
          Notification Preferences
        </Link>
        <Link
          className="hover:bg-muted rounded-sm py-2"
          href={`/notifications`}
        >
          Your Notifications
        </Link>
        <Link
          className="hover:bg-muted rounded-sm py-2"
          href={`/${user && user.username}`}
        >
          Your Profile
        </Link>
      </div>
    </>
  );
};

export default Settings;
