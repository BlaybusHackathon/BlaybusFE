import { useCallback, useEffect, useRef } from 'react';
import { useAuthStore, getAuthToken, isTokenValid } from '@/shared/stores/authStore';
import { userApi } from '@/features/user/api/userApi';
import { requestFcmToken } from '@/firebase';

type RegisterOptions = {
  askPermission?: boolean;
};

type UseFcmRegistrationOptions = {
  auto?: boolean;
};

export const useFcmRegistration = (options?: UseFcmRegistrationOptions) => {
  const { user, setUser } = useAuthStore();
  const lastTokenRef = useRef<string | null>(null);
  const inFlightRef = useRef<Promise<string | null> | null>(null);

  useEffect(() => {
    lastTokenRef.current = null;
  }, [user?.id]);

  const registerFcmToken = useCallback(
    async (registerOptions?: RegisterOptions): Promise<string | null> => {
      if (!user) return null;
      const authToken = getAuthToken();
      if (!isTokenValid(authToken)) return null;
      if (inFlightRef.current) return inFlightRef.current;

      const run = async () => {
        const token = await requestFcmToken(registerOptions);
        if (!token) return null;
        if (lastTokenRef.current === token) return token;

        lastTokenRef.current = token;
        try {
          await userApi.registerFcmToken(token);
          if (user.fcmToken !== token) {
            setUser({ ...user, fcmToken: token });
          }
        } catch {
          // ignore registration errors
        }

        return token;
      };

      const inFlight = run().finally(() => {
        inFlightRef.current = null;
      });
      inFlightRef.current = inFlight;
      return inFlight;
    },
    [user, setUser]
  );

  useEffect(() => {
    if (options?.auto === false) return;
    if (!user) return;
    void registerFcmToken({ askPermission: false });
  }, [options?.auto, registerFcmToken, user]);

  return { registerFcmToken };
};
