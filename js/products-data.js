/* =========================================================
   ViveShop — Product catalog (static)
   👉 নতুন প্রোডাক্ট যোগ করতে নিচের অ্যারেতে একটা নতুন অবজেক্ট বসাও।
   id অবশ্যই ইউনিক হতে হবে — product.html?id=এই-আইডি দিয়ে পেজ খুলবে।
   ========================================================= */
const PRODUCTS = [
  {
    id: "classic-canvas-tote",
    name: "Classic Canvas Tote Bag",
    category: "Fashion",
    price: 990,
    oldPrice: 1350,
    rating: 4.6,
    reviews: 128,
    stock: 24,
    tag: "SALE",
    description: "ভারী ওয়েট ক্যানভাস দিয়ে তৈরি প্রশস্ত টোট ব্যাগ — প্রতিদিনের ব্যবহার, বাজার বা অফিসের জন্য পারফেক্ট। মজবুত সেলাই ও লম্বা হ্যান্ডেল দিয়ে তৈরি যাতে আরামে কাঁধে বহন করা যায়।",
    features: ["১০০% খাঁটি ক্যানভাস কাপড়", "ভেতরে জিপ পকেট আছে", "ওজন বহন ক্ষমতা: ৮ কেজি পর্যন্ত", "৭ দিন সহজ রিটার্ন"],
    options: { color: ["Beige", "Black", "Olive"] },
    images: [
      "https://picsum.photos/seed/tote1/800/800",
      "https://picsum.photos/seed/tote2/800/800",
      "https://picsum.photos/seed/tote3/800/800"
    ]
  },
  {
    id: "wireless-earbuds-pro",
    name: "AirBeat Wireless Earbuds Pro",
    category: "Electronics",
    price: 2450,
    oldPrice: 3200,
    rating: 4.8,
    reviews: 312,
    stock: 40,
    tag: "SALE",
    description: "অ্যাক্টিভ নয়েজ ক্যান্সেলেশন এবং ৩০ ঘন্টা ব্যাটারি ব্যাকআপ সহ প্রিমিয়াম ওয়্যারলেস ইয়ারবাড। টাচ কন্ট্রোল ও IPX5 ওয়াটার রেজিস্ট্যান্স আছে।",
    features: ["অ্যাক্টিভ নয়েজ ক্যান্সেলেশন", "৩০ ঘন্টা ব্যাটারি ব্যাকআপ", "IPX5 ওয়াটার রেজিস্ট্যান্ট", "১ বছর ওয়ারেন্টি"],
    options: { color: ["White", "Black"] },
    images: [
      "https://picsum.photos/seed/buds1/800/800",
      "https://picsum.photos/seed/buds2/800/800",
      "https://picsum.photos/seed/buds3/800/800"
    ]
  },
  {
    id: "ceramic-mug-set",
    name: "Nordic Ceramic Mug Set (4pcs)",
    category: "Home & Living",
    price: 850,
    oldPrice: null,
    rating: 4.7,
    reviews: 87,
    stock: 60,
    tag: "NEW",
    description: "মিনিমাল নর্ডিক ডিজাইনের ৪ পিস সেরামিক মগ সেট। মাইক্রোওয়েভ ও ডিশওয়াশার সেফ, চা বা কফির জন্য পারফেক্ট।",
    features: ["৪ পিসের সেট", "মাইক্রোওয়েভ সেফ", "৩৫০ মিলি ধারণক্ষমতা প্রতিটি", "গিফট বক্স প্যাকেজিং"],
    options: { color: ["Terracotta", "Sage", "Cream"] },
    images: [
      "https://picsum.photos/seed/mug1/800/800",
      "https://picsum.photos/seed/mug2/800/800",
      "https://picsum.photos/seed/mug3/800/800"
    ]
  },
  {
    id: "minimalist-watch",
    name: "Minimalist Leather Strap Watch",
    category: "Fashion",
    price: 1650,
    oldPrice: 2100,
    rating: 4.5,
    reviews: 203,
    stock: 15,
    tag: "SALE",
    description: "জেনুইন লেদার স্ট্র্যাপ ও মিনিমাল ডায়াল সহ ক্লাসিক রিস্ট ওয়াচ। যেকোনো পোশাকের সাথে মানানসই।",
    features: ["জেনুইন লেদার স্ট্র্যাপ", "স্ক্র্যাচ-প্রুফ গ্লাস", "৩০ মিটার ওয়াটার রেজিস্ট্যান্ট", "১ বছর ওয়ারেন্টি"],
    options: { color: ["Brown", "Black"] },
    images: [
      "https://picsum.photos/seed/watch1/800/800",
      "https://picsum.photos/seed/watch2/800/800",
      "https://picsum.photos/seed/watch3/800/800"
    ]
  },
  {
    id: "aroma-diffuser",
    name: "Wooden Aroma Oil Diffuser",
    category: "Home & Living",
    price: 1190,
    oldPrice: null,
    rating: 4.4,
    reviews: 54,
    stock: 30,
    tag: "NEW",
    description: "কাঠের ফিনিশ সহ আলট্রাসনিক অ্যারোমা ডিফিউজার — শান্ত পরিবেশ তৈরির জন্য ৭ কালার LED লাইট সহ।",
    features: ["৭ কালার LED লাইট", "অটো শাট-অফ", "৩০০ মিলি ওয়াটার ট্যাংক", "নীরব অপারেশন"],
    options: {},
    images: [
      "https://picsum.photos/seed/diffuser1/800/800",
      "https://picsum.photos/seed/diffuser2/800/800",
      "https://picsum.photos/seed/diffuser3/800/800"
    ]
  },
  {
    id: "vitamin-c-serum",
    name: "Vitamin C Brightening Serum",
    category: "Beauty",
    price: 690,
    oldPrice: 890,
    rating: 4.6,
    reviews: 176,
    stock: 80,
    tag: "SALE",
    description: "২০% ভিটামিন সি সিরাম যা ত্বক উজ্জ্বল করে এবং দাগ কমাতে সাহায্য করে। সব ধরনের ত্বকের জন্য উপযোগী।",
    features: ["২০% ভিটামিন সি", "প্যারাবেন-ফ্রি", "৩০ মিলি বোতল", "ডার্মাটোলজিস্ট টেস্টেড"],
    options: {},
    images: [
      "https://picsum.photos/seed/serum1/800/800",
      "https://picsum.photos/seed/serum2/800/800",
      "https://picsum.photos/seed/serum3/800/800"
    ]
  },
  {
    id: "smart-led-strip",
    name: "Smart RGB LED Light Strip (5m)",
    category: "Electronics",
    price: 990,
    oldPrice: 1400,
    rating: 4.5,
    reviews: 240,
    stock: 55,
    tag: "SALE",
    description: "অ্যাপ কন্ট্রোলড ৫ মিটার RGB LED স্ট্রিপ লাইট। মিউজিক সিঙ্ক ও ১৬ মিলিয়ন কালার সাপোর্ট করে।",
    features: ["অ্যাপ + রিমোট কন্ট্রোল", "মিউজিক সিঙ্ক মোড", "১৬ মিলিয়ন কালার", "সহজ সেলফ-অ্যাডহেসিভ ইনস্টল"],
    options: {},
    images: [
      "https://picsum.photos/seed/led1/800/800",
      "https://picsum.photos/seed/led2/800/800",
      "https://picsum.photos/seed/led3/800/800"
    ]
  },
  {
    id: "cotton-panjabi",
    name: "Premium Cotton Panjabi",
    category: "Fashion",
    price: 1450,
    oldPrice: 1800,
    rating: 4.7,
    reviews: 95,
    stock: 35,
    tag: "SALE",
    description: "১০০% খাঁটি সুতি কাপড়ে তৈরি আরামদায়ক পাঞ্জাবি। জুমার নামাজ, ঈদ কিংবা যেকোনো অনুষ্ঠানের জন্য উপযুক্ত।",
    features: ["১০০% খাঁটি সুতি", "নিয়মিত ফিট", "মেশিন ওয়াশেবল", "সাইজ: M, L, XL, XXL"],
    options: { size: ["M", "L", "XL", "XXL"] },
    images: [
      "https://picsum.photos/seed/panjabi1/800/800",
      "https://picsum.photos/seed/panjabi2/800/800",
      "https://picsum.photos/seed/panjabi3/800/800"
    ]
  },
  {
    id: "portable-blender",
    name: "Portable USB Blender Bottle",
    category: "Home & Living",
    price: 1290,
    oldPrice: null,
    rating: 4.3,
    reviews: 61,
    stock: 20,
    tag: "NEW",
    description: "রিচার্জেবল পোর্টেবল ব্লেন্ডার — জুস, স্মুদি বা শেক বানাতে যেকোনো জায়গায়। USB-C চার্জিং সাপোর্ট করে।",
    features: ["USB-C রিচার্জেবল", "৪০০ মিলি ধারণক্ষমতা", "৬ ব্লেড স্টেইনলেস স্টিল", "১ চার্জে ১৫ বার ব্যবহার"],
    options: {},
    images: [
      "https://picsum.photos/seed/blender1/800/800",
      "https://picsum.photos/seed/blender2/800/800",
      "https://picsum.photos/seed/blender3/800/800"
    ]
  },
  {
    id: "quran-stand-wooden",
    name: "Handcrafted Wooden Quran Stand",
    category: "Home & Living",
    price: 750,
    oldPrice: null,
    rating: 4.9,
    reviews: 44,
    stock: 18,
    tag: "NEW",
    description: "হাতে তৈরি কাঠের রেহেল — টেকসই ও ভাঁজযোগ্য ডিজাইন, তিলাওয়াতের সময় আরামের জন্য।",
    features: ["হাতে তৈরি খাঁটি কাঠ", "ভাঁজযোগ্য ডিজাইন", "ননস্লিপ বেস", "হালকা ও বহনযোগ্য"],
    options: {},
    images: [
      "https://picsum.photos/seed/quranstand1/800/800",
      "https://picsum.photos/seed/quranstand2/800/800",
      "https://picsum.photos/seed/quranstand3/800/800"
    ]
  }
];

const CATEGORIES = [
  { name: "Fashion", icon: "fa-shirt" },
  { name: "Electronics", icon: "fa-headphones" },
  { name: "Home & Living", icon: "fa-house" },
  { name: "Beauty", icon: "fa-spray-can-sparkles" }
];

function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}
function formatTaka(n) {
  return "৳" + n.toLocaleString("en-BD");
}
