/* =========================================================
   EmailJS ইন্টিগ্রেশন
   ---------------------------------------------------------
   emailjs.com এ ফ্রি অ্যাকাউন্ট খুলে নিচের ৪টা মান বসাও:

   1. EMAILJS_PUBLIC_KEY     → Account → General → Public Key
   2. EMAILJS_SERVICE_ID     → Email Services → তোমার সার্ভিসের ID
   3. EMAILJS_TEMPLATE_CONFIRM → একটা টেমপ্লেট বানাও "সাবস্ক্রাইব
      কনফার্মেশন" এর জন্য। এটা একজন-একজন সাবস্ক্রাইবারকে যায় বলে
      Settings ট্যাবে:
        To Email → {{to_email}}
      টেমপ্লেটে ভ্যারিয়েবল হিসেবে {{to_email}} ব্যবহার করো।

   4. EMAILJS_TEMPLATE_PRODUCT → আরেকটা টেমপ্লেট বানাও প্রোডাক্ট/অফার
      সংক্রান্ত মেইলের জন্য। এটা সব সাবস্ক্রাইবারকে একসাথে Bcc দিয়ে
      এক রিকোয়েস্টে পাঠানো হয় (quota বাঁচাতে) — তাই Settings ট্যাবে:
        To Email → তোমার নিজের/অ্যাডমিন ইমেইল (ফিক্সড, ভ্যারিয়েবল না)
        Bcc      → {{bcc_emails}}
      টেমপ্লেট বডিতে এই ভ্যারিয়েবলগুলো রাখো:
      {{product_name}} {{product_price}} {{product_image}} {{product_url}}

   ⚠️ Bcc তে থাকা ঠিকানাগুলো একে অপরকে দেখতে পায় না (প্রাইভেসি ঠিক
   থাকে), কিন্তু EmailJS নিজেই বলে যে এরা "unsubscribe" করতে পারে না।
   তাই বড় সাবস্ক্রাইবার লিস্ট (১০০+) হলে ভবিষ্যতে Brevo/Mailchimp এ
   Firestore থেকে এক্সপোর্ট করে সরিয়ে নেওয়াই ভালো — ছোট লিস্টে
   (২০-৫০ জন) এই Bcc পদ্ধতি ঠিকই কাজ করবে, ঠিক যেভাবে RJF তে করেছি।
   ========================================================= */

const EMAILJS_PUBLIC_KEY = "i8ar8D3TL931MP9Wq";
const EMAILJS_SERVICE_ID = "service_k78x1uh";
const EMAILJS_TEMPLATE_CONFIRM = "template_wbl0xaf";
const EMAILJS_TEMPLATE_PRODUCT = "template_lqa4ejk";

if (typeof emailjs !== "undefined") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

/* টেমপ্লেট ১ — নতুন সাবস্ক্রাইব করলেই "ধন্যবাদ" কনফার্মেশন মেইল।
   home.js এর newsletter-form সাবমিট হ্যান্ডলারেই এটা কল হয়। */
async function sendSubscribeConfirmationEmail(toEmail) {
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS লোড হয়নি — index.html এ SDK স্ক্রিপ্টটা চেক করো।");
    return;
  }
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CONFIRM, {
      to_email: toEmail
    });
  } catch (err) {
    console.error("কনফার্মেশন ইমেইল পাঠাতে সমস্যা হয়েছে:", err);
  }
}

/* টেমপ্লেট ২ — প্রোডাক্ট/অফার সংক্রান্ত মেইল, সব সাবস্ক্রাইবারকে
   Bcc দিয়ে একসাথে (এক রিকোয়েস্টে, quota বাঁচিয়ে) পাঠানোর জন্য।
   এখনো সাইটের কোথাও এটা কল করা হচ্ছে না — Firestore থেকে সব
   সাবস্ক্রাইবারের ইমেইল অ্যারে বানিয়ে এভাবে কল করবে:

     const subscriberEmails = ["a@x.com", "b@x.com", "c@x.com"];
     sendProductEmail(subscriberEmails, {
       name: "প্রোডাক্টের নাম",
       price: "৳ ৯৯৯",
       image: "https://.../image.jpg",
       url: "https://yoursite.com/#/product?id=xyz"
     });

   ⚠️ EmailJS এর Bcc ফিল্ডে একটামাত্র স্ট্রিং ভ্যারিয়েবল যায় (অ্যারে না),
   তাই এখানে অ্যারেটাকে কমা দিয়ে জোড়া লাগানো একটা স্ট্রিং বানিয়ে
   পাঠানো হচ্ছে — ঠিক RJF এর Contact Us টেমপ্লেটে {{bcc_emails}}
   যেভাবে কাজ করে সেভাবেই।
*/
async function sendProductEmail(subscriberEmails, product) {
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS লোড হয়নি — index.html এ SDK স্ক্রিপ্টটা চেক করো।");
    return;
  }
  if (!Array.isArray(subscriberEmails) || subscriberEmails.length === 0) {
    console.warn("sendProductEmail কে সাবস্ক্রাইবার ইমেইলের একটা non-empty অ্যারে দাও।");
    return;
  }
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_PRODUCT, {
      bcc_emails: subscriberEmails.join(","),
      product_name: product.name,
      product_price: product.price,
      product_image: product.image,
      product_url: product.url
    });
  } catch (err) {
    console.error("প্রোডাক্ট ইমেইল পাঠাতে সমস্যা হয়েছে:", err);
  }
}
