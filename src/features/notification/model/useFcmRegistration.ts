import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/shared/stores/authStore';
import { userApi } from '@/features/user/api/userApi';

export const useFcmRegistration = () => {
  const { user, setUser } = useAuthStore();
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const token = user.fcmToken || '';
    if (!token) return;
    if (lastTokenRef.current === token) return;

    lastTokenRef.current = token;
    userApi
      .registerFcmToken(token)
      .then(() => {
        if (user.fcmToken !== token) {
          setUser({ ...user, fcmToken: token });
        }
      })
      .catch(() => {});
  }, [user, setUser]);
};
