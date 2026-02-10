/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDU8FmEFMi-_4OJveqoITG8K6bQkkSRtNo",
  authDomain: "blaybus-a6207.firebaseapp.com",
  projectId: "blaybus-a6207",
  storageBucket: "blaybus-a6207.firebasestorage.app",
  messagingSenderId: "750820519614",
  appId: "1:750820519614:web:aaa3ee68527e85db3378ef",
  measurementId: "G-B7W8EY3YPD",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  const title = notification.title || '알림';
  const options = {
    body: notification.body || '',
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});
