export type UserRole = 'MENTOR' | 'MENTEE';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}