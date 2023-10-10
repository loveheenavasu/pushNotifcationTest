// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getMessaging, getToken, onMessage} from "firebase/messaging"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/messaging';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXS5HFQzScVIQY9ZPG5CrTOsRuia-ZNMw",
  authDomain: "notification-23222.firebaseapp.com",
  projectId: "notification-23222",
  storageBucket: "notification-23222.appspot.com",
  messagingSenderId: "11252937071",
  appId: "1:11252937071:web:f4da7c3f1cc6de1be9f89a",
  measurementId: "G-SZKP35DKC7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
firebase.initializeApp(firebaseConfig);


export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const messaging = getMessaging(app);


export const requestPermission = () => {

    console.log("Requesting User Permission......");
    Notification.requestPermission().then((permission) => {

      if (permission === "granted") {

        console.log("Notification User Permission Granted."); 
        return getToken(messaging, { vapidKey: `BOd5UVNfTVm0IglKifUK1IzxkfR31r9-9aHDSDoT47KqaTqs6XdD9SxCt5iIA40QcM-ACodGDpu4Li_Gc64RJT0` })
          .then((currentToken) => {

            if (currentToken) {

              console.log('Client Token: ', currentToken);
            } else {
              
              console.log('Failed to generate the app registration token.');
            }
          })
          .catch((err) => {

            console.log('An error occurred when requesting to receive the token.', err);
          });
      } else {

        console.log("User Permission Denied.");
      }
    });

  }



export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
        console.log(payload,"payload");
      resolve(payload);
    });
});
 