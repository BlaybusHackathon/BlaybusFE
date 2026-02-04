import { NotificationType } from '@/shared/constants/enums';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
}

export const mapNotificationFromApi = (raw: any): Notification => ({
  id: String(raw.id),
  type: raw.type,
  message: raw.message,
  isRead: raw.is_read,
  createdAt: raw.created_at,
  userId: String(raw.user_id),
});