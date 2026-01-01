import api from "./axios";
import {
  Notification,
  UnreadCountResponse,
} from "@/types/notification";

class NotificationsService {

  async getUnreadCount() {
    return api.get<UnreadCountResponse>("/notifications/unread-count");
  }

  async markAsRead(notificationId: string) {
    return api.patch<Notification>(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead() {
    return api.patch<{ message: string }>("/notifications/read-all");
  }

  async deleteNotification(notificationId: string) {
    return api.delete<{ message: string }>(`/notifications/${notificationId}`);
  }
}

export const notificationsService = new NotificationsService();
