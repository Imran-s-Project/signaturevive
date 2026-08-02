/* =========================================================
   Firebase config
   👉 ফায়ারবেস কনসোল থেকে তোমার প্রজেক্টের config বসাও নিচে।
   Firebase Console → Project settings → General → Your apps → SDK setup
   ========================================================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
     }
   }
   ========================================================= */
