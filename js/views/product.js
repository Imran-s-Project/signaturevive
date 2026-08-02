/* =========================================================
   ViveShop — Product ভিউ (আগের product.html + js/product.js)
   ========================================================= */
const PRODUCT_OPTION_BN_LABELS = { color: "রঙ", size: "সাইজ" };

const ProductView = {
  mount(container, query) {
    let currentImageIndex = 0;
    let selectedOptions = {};
    let currentQty = 1;

    const id = query.get("id");
    const product = getProductById(id);

    if (!product) {
      container.innerHTML = `
    <div class="section">
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <p class="bn">দুঃখিত, এই প্রোডাক্টটি খুঁজে পাওয়া যায়নি।</p>
        <a href="#/shop" class="btn btn-primary bn" style="margin-top:14px">শপে ফিরে যাও</a>
      </div>
    </div>`;
      return;
    }

    document.title = product.name + " | ViveShop";

    Object.keys(product.options || {}).forEach(k => {
      selectedOptions[k] = product.options[k][0];
    });

    container.innerHTML = `<div class="section">${buildProductMarkup(product)}</div>`;
    setupMagnifier();
    setupThumbs(product);
    setupSwatches();
    setupQty();
    setupTabs();
    setupActions(product);

    const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    if (related.length) {
      document.getElementById("related-grid").innerHTML = related.map(renderProductCard).join("");
    } else {
      document.getElementById("related-section").style.display = "none";
    }

    function buildProductMarkup(p) {
      const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
      const optionsHtml = Object.entries(p.options || {}).map(([key, values]) => `
    <div class="pd-options">
      <h4 class="bn">${PRODUCT_OPTION_BN_LABELS[key] || key}: <span id="selected-${key}" class="bn">${values[0]}</span></h4>
      <div class="swatch-row" data-option="${key}">
        ${values.map((v, i) => `<button class="swatch ${i === 0 ? "active" : ""}" data-value="${v}">${v}</button>`).join("")}
      </div>
    </div>`).join("");

      return `
    <div class="breadcrumb bn">
      <a href="#/">হোম</a> / <a href="#/shop?cat=${encodeURIComponent(p.category)}">${p.category}</a> / <span>${p.name}</span>
    </div>

    <div class="pd-layout">
      <div class="pd-gallery">
        <div class="pd-zoom-wrap" id="pd-zoom-wrap">
          <img id="pd-main-img" src="${p.images[0]}" alt="${p.name}">
          <div class="pd-lens" id="pd-lens"></div>
          <span class="pd-zoom-hint bn">🔍 হোভার করে জুম দেখো</span>
        </div>
        <div class="pd-thumbs" id="pd-thumbs">
          ${p.images.map((img, i) => `<div class="pd-thumb ${i === 0 ? "active" : ""}" data-index="${i}"><img src="${img}" alt="thumb ${i + 1}"></div>`).join("")}
        </div>
      </div>

      <div class="pd-info">
        <span class="product-cat bn">${p.category}</span>
        <h1>${p.name}</h1>
        <div class="pd-meta">
          <span class="rating">${starSvg()} ${p.rating} · ${p.reviews} <span class="bn">রিভিউ</span></span>
        </div>
        <div class="pd-price-row">
          <span class="price">${formatTaka(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatTaka(p.oldPrice)}</span><span style="color:var(--color-accent);font-weight:700;font-size:14px">-${discount}%</span>` : ""}
        </div>
        <div class="pd-stock bn"><span class="dot"></span> স্টকে আছে (${p.stock}টি বাকি)</div>
        <p class="pd-desc bn">${p.description}</p>

        ${optionsHtml}

        <div class="qty-row">
          <span class="bn" style="font-weight:600;font-size:14px">পরিমাণ</span>
          <div class="qty-stepper">
            <button id="qty-minus">−</button>
            <span id="qty-val">1</span>
            <button id="qty-plus">+</button>
          </div>
        </div>

        <div class="pd-actions">
          <button class="btn btn-outline btn-lg bn" id="add-to-cart-btn">কার্টে যোগ করো</button>
          <button class="btn btn-primary btn-lg bn" id="buy-now-btn">এখনই কিনো</button>
        </div>

        <div class="pd-features">
          <div class="pd-feature"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span class="bn">সারাদেশে হোম ডেলিভারি — ২-৫ কার্যদিবস</span></div>
          <div class="pd-feature"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M2 11h20M6 15h4"/></svg><span class="bn">বিকাশ / নগদ / রকেট অথবা ক্যাশ অন ডেলিভারি</span></div>
          <div class="pd-feature"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 3v6h6"/></svg><span class="bn">৭ দিনের মধ্যে সহজ রিটার্ন</span></div>
        </div>
      </div>
    </div>

    <div class="tab-bar">
      <button class="tab-btn active bn" data-tab="desc">বিবরণ</button>
      <button class="tab-btn bn" data-tab="spec">স্পেসিফিকেশন</button>
      <button class="tab-btn bn" data-tab="reviews">রিভিউ (${p.reviews})</button>
    </div>
    <div class="tab-panel active bn" id="tab-desc"><p>${p.description}</p></div>
    <div class="tab-panel bn" id="tab-spec">
      <table class="spec-table">
        ${p.features.map(f => `<tr><td>বৈশিষ্ট্য</td><td>${f}</td></tr>`).join("")}
      </table>
    </div>
    <div class="tab-panel bn" id="tab-reviews">
      <p>গড় রেটিং ${p.rating}/৫ — ${p.reviews} জন ক্রেতার রিভিউ অনুযায়ী। প্রোডাক্ট হাতে পাওয়ার পর তুমিও রিভিউ দিতে পারবে।</p>
    </div>

    <section class="section" id="related-section" style="padding-left:0;padding-right:0">
      <div class="section-head"><h2 class="bn">তোমার পছন্দ হতে পারে</h2></div>
      <div class="product-grid" id="related-grid"></div>
    </section>
  `;
    }

    /* ---------- Magnifier (cursor-follow lens) ---------- */
    function setupMagnifier() {
      const wrap = document.getElementById("pd-zoom-wrap");
      const img = document.getElementById("pd-main-img");
      const lens = document.getElementById("pd-lens");
      const zoomFactor = 2.4;
      const isTouch = window.matchMedia("(hover: none)").matches;
      if (isTouch) { lens.style.display = "none"; return; }

      const lensSize = 160;

      function moveLens(e) {
        const rect = wrap.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        x = Math.max(lensSize / 2, Math.min(x, rect.width - lensSize / 2));
        y = Math.max(lensSize / 2, Math.min(y, rect.height - lensSize / 2));

        lens.style.width = lensSize + "px";
        lens.style.height = lensSize + "px";
        lens.style.left = (x - lensSize / 2) + "px";
        lens.style.top = (y - lensSize / 2) + "px";
        lens.style.backgroundImage = `url('${img.src}')`;
        lens.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
        const bgX = -(x * zoomFactor - lensSize / 2);
        const bgY = -(y * zoomFactor - lensSize / 2);
        lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
      }

      wrap.addEventListener("mouseenter", () => { lens.style.display = "block"; });
      wrap.addEventListener("mousemove", moveLens);
      wrap.addEventListener("mouseleave", () => { lens.style.display = "none"; });
    }

    function setupThumbs(product) {
      document.querySelectorAll(".pd-thumb").forEach(thumb => {
        thumb.addEventListener("click", () => {
          currentImageIndex = Number(thumb.dataset.index);
          document.getElementById("pd-main-img").src = product.images[currentImageIndex];
          document.querySelectorAll(".pd-thumb").forEach(t => t.classList.remove("active"));
          thumb.classList.add("active");
        });
      });
    }

    function setupSwatches() {
      document.querySelectorAll(".swatch-row").forEach(row => {
        const key = row.dataset.option;
        row.querySelectorAll(".swatch").forEach(btn => {
          btn.addEventListener("click", () => {
            selectedOptions[key] = btn.dataset.value;
            row.querySelectorAll(".swatch").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`selected-${key}`).textContent = btn.dataset.value;
          });
        });
      });
    }

    function setupQty() {
      const valEl = document.getElementById("qty-val");
      document.getElementById("qty-minus").addEventListener("click", () => {
        currentQty = Math.max(1, currentQty - 1);
        valEl.textContent = currentQty;
      });
      document.getElementById("qty-plus").addEventListener("click", () => {
        currentQty += 1;
        valEl.textContent = currentQty;
      });
    }

    function setupTabs() {
      document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
          document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
          btn.classList.add("active");
          document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
        });
      });
    }

    function setupActions(product) {
      document.getElementById("add-to-cart-btn").addEventListener("click", () => {
        Cart.add(product.id, currentQty, { ...selectedOptions });
        showToast(`"${product.name}" কার্টে যোগ করা হয়েছে`);
      });
      document.getElementById("buy-now-btn").addEventListener("click", () => {
        Cart.add(product.id, currentQty, { ...selectedOptions });
        location.hash = "#/checkout";
      });
    }
  }
};
