/* =========================================================
   ViveShop — Layout engine (SPA সংস্করণ)
   ---------------------------------------------------------
   আগে প্রতিটা HTML ফাইলের <body> এ data-* অ্যাট্রিবিউট দিয়ে
   হেডার/ফুটার শেপ বলে দেওয়া হতো। এখন সব একটাই index.html,
   তাই router.js প্রতিটা রুট বদলের সময় applyLayout(cfg) কল করে —
   হেডার/ফুটার/কার্ট-আইকন সব রুট অনুযায়ী রিফ্রেশ হয়।
   ========================================================= */

const LAYOUT_NAV_LINKS = [
  { key: "home", href: "#/", label: "হোম" },
  { key: "shop", href: "#/shop", label: "শপ" },
  { key: "fashion", href: "#/shop?cat=Fashion", label: "ফ্যাশন" },
  { key: "electronics", href: "#/shop?cat=Electronics", label: "ইলেকট্রনিক্স" }
];

const LAYOUT_MOBILE_LINKS = [
  { key: "home", href: "#/", label: "হোম" },
  { key: "shop", href: "#/shop", label: "শপ — সব প্রোডাক্ট" },
  { key: "fashion", href: "#/shop?cat=Fashion", label: "ফ্যাশন" },
  { key: "electronics", href: "#/shop?cat=Electronics", label: "ইলেকট্রনিক্স" },
  { key: "home-living", href: "#/shop?cat=Home%20%26%20Living", label: "হোম ও লিভিং" },
  { key: "beauty", href: "#/shop?cat=Beauty", label: "বিউটি" },
  { key: "login", href: "#/login", label: "লগইন / সাইন আপ" }
];

let currentAuthUser = null;

function renderFullHeader(activePage) {
  const links = LAYOUT_NAV_LINKS
    .map(l => `<a href="${l.href}"${l.key === activePage ? ' class="active"' : ""}>${l.label}</a>`)
    .join("");
  const mobileLinks = LAYOUT_MOBILE_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join("");

  return `
<div class="announce"><i class="fa-solid fa-truck"></i> সারাদেশে হোম ডেলিভারি &nbsp;•&nbsp; ৫০০+ টাকার অর্ডারে ফ্রি শিপিং &nbsp;•&nbsp; ক্যাশ অন ডেলিভারি সুবিধা</div>

<header class="site-header">
  <div class="nav container">
    <a href="#/" class="logo">Vive<span>Shop</span></a>
    <div class="search-box">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <input type="text" id="search-input" placeholder="প্রোডাক্ট খুঁজুন...">
    </div>
    <nav class="nav-links">${links}</nav>
    <div class="nav-actions">
      <span class="js-auth-slot"></span>
      <a href="#" class="icon-btn js-cart-open" aria-label="Cart">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
        <span class="badge js-cart-count" style="display:none">0</span>
      </a>
      <button class="icon-btn mobile-toggle js-mobile-toggle" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
    </div>
  </div>
</header>

<div class="mobile-nav js-mobile-nav">
  <div class="mobile-nav-panel">
    <button class="icon-btn mobile-nav-close js-mobile-close" aria-label="Close">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
    ${mobileLinks}
  </div>
</div>`;
}

function renderSimpleHeader(ctaText, ctaHref) {
  return `
<header class="site-header">
  <div class="nav container">
    <a href="#/" class="logo">Vive<span>Shop</span></a>
    <div style="flex:1"></div>
    <a href="${ctaHref}" class="btn btn-outline bn">${ctaText}</a>
  </div>
</header>`;
}

function renderFullFooter() {
  return `
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <div class="footer-logo">Vive<span>Shop</span></div>
      <p class="bn" style="font-size:13.5px;max-width:280px">বিশ্বস্ততা আর মান নিশ্চিত করে বাংলাদেশের ঘরে ঘরে সেরা প্রোডাক্ট পৌঁছে দেওয়াই আমাদের লক্ষ্য।</p>
      <div class="social-row">
        <a href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
        <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg></a>
        <a href="#" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
      </div>
    </div>
    <div>
      <h4 class="bn">শপ</h4>
      <ul class="bn"><li><a href="#/shop">সব প্রোডাক্ট</a></li><li><a href="#/shop?cat=Fashion">ফ্যাশন</a></li><li><a href="#/shop?cat=Electronics">ইলেকট্রনিক্স</a></li><li><a href="#/shop?cat=Home%20%26%20Living">হোম ও লিভিং</a></li></ul>
    </div>
    <div>
      <h4 class="bn">অ্যাকাউন্ট</h4>
      <ul class="bn"><li><a href="#/login">লগইন</a></li><li><a href="#/signup">সাইন আপ</a></li><li><a href="#/account">আমার অর্ডার</a></li><li><a href="#/forgot-password">পাসওয়ার্ড রিসেট</a></li></ul>
    </div>
    <div>
      <h4 class="bn">সাহায্য</h4>
      <ul class="bn"><li><a href="#">যোগাযোগ করো</a></li><li><a href="#">ডেলিভারি নীতি</a></li><li><a href="#">রিটার্ন ও রিফান্ড</a></li><li><a href="#">প্রায়শই জিজ্ঞাসিত প্রশ্ন</a></li></ul>
    </div>
  </div>
  <div class="footer-bottom bn">
    <span>© 2026 ViveShop. সর্বস্বত্ব সংরক্ষিত।</span>
    <span>তৈরি হয়েছে <i class="fa-solid fa-heart"></i> দিয়ে, বাংলাদেশ থেকে</span>
  </div>
</footer>`;
}

function renderSimpleFooter() {
  return `
<footer class="site-footer">
  <div class="footer-bottom bn">
    <span>© 2026 ViveShop. সর্বস্বত্ব সংরক্ষিত।</span>
    <span><a href="#/">হোমে ফিরে যাও</a></span>
  </div>
</footer>`;
}

function layoutAuthSlotHtml(user) {
  if (user) {
    const displayName = user.displayName || user.email.split("@")[0];
    return `
      <a href="#/account" class="icon-btn" title="${displayName}">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
      </a>`;
  }
  return `
      <a href="#/login" class="icon-btn" title="লগইন">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M20 21a8 8 0 1 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>
      </a>`;
}

function refreshAuthSlot() {
  document.querySelectorAll(".js-auth-slot").forEach(slot => {
    slot.innerHTML = layoutAuthSlotHtml(currentAuthUser);
  });
  document.querySelectorAll(".js-auth-name").forEach(el => {
    el.textContent = currentAuthUser ? (currentAuthUser.displayName || currentAuthUser.email) : "";
  });
}

function wireMobileNav() {
  const mobileToggle = document.querySelector(".js-mobile-toggle");
  const mobileNav = document.querySelector(".js-mobile-nav");
  const mobileClose = document.querySelector(".js-mobile-close");
  mobileToggle?.addEventListener("click", () => mobileNav?.classList.add("open"));
  mobileClose?.addEventListener("click", () => mobileNav?.classList.remove("open"));
  mobileNav?.addEventListener("click", e => {
    if (e.target.classList.contains("js-mobile-nav")) mobileNav.classList.remove("open");
  });
}

function wireCartOpenButtons() {
  document.querySelectorAll(".js-cart-open").forEach(btn => {
    btn.addEventListener("click", e => { e.preventDefault(); openCartDrawer(); });
  });
}

/* হেডারের সার্চ বক্স — আগে শুধু শপ পেজে কাজ করতো, এখন যেকোনো
   পেজ থেকে Enter চাপলে সরাসরি শপ পেজে ফলাফল নিয়ে যায়। */
function wireHeaderSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  input.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const val = input.value.trim();
    if (!val) return;
    const target = "#/shop?search=" + encodeURIComponent(val);
    if (location.hash === target) {
      // ইতিমধ্যে শপ পেজে একই সার্চ থাকলেও রাউটার আবার রান করাতে হবে
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = target;
    }
  });
}

function closeMobileNav() {
  document.querySelector(".js-mobile-nav")?.classList.remove("open");
}

/* router.js প্রতিটা রুট বদলের সময় এটা কল করে */
function applyLayout(cfg) {
  const headerMount = document.getElementById("layout-header");
  if (headerMount) {
    headerMount.innerHTML = cfg.header === "full"
      ? renderFullHeader(cfg.page)
      : renderSimpleHeader(cfg.ctaText || "শপ দেখো", cfg.ctaHref || "#/shop");
  }

  const footerMount = document.getElementById("layout-footer");
  if (footerMount) {
    if (cfg.footer === "full") footerMount.innerHTML = renderFullFooter();
    else if (cfg.footer === "simple") footerMount.innerHTML = renderSimpleFooter();
    else footerMount.innerHTML = "";
  }

  if (cfg.cart) {
    if (!document.querySelector(".js-cart-drawer-root")) {
      const root = document.createElement("div");
      root.className = "js-cart-drawer-root";
      document.body.appendChild(root);
    }
  } else {
    document.querySelector(".js-cart-drawer-root")?.remove();
  }

  closeMobileNav();
  wireMobileNav();
  wireCartOpenButtons();
  wireHeaderSearch();
  refreshAuthSlot();
  if (typeof updateCartBadge === "function") updateCartBadge();
}

if (typeof auth !== "undefined") {
  auth.onAuthStateChanged(user => {
    currentAuthUser = user;
    refreshAuthSlot();
  });
}
