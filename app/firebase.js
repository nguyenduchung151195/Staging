import firebase from 'firebase/app';
import 'firebase/messaging';
import { AUTOMATION_URL } from './config/urlConfig';
import request from './utils/request';
import { clientId } from './variable';
var firebaseConfig = {
  apiKey: 'AIzaSyA3IhkzUOPFfs_koWuM2KitzjqWD7r6FvI',
  authDomain: 'erp-lifetek.firebaseapp.com',
  projectId: 'erp-lifetek',
  storageBucket: 'erp-lifetek.appspot.com',
  messagingSenderId: '615368670796',
  appId: '1:615368670796:web:a4d6959783f04f6b06fee9',
  measurementId: 'G-JVLQD1DB9G',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export const getToken = userId => {
  return messaging
    .getToken({ vapidKey: 'BFELdTIBho9x4GPpiY2BzbTqf-3Qz2lxhUD1i9-yivRNE6Ja75r4SLQiQLFS4jm8uy7ZzO7N2zrsOHS2jE6W06I' })
    .then(currentToken => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        localStorage.setItem('firebaseToken', currentToken);
        localStorage.setItem('userId', userId);
        request(`${AUTOMATION_URL}/api/register-fcm-token`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            token: currentToken,
            clientId
          })
        })
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log('No registration token available. Request permission to generate one.');
        // shows on the UI that permission is required
      }
    })
    .catch(err => {
      console.log('An error occurred while retrieving token. ', err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
});