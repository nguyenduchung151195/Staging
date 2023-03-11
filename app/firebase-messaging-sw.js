// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.7.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyA3IhkzUOPFfs_koWuM2KitzjqWD7r6FvI',
  authDomain: 'erp-lifetek.firebaseapp.com',
  projectId: 'erp-lifetek',
  storageBucket: 'erp-lifetek.appspot.com',
  messagingSenderId: '615368670796',
  appId: '1:615368670796:web:a4d6959783f04f6b06fee9',
  measurementId: 'G-JVLQD1DB9G',
  applicationServerKey: 'YsmbhOD3VTUnehGRrFeZx4UK3sxRSIY39gOfFd8TJIw',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
