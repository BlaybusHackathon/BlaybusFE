import { UserRole } from '@/shared/constants/enums';
import { asRecord, asString, asOptionalString, asEnum, asOptionalBoolean, pick } from '@/shared/api/parse';

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  nickName: string;
  role: UserRole;
  profileImgUrl: string | null;
  fcmToken?: string;
  isAlarmEnabled: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

const USER_ROLE_VALUES: readonly UserRole[] = ['MENTOR', 'MENTEE', 'WITH_DRAW'];

export const mapUserFromApi = (raw: unknown): User => {
  const obj = asRecord(raw, 'User');
  return {
    id: asString(pick(obj, ['userId', 'id']), 'User.id'),
    username: asString(pick(obj, ['username']), 'User.username'),
    name: asString(pick(obj, ['name']), 'User.name'),
    nickName:
      asOptionalString(pick(obj, ['nickname', 'nickName', 'nick_name']), 'User.nickName') ?? '',
    role: asEnum(pick(obj, ['role']), USER_ROLE_VALUES, 'User.role'),
    profileImgUrl:
      asOptionalString(pick(obj, ['profileUrl', 'profile_img_url', 'profileImageUrl', 'profileImgUrl']), 'User.profileImgUrl') ?? null,
    fcmToken: asOptionalString(pick(obj, ['fcmToken', 'fcm_token']), 'User.fcmToken'),
    isAlarmEnabled: asOptionalBoolean(pick(obj, ['isAlarmEnabled', 'is_alarm_enabled']), 'User.isAlarmEnabled') ?? false,
    createdAt: asOptionalString(pick(obj, ['createdAt', 'created_at']), 'User.createdAt'),
    updatedAt: asOptionalString(pick(obj, ['updatedAt', 'updated_at']), 'User.updatedAt') ?? null,
  };
};
