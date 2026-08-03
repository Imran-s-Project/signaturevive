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
const storage = firebase.storage();
const googleProvider = new firebase.auth.GoogleAuthProvider();

/* =========================================================
   Firestore নিরাপত্তা নিয়ম (Console → Firestore → Rules এ বসাও):

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, update: if request.auth != null && request.auth.uid == userId;
         allow create: if request.auth != null && request.auth.uid == userId;
       }
       match /orders/{orderId} {
         // এখন গেস্ট চেকআউট বন্ধ — অর্ডার শুধু লগইন করা ইউজারই বানাতে পারবে,
         // আর orderData.uid অবশ্যই তার নিজের uid হতে হবে (অন্য কারো নামে ফেক
         // অর্ডার বসানো ঠেকাতে)। status/total/items ফিল্ডও যাচাই করা হয়।
         allow create: if request.auth != null
           && request.resource.data.uid == request.auth.uid
           && request.resource.data.status == "pending"
           && request.resource.data.items is list
           && request.resource.data.items.size() > 0
           && request.resource.data.total is number
           && request.resource.data.total > 0;
         allow read: if request.auth != null &&
           (resource.data.uid == request.auth.uid);
         allow update, delete: if false;
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
         allow create: if true;
         allow get: if true;
         allow update, list, delete: if false;
       }
     }
   }
   ========================================================= */

/* =========================================================
   Firebase Storage নিরাপত্তা নিয়ম (Console → Storage → Rules এ বসাও):
   এটা প্রোফাইল ফটো আপলোডের জন্য — প্রতিটা ইউজার শুধু নিজের uid
   ফোল্ডারেই আপলোড করতে পারবে, ছবি ৫MB-এর কম আর ইমেজ ফাইলই হতে হবে।

   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /avatars/{userId}/{fileName} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == userId
           && request.resource.size < 5 * 1024 * 1024
           && request.resource.contentType.matches('image/.*');
       }
     }
   }
   ========================================================= */
