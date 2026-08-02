/* =========================================================
   Firebase config
   👉 ফায়ারবেস কনসোল থেকে তোমার প্রজেক্টের config বসাও নিচে।
   Firebase Console → Project settings → General → Your apps → SDK setup
   ========================================================= */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBygErKd9KNDSjLfolfOPNZjRzCMlAkSsk",
  authDomain: "signatureviveshop.firebaseapp.com",
  projectId: "signatureviveshop",
  storageBucket: "signatureviveshop.firebasestorage.app",
  messagingSenderId: "1081797384994",
  appId: "1:1081797384994:web:7387641f19dfed1d93637b",
  measurementId: "G-B6PP7VCMS4"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

/* =========================================================
   Firestore নিরাপত্তা নিয়ম (Console → Firestore → Rules এ বসাও):

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, update: if request.auth != null && request.auth.uid == userId;
         allow create: if request.auth != null;
       }
       match /orders/{orderId} {
         allow create: if request.auth != null;
         allow read: if request.auth != null &&
           (resource.data.uid == request.auth.uid);
       }
       match /reviews/{reviewId} {
         allow read: if true;
         allow create: if request.auth != null &&
           request.auth.uid == request.resource.data.uid;
         allow update: if request.auth != null &&
           request.auth.uid == resource.data.uid &&
           request.auth.uid == request.resource.data.uid;
         allow delete: if request.auth != null &&
           request.auth.uid == resource.data.uid;
       }
       match /newsletter_subscribers/{email} {
         allow create, update: if true;
         allow read, delete: if false;
       }
     }
   }
   ========================================================= */
