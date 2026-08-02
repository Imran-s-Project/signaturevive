/* =========================================================
   ViveShop — Cart (localStorage based)
   ========================================================= */
const CART_KEY = "viveshop_cart_v1";

const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge();
  },
  add(productId, qty = 1, opts = {}) {
    const items = this.get();
    const key = productId + JSON.stringify(opts);
    const existing = items.find(i => (i.productId + JSON.stringify(i.opts)) === key);
    if (existing) existing.qty += qty;
    else items.push({ productId, qty, opts });
    this.save(items);
  },
  updateQty(index, qty) {
    const items = this.get();
    if (!items[index]) return;
    if (qty <= 0) items.splice(index, 1);
    else items[index].qty = qty;
    this.save(items);
  },
  remove(index) {
    const items = this.get();
    items.splice(index, 1);
    this.save(items);
  },
  clear() { this.save([]); },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); },
  subtotal() {
    return this.get().reduce((sum, i) => {
      const p = getProductById(i.productId);
      return p ? sum + p.price * i.qty : sum;
    }, 0);
  }
};

function updateCartBadge() {
  document.querySelectorAll(".js-cart-count").forEach(el => {
    const n = Cart.count();
    el.textContent = n;
    el.style.display = n > 0 ? "flex" : "none";
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".js-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast js-toast";
    toast.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg><span class="js-toast-text"></span>`;
    document.body.appendChild(toast);
  }
  toast.querySelector(".js-toast-text").textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- Cart Drawer ---------- */
function renderCartDrawer() {
  const root = document.querySelector(".js-cart-drawer-root");
  if (!root) return;
  const items = Cart.get();

  let itemsHtml = "";
  if (items.length === 0) {
    itemsHtml = `<div class="cart-empty">
      তোমার কার্ট খালি আছে।<br>কেনাকাটা শুরু করতে শপ ব্রাউজ করো।
    </div>`;
  } else {
    itemsHtml = items.map((item, idx) => {
      const p = getProductById(item.productId);
      if (!p) return "";
      const optsText = Object.values(item.opts).filter(Boolean).join(" / ");
      return `
      <div class="cart-item">
        <img src="${p.images[0]}" alt="${p.name}">
        <div class="cart-item-info">
          <span class="name">${p.name}</span>
          ${optsText ? `<span class="meta">${optsText}</span>` : ""}
          <div class="cart-item-row">
            <div class="qty-stepper" style="transform:scale(.85);transform-origin:left center">
              <button onclick="Cart.updateQty(${idx}, ${item.qty - 1}); renderCartDrawer();">−</button>
              <span>${item.qty}</span>
              <button onclick="Cart.updateQty(${idx}, ${item.qty + 1}); renderCartDrawer();">+</button>
            </div>
            <strong style="font-size:13.5px">${formatTaka(p.price * item.qty)}</strong>
          </div>
          <button class="cart-item-remove" onclick="Cart.remove(${idx}); renderCartDrawer();">সরিয়ে ফেলো</button>
        </div>
      </div>`;
    }).join("");
  }

  root.innerHTML = `
  <div class="cart-overlay js-cart-overlay">
    <div class="cart-drawer">
      <div class="cart-head">
        <h3 style="margin:0;font-size:17px">তোমার কার্ট (${Cart.count()})</h3>
        <button class="icon-btn js-cart-close" aria-label="Close cart">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="cart-items">${itemsHtml}</div>
      ${items.length > 0 ? `
      <div class="cart-foot">
        <div class="cart-subtotal"><span>সাবটোটাল</span><span>${formatTaka(Cart.subtotal())}</span></div>
        <a href="#/checkout" class="btn btn-primary btn-block btn-lg">চেকআউট করো</a>
        <a href="#/shop" class="btn btn-outline btn-block">কেনাকাটা চালিয়ে যাও</a>
      </div>` : ""}
    </div>
  </div>`;

  root.querySelector(".js-cart-close")?.addEventListener("click", closeCartDrawer);
  root.querySelector(".js-cart-overlay")?.addEventListener("click", e => {
    if (e.target.classList.contains("js-cart-overlay")) closeCartDrawer();
  });
}

function openCartDrawer() {
  renderCartDrawer();
  document.querySelector(".js-cart-overlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCartDrawer() {
  document.querySelector(".js-cart-overlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

/* .js-cart-open বাটনের ক্লিক ইভেন্ট ও ব্যাজ আপডেট এখন js/layout.js এর
   applyLayout() থেকে হয় — প্রতিটা রুট বদলের সময় হেডার নতুন করে বসে বলে
   ওখানেই এই ওয়্যারিং করা বেশি নির্ভরযোগ্য। */
