import { UserRole } from '@/shared/constants/enums';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  nickName: string;
  role: UserRole;
  profileImgUrl: string | null;
  fcmToken: string;
  isAlarmEnabled: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export const mapUserFromApi = (raw: any): User => ({
  id: String(raw.id),
  username: raw.username,
  name: raw.name,
  nickName: raw.nick_name,
  role: raw.role,
  profileImgUrl: raw.profile_img_url,
  fcmToken: raw.fcm_token,
  isAlarmEnabled: raw.is_alarm_enabled,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});