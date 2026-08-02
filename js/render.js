/* =========================================================
   ViveShop — Shared product card renderer
   ========================================================= */
function starSvg() {
  return `<svg viewBox="0 0 20 20"><path d="M10 1l2.6 5.9 6.4.6-4.8 4.3 1.4 6.2L10 15l-5.6 3 1.4-6.2L1 8.5l6.4-.6L10 1z"/></svg>`;
}

function renderProductCard(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  return `
  <div class="product-card">
    <a href="#/product?id=${p.id}" class="product-thumb" aria-label="${p.name}">
      ${p.tag ? `<span class="product-tag ${p.tag === "NEW" ? "new" : ""}">${p.tag === "SALE" ? `-${discount}%` : "নতুন"}</span>` : ""}
      <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
    </a>
    <button class="wishlist-btn${typeof Wishlist !== "undefined" && Wishlist.has(p.id) ? " active" : ""}" data-pid="${p.id}" aria-label="Wishlist" onclick="toggleWishlistBtn('${p.id}', this)">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
    </button>
    <button class="quick-add" onclick="quickAdd('${p.id}')">কার্টে যোগ করো</button>
    <a href="#/product?id=${p.id}" class="product-info">
      <span class="product-cat">${p.category}</span>
      <span class="product-name">${p.name}</span>
      <span class="rating">${starSvg()} ${p.rating} (${p.reviews})</span>
      <div class="product-price-row">
        <span class="price">${formatTaka(p.price)}</span>
        ${p.oldPrice ? `<span class="price-old">${formatTaka(p.oldPrice)}</span>` : ""}
      </div>
    </a>
  </div>`;
}

function quickAdd(id) {
  Cart.add(id, 1, {});
  const p = getProductById(id);
  showToast(`"${p.name}" কার্টে যোগ করা হয়েছে`);
}

function renderProductGrid(container, products) {
  if (!container) return;
  if (products.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      <p>কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
    </div>`;
    return;
  }
  container.innerHTML = products.map(renderProductCard).join("");
}
