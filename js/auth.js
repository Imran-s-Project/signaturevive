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
    "auth/network-request-failed": "ইন্টারনেট কানেকশন চেক করো।"
  };
  return map[code] || "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করো।";
}
