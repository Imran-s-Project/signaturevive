/* =========================================================
   ViveShop — SPA Router
   ---------------------------------------------------------
   এখন পুরো সাইটে একটাই HTML ফাইল (index.html) আছে।
   প্রতিটা "পেজ" আসলে js/views/*.js এর একটা ভিউ মডিউল, যেটা
   URL hash অনুযায়ী <main id="app"> এর ভেতরে রেন্ডার হয়।

   Route format:  #/          → হোম
                  #/shop?cat=Fashion
                  #/product?id=classic-canvas-tote
                  #/login  #/signup  #/forgot-password
                  #/checkout  #/account

   প্রতিটা ভিউ মডিউল এই শেপ মেনে চলে:
     const XyzView = { mount(container, query) { ... } };
   ========================================================= */

const ROUTES = {
  "": {
    page: "home", header: "full", footer: "full", cart: true,
    title: "ViveShop — তোমার প্রয়োজনের সব কিছু, এক জায়গায়",
    view: () => HomeView
  },
  "shop": {
    page: "shop", header: "full", footer: "full", cart: true,
    title: "শপ — সব প্রোডাক্ট | ViveShop",
    view: () => ShopView
  },
  "product": {
    page: "product", header: "full", footer: "full", cart: true,
    title: "প্রোডাক্ট | ViveShop",
    view: () => ProductView
  },
  "login": {
    page: "login", header: "simple", footer: "full", cart: false,
    ctaText: "শপ দেখো", ctaHref: "#/shop",
    title: "লগইন | ViveShop",
    view: () => LoginView
  },
  "signup": {
    page: "signup", header: "simple", footer: "full", cart: false,
    ctaText: "শপ দেখো", ctaHref: "#/shop",
    title: "সাইন আপ | ViveShop",
    view: () => SignupView
  },
  "forgot-password": {
    page: "forgot", header: "simple", footer: "full", cart: false,
    ctaText: "শপ দেখো", ctaHref: "#/shop",
    title: "পাসওয়ার্ড রিসেট | ViveShop",
    view: () => ForgotPasswordView
  },
  "checkout": {
    page: "checkout", header: "simple", footer: "full", cart: true,
    ctaText: "কেনাকাটা চালিয়ে যাও", ctaHref: "#/shop",
    title: "চেকআউট | ViveShop",
    view: () => CheckoutView
  },
  "account": {
    page: "account", header: "simple", footer: "full", cart: false,
    ctaText: "শপ দেখো", ctaHref: "#/shop",
    title: "আমার অ্যাকাউন্ট | ViveShop",
    view: () => AccountView
  }
};

function parseHash() {
  let raw = location.hash || "";
  raw = raw.replace(/^#\/?/, ""); // "#/shop?cat=X" → "shop?cat=X"
  const [path, queryString] = raw.split("?");
  return { path: path || "", query: new URLSearchParams(queryString || "") };
}

function runRouter() {
  const { path, query } = parseHash();
  const route = ROUTES[path] || ROUTES[""];

  document.title = route.title;

  applyLayout({
    page: route.page,
    header: route.header,
    footer: route.footer,
    cart: route.cart,
    ctaText: route.ctaText,
    ctaHref: route.ctaHref
  });

  const app = document.getElementById("app");
  app.innerHTML = "";
  route.view().mount(app, query);

  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", runRouter);
document.addEventListener("DOMContentLoaded", runRouter);
