import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, type MessagePayload } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

const app = initializeApp(firebaseConfig);
const isBrowser = typeof window !== 'undefined';
let swRegistration: ServiceWorkerRegistration | null = null;
let swRegisterPromise: Promise<ServiceWorkerRegistration | null> | null = null;

const getMessagingIfSupported = async () => {
  if (!isBrowser) return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

const registerMessagingServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isBrowser || !('serviceWorker' in navigator)) return null;
  if (swRegistration) return swRegistration;
  if (swRegisterPromise) return swRegisterPromise;

  swRegisterPromise = navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      swRegistration = registration;
      return registration;
    })
    .catch(() => null);

  return swRegisterPromise;
};

type RequestFcmTokenOptions = {
  askPermission?: boolean;
};

export async function requestFcmToken(options?: RequestFcmTokenOptions): Promise<string | null> {
  if (!isBrowser || !('Notification' in window)) return null;
  if (Notification.permission === 'denied') return null;

  if (Notification.permission !== 'granted') {
    if (!options?.askPermission) return null;
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;
  }

  const messaging = await getMessagingIfSupported();
  if (!messaging || !vapidKey) return null;
  const serviceWorkerRegistration = await registerMessagingServiceWorker();

  try {
    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: serviceWorkerRegistration ?? undefined,
    });
    return token ?? null;
  } catch {
    return null;
  }
}

export async function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): Promise<(() => void) | null> {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return null;
  return onMessage(messaging, callback);
}
