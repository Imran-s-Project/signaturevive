/* =========================================================
   ViveShop — Auth helpers
   ========================================================= */
function translateAuthError(code) {
  const map = {
    "auth/email-already-in-use": "এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট আছে।",
    "auth/invalid-email": "সঠিক ইমেইল ঠিকানা দাও।",
    "auth/weak-password": "পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে।",
    "auth/user-not-found": "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।",
    "auth/wrong-password": "পাসওয়ার্ড সঠিক নয়, আবার চেষ্টা করো।",
    "auth/invalid-credential": "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।",
    "auth/too-many-requests": "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করো।",
    "auth/network-request-failed": "ইন্টারনেট কানেকশন চেক করো।",
    "auth/popup-closed-by-user": "গুগল সাইন-ইন উইন্ডো বন্ধ করে দেওয়া হয়েছে, আবার চেষ্টা করো।",
    "auth/popup-blocked": "ব্রাউজার পপ-আপ ব্লক করেছে, পপ-আপ অনুমতি দিয়ে আবার চেষ্টা করো।",
    "auth/cancelled-popup-request": "আবার চেষ্টা করো।",
    "auth/account-exists-with-different-credential": "এই ইমেইল দিয়ে আগে থেকেই অন্য উপায়ে অ্যাকাউন্ট তৈরি করা আছে।"
  };
  return map[code] || "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করো।";
}

/* ---------- গুগল দিয়ে সাইন ইন / সাইন আপ ---------- */
async function signInWithGoogle() {
  const cred = await auth.signInWithPopup(googleProvider);
  const user = cred.user;
  // merge:true — আগে থেকে ইউজার ডকুমেন্ট থাকলে ওভাররাইট না করে শুধু হালনাগাদ করবে,
  // Firestore নিয়ম অনুযায়ী শুধু নিজের uid দিয়েই এই ডকুমেন্ট লেখা যায় (নিরাপদ)
  await db.collection("users").doc(user.uid).set({
    name: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || null,
    provider: "google",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  return user;
}
