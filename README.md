# ViveShop — সেটআপ গাইড

## ১. Firebase চালু করা (৫ মিনিট)
1. [console.firebase.google.com](https://console.firebase.google.com) → নতুন প্রজেক্ট তৈরি করো (নাম: viveshop)।
2. **Build → Authentication → Get started → Email/Password** enable করো।
3. **Build → Firestore Database → Create database** (production mode) করো।
4. **Project settings → General → Your apps → Web (</>)** — একটা ওয়েব অ্যাপ যোগ করে `firebaseConfig` অবজেক্টটা কপি করো।
5. সেটা বসাও `js/firebase-config.js` ফাইলের `firebaseConfig` ভেরিয়েবলে (এখন ওখানে placeholder আছে)।
6. Firestore → Rules ট্যাবে গিয়ে `js/firebase-config.js`-এর কমেন্টে দেওয়া নিয়মগুলো বসিয়ে Publish করো।

## ২. পেমেন্ট নম্বর বসানো
`checkout.html` ফাইলে খুঁজে বের করো `01XXXXXXXXX` — এই জায়গাগুলোতে তোমার আসল বিকাশ/নগদ/রকেট Personal নম্বর বসাও (৩ জায়গায় আছে)।

## ৩. প্রোডাক্ট যোগ/এডিট করা
সব প্রোডাক্ট আছে `js/products-data.js` ফাইলে, `PRODUCTS` অ্যারেতে। নতুন প্রোডাক্ট যোগ করতে ওই প্যাটার্ন অনুসরণ করে একটা নতুন অবজেক্ট বসাও। `id` অবশ্যই ইউনিক ও URL-friendly হতে হবে (স্পেস ছাড়া, ইংরেজি হাইফেন দিয়ে) — কারণ প্রতিটা প্রোডাক্টের পেজ হয় `product.html?id=তোমার-আইডি`।

ছবির জায়গায় এখন placeholder (picsum.photos) বসানো আছে — আসল প্রোডাক্ট ছবি দিয়ে `images` অ্যারের লিংকগুলো বদলে দাও (Firebase Storage-এ আপলোড করে লিংক নিতে পারো)।

## ৪. স্মার্ট ফিচারগুলো
- **প্রোডাক্ট জুম:** প্রোডাক্ট পেজে ছবির উপর মাউস রাখলেই সেই জায়গাটা ম্যাগনিফাইড হয়ে দেখা যায় (`js/views/product.js` এর `setupMagnifier` ফাংশন)।
- **কার্ট:** ব্রাউজারের localStorage-এ সেভ থাকে, পেজ রিলোড করলেও থাকে।
- **উইশলিস্ট:** প্রোডাক্ট কার্ডের হার্ট আইকনে ক্লিক করলে localStorage-এ সেভ হয়ে যায় (`js/cart.js` এর `Wishlist` অবজেক্ট), আইকনটা active/filled অবস্থায় থেকে যায়।
- **সাইটজুড়ে সার্চ:** হেডারের সার্চ বক্সে যেকোনো পেজ থেকে লিখে Enter চাপলে সরাসরি শপ পেজে ফলাফল দেখায়।
- **লগইন/সাইন আপ/পাসওয়ার্ড রিসেট:** পুরোপুরি Firebase Authentication দিয়ে করা। রিভিউ দেওয়ার মতো লগইন-আবশ্যক অ্যাকশন থেকে গেলে লগইনের পর আবার সেই পেজে ফিরিয়ে আনে (`?redirect=` প্যারামিটার দিয়ে)।
- **প্রোডাক্ট রিভিউ:** প্রতিটা প্রোডাক্ট পেজের "রিভিউ" ট্যাবে রিভিউ লেখা যায় — কিন্তু আগে লগইন করতে হয়। রিভিউ Firestore-এর `reviews` কালেকশনে সংরক্ষিত হয় (ডকুমেন্ট আইডি `প্রোডাক্ট-আইডি_ইউজার-আইডি` — তাই একজন ইউজার একটা প্রোডাক্টে একটাই রিভিউ দিতে পারবে, চাইলে পরে এডিট করতে পারবে)।
- **নিউজলেটার:** সাবস্ক্রাইব করা ইমেইল Firestore-এর `newsletter_subscribers` কালেকশনে সেভ হয়।
- **অর্ডার:** Firestore-এর `orders` কালেকশনে সেভ হয়, `account.html`-এ লগইন করা ইউজার তার অর্ডার হিস্টোরি দেখতে পারে।
- **আইকন:** সব আইকন Font Awesome (fa-solid) দিয়ে করা — CDN লিংক `index.html`-এ যোগ করা আছে।

## ৫. হোস্টিং / পাবলিশ করা
এটা সম্পূর্ণ স্ট্যাটিক সাইট (কোনো বিল্ড টুল লাগে না) — তাই Firebase Hosting, Netlify বা GitHub Pages যেকোনো জায়গায় সরাসরি ফোল্ডারটা আপলোড করলেই চলবে। Firebase Hosting ব্যবহার করলে auth + hosting একই প্রজেক্টে থাকবে, যা সবচেয়ে সহজ।

## ৬. লেআউট সিস্টেম (হেডার/ফুটার একদম JS দিয়ে ম্যানেজ)
আগে প্রতিটা HTML ফাইলে হেডার-ফুটার আলাদাভাবে কপি-পেস্ট করা ছিল। এখন সেটা `js/layout.js`-এ একটাই জায়গায় লেখা, আর প্রতিটা পেজ শুধু বলে দেয় তার হেডার/ফুটার কেমন হবে — `<body>` ট্যাগের data attribute দিয়ে:

```html
<body data-page="shop" data-header="full" data-footer="simple" data-cart="true">
<div id="layout-header"></div>
...পেজের নিজস্ব কনটেন্ট...
<div id="layout-footer"></div>
```

- `data-page` → কোন নেভ লিংক active দেখাবে (`home`, `shop`, `product`, `login`, `signup`, `forgot`, `checkout`, `account`)
- `data-header` → `full` (লোগো+সার্চ+নেভ+কার্ট+মেনু) অথবা `simple` (লোগো + একটা বাটন)
- `data-header-cta` / `data-header-cta-href` → simple হেডারে বাটনের লেখা/লিংক (না দিলে ডিফল্ট "শপ দেখো" → shop.html)
- `data-footer` → `full` (শুধু index.html) | `simple` (শুধু কপিরাইট লাইন) | `none`
- `data-cart` → `true`/`false` — কার্ট ড্রয়ারের রুট এলিমেন্ট বসবে কিনা

হেডার/ফুটারের HTML, মোবাইল মেনুর খোলা-বন্ধ হওয়া, লগইন-অবস্থা অনুযায়ী আইকন বদলানো — সবকিছু `js/layout.js`-এ। নতুন কোনো নেভ লিংক যোগ করতে চাইলে শুধু ওই একটা ফাইলে `LAYOUT_NAV_LINKS` / `LAYOUT_MOBILE_LINKS` অ্যারেতে যোগ করলেই সব পেজে দেখা যাবে।

কোনো পেজেই আর ইনলাইন `<script>` ব্লক নেই — প্রতিটা পেজের নিজস্ব লজিক তার নিজের `.js` ফাইলে।

## ফাইল স্ট্রাকচার
```
index.html              → হোমপেজ
shop.html               → সব প্রোডাক্ট (ফিল্টার/সার্চ/সর্ট সহ)
product.html            → প্রোডাক্ট ডিটেইল পেজ (?id=xxx দিয়ে খোলে)
checkout.html           → চেকআউট (bKash/Nagad/Rocket/COD)
login.html / signup.html / forgot-password.html
account.html            → প্রোফাইল + অর্ডার হিস্টোরি
css/style.css           → সব স্টাইল

js/layout.js            → হেডার/মোবাইল-নেভ/ফুটার — একটাই সোর্স, সব পেজ এখান থেকে রেন্ডার হয়
js/products-data.js     → প্রোডাক্ট ডেটা (এখানে প্রোডাক্ট যোগ করবে)
js/firebase-config.js   → Firebase কনফিগ (এখানে key বসাবে)
js/render.js            → প্রোডাক্ট কার্ড রেন্ডারার (শেয়ার্ড)
js/cart.js              → কার্ট (localStorage) + কার্ট ড্রয়ার + টোস্ট
js/auth.js              → Firebase auth এরর মেসেজ বাংলায় অনুবাদ
js/home.js              → হোমপেজ: ক্যাটাগরি গ্রিড, ফিচার্ড/নতুন প্রোডাক্ট, নিউজলেটার ফর্ম
js/shop.js              → শপ পেজ: ফিল্টার/সার্চ/সর্ট
js/product.js           → প্রোডাক্ট ডিটেইল পেজ: গ্যালারি জুম, অপশন, রিলেটেড প্রোডাক্ট
js/checkout.js          → চেকআউট: অর্ডার সামারি, পেমেন্ট টগল, সাবমিট
js/login.js / js/signup.js / js/forgot-password.js → নিজ নিজ ফর্ম হ্যান্ডলার
js/account.js           → অর্ডার হিস্টোরি + লগআউট
```
