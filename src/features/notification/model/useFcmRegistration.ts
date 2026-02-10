import { useEffect, useRef } from 'react';
import { useAuthStore, getAuthToken, isTokenValid } from '@/shared/stores/authStore';
import { userApi } from '@/features/user/api/userApi';
import { requestFcmToken } from '@/firebase';

export const useFcmRegistration = () => {
  const { user, setUser } = useAuthStore();
  const lastTokenRef = useRef<string | null>(null);
  const requestedRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    const authToken = getAuthToken();
    if (!isTokenValid(authToken)) return;
    if (requestedRef.current) return;
    requestedRef.current = true;

    let cancelled = false;

    const run = async () => {
      const token = await requestFcmToken();
      if (cancelled || !token) return;
      if (lastTokenRef.current === token) return;

      lastTokenRef.current = token;
      try {
        await userApi.registerFcmToken(token);
        if (user.fcmToken !== token) {
          setUser({ ...user, fcmToken: token });
        }
      } catch {
        // ignore registration errors
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [user, setUser]);
};
