/* =========================================================
   EmailJS ইন্টিগ্রেশন
   ---------------------------------------------------------
   emailjs.com এ ফ্রি অ্যাকাউন্ট খুলে নিচের ৪টা মান বসাও:

   1. EMAILJS_PUBLIC_KEY     → Account → General → Public Key
   2. EMAILJS_SERVICE_ID     → Email Services → তোমার সার্ভিসের ID
   3. EMAILJS_TEMPLATE_CONFIRM → একটা টেমপ্লেট বানাও "সাবস্ক্রাইব
      কনফার্মেশন" এর জন্য। টেমপ্লেটে ভ্যারিয়েবল হিসেবে {{to_email}}
      ব্যবহার করো।
   4. EMAILJS_TEMPLATE_PRODUCT → আরেকটা টেমপ্লেট বানাও প্রোডাক্ট/অফার
      সংক্রান্ত মেইলের জন্য। টেমপ্লেটে এই ভ্যারিয়েবলগুলো রাখো:
      {{to_email}} {{product_name}} {{product_price}} {{product_image}} {{product_url}}

   ⚠️ EmailJS ফ্রি প্ল্যানে মাসে ~২০০ মেইল লিমিট — এটা একজন-একজন করে
   ট্রানজ্যাকশনাল মেইল (যেমন কনফার্মেশন) পাঠানোর জন্য ভালো। সব
   সাবস্ক্রাইবারকে একসাথে bulk অফার/নিউজলেটার পাঠাতে চাইলে EmailJS
   দিয়ে না করে Brevo বা Mailchimp এ Firestore থেকে ইমেইল এক্সপোর্ট
   করে পাঠানো ভালো — ওগুলোতে unsubscribe লিংক, রেট লিমিট হ্যান্ডলিং,
   ডেলিভারেবিলিটি — সব বিল্ট-ইন থাকে।
   ========================================================= */

const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_CONFIRM = "YOUR_CONFIRM_TEMPLATE_ID";
const EMAILJS_TEMPLATE_PRODUCT = "YOUR_PRODUCT_TEMPLATE_ID";

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

/* টেমপ্লেট ২ — প্রোডাক্ট/অফার সংক্রান্ত মেইল। এখনো সাইটের কোথাও এটা
   কল করা হচ্ছে না — যেখান থেকেই কল করতে চাও (যেমন admin প্যানেল
   বানালে, বা "এই প্রোডাক্টটা নিয়ে ইমেইল করো" বাটন) সেখান থেকে এভাবে
   কল করবে:

     sendProductEmail("customer@example.com", {
       name: "প্রোডাক্টের নাম",
       price: "৳ ৯৯৯",
       image: "https://.../image.jpg",
       url: "https://yoursite.com/#/product?id=xyz"
     });
*/
async function sendProductEmail(toEmail, product) {
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS লোড হয়নি — index.html এ SDK স্ক্রিপ্টটা চেক করো।");
    return;
  }
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_PRODUCT, {
      to_email: toEmail,
      product_name: product.name,
      product_price: product.price,
      product_image: product.image,
      product_url: product.url
    });
  } catch (err) {
    console.error("প্রোডাক্ট ইমেইল পাঠাতে সমস্যা হয়েছে:", err);
  }
}
