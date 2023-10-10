/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyDXS5HFQzScVIQY9ZPG5CrTOsRuia-ZNMw",
  authDomain: "notification-23222.firebaseapp.com",
  projectId: "notification-23222",
  storageBucket: "notification-23222.appspot.com",
  messagingSenderId: "11252937071",
  appId: "1:11252937071:web:f4da7c3f1cc6de1be9f89a",
  measurementId: "G-SZKP35DKC7",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  if (event.action) {
    clients.openWindow(event.action);
  }
  event.notification.close();
});
