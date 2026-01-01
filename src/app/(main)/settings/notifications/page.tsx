"use client";

import NotificationPreferences from "@/components/notifications/NotificationPreferences";
import NotificationPreferencesSummary from "@/components/notifications/NotificationPreferencesSummary";
import BackBar from "@/components/post/post-detail/Back-Bar";
import api from "@/lib/api/axios";
import { NotPrefDto } from "@/types/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<NotPrefDto>({
    queryKey: ["user-preferences"],
    queryFn: async () => {
      const { data } = await api.get(`notifications/preferences`);
      return data;
    },
  });
  const notificationMutation = useMutation({
    mutationFn: (preferences: NotPrefDto) => {
      return api.patch("notifications/preferences", preferences);
    },
    onSuccess: () => {
      toast.success("All preferences saved successfully");
      queryClient.invalidateQueries({
        queryKey: ["user-preferences"],
      });
    },
    onError: () => {
      toast.error("Failed to save preferences. Changes reverted.");
    },
  });
  if (isLoading) return null;
  if (isError)
    return (
      <div className="py-20">
        <p className="text-center text-red-500">
          Failed to load notification preferences
        </p>
      </div>
    );
  const handleSave = async (data: NotPrefDto) => {
    const { userId, posts, id, ...filteredData } = data;
    notificationMutation.mutate(filteredData as NotPrefDto);
  };
  return (
    <>
      <BackBar type="Notifications" />
      <div className="pt-15"/>
      <NotificationPreferences initialData={data} onSave={handleSave} />
      <div className="px-4 pb-5">
        <NotificationPreferencesSummary preferences={data!} />
      </div>
    </>
  );
}
