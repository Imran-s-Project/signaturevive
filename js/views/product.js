/* =========================================================
   ViveShop — Product ভিউ (আগের product.html + js/product.js)
   ========================================================= */
const PRODUCT_OPTION_BN_LABELS = { color: "রঙ", size: "সাইজ" };

function starRow(rating) {
  const rounded = Math.round(rating);
  return Array.from({ length: 5 }).map((_, i) =>
    `<span style="opacity:${i < rounded ? 1 : .25}">${starSvg()}</span>`
  ).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

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
    setupReviews(product);

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
          <span class="pd-zoom-hint bn"><i class="fa-solid fa-magnifying-glass"></i> হোভার করে জুম দেখো</span>
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
      <button class="tab-btn bn" data-tab="reviews">রিভিউ</button>
    </div>
    <div class="tab-panel active bn" id="tab-desc"><p>${p.description}</p></div>
    <div class="tab-panel bn" id="tab-spec">
      <table class="spec-table">
        ${p.features.map(f => `<tr><td>বৈশিষ্ট্য</td><td>${f}</td></tr>`).join("")}
      </table>
    </div>
    <div class="tab-panel bn" id="tab-reviews">
      <div class="reviews-overview">
        <span class="reviews-score-num">${p.rating}</span>
        <span class="stars-row">${starRow(p.rating)}</span>
        <span class="reviews-score-count bn">(${p.reviews} জন ক্রেতার রেটিং)</span>
      </div>

      <div id="review-form-slot"><div class="empty-state bn" style="padding:20px 0">লোড হচ্ছে...</div></div>

      <h4 class="bn" style="margin:30px 0 14px">ক্রেতাদের রিভিউ</h4>
      <div id="reviews-list"><div class="empty-state bn" style="padding:20px 0">রিভিউ লোড হচ্ছে...</div></div>
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

    /* ---------- রিভিউ সিস্টেম (Firestore-এর মাধ্যমে সংরক্ষিত, লগইন আবশ্যক) ---------- */
    function setupReviews(product) {
      const listEl = document.getElementById("reviews-list");
      const formSlot = document.getElementById("review-form-slot");

      loadReviewsList();

      const unsub = auth.onAuthStateChanged(user => {
        unsub();
        renderReviewForm(user);
      });

      async function loadReviewsList() {
        try {
          const snap = await db.collection("reviews").where("productId", "==", product.id).get();
          const docs = snap.docs.map(d => d.data()).sort((a, b) => {
            const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
            const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
            return tb - ta;
          });
          if (docs.length === 0) {
            listEl.innerHTML = `<div class="empty-state bn" style="padding:24px 0">এখনো কোনো রিভিউ নেই। প্রোডাক্ট হাতে পাওয়ার পর প্রথম রিভিউ তুমিই দাও!</div>`;
            return;
          }
          listEl.innerHTML = docs.map(r => `
        <div class="review-item">
          <div class="review-item-head">
            <strong class="bn">${escapeHtml(r.userName || "ক্রেতা")}</strong>
            <span class="stars-row small">${starRow(r.rating || 0)}</span>
          </div>
          <p class="bn review-item-text">${escapeHtml(r.comment)}</p>
        </div>`).join("");
        } catch (err) {
          listEl.innerHTML = `<div class="empty-state bn" style="padding:24px 0">রিভিউ লোড করতে সমস্যা হয়েছে।</div>`;
        }
      }

      async function renderReviewForm(user) {
        if (!user) {
          const redirectTarget = encodeURIComponent(`#/product?id=${product.id}`);
          formSlot.innerHTML = `
        <div class="review-login-cta bn">
          <p>এই প্রোডাক্টের জন্য রিভিউ দিতে হলে আগে লগইন করতে হবে।</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <a href="#/login?redirect=${redirectTarget}" class="btn btn-primary bn">লগইন করো</a>
            <a href="#/signup?redirect=${redirectTarget}" class="btn btn-outline bn">অ্যাকাউন্ট তৈরি করো</a>
          </div>
        </div>`;
          return;
        }

        let existing = null;
        try {
          const doc = await db.collection("reviews").doc(`${product.id}_${user.uid}`).get();
          if (doc.exists) existing = doc.data();
        } catch (err) { /* নতুন ফর্ম দেখাও */ }

        let selectedRating = existing?.rating || 5;

        formSlot.innerHTML = `
        <div class="review-form">
          <h4 class="bn">${existing ? "তোমার রিভিউ" : "রিভিউ লিখো"}</h4>
          <div class="star-input" id="review-star-input">
            ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="star-btn ${n <= selectedRating ? "active" : ""}" data-value="${n}" aria-label="${n} স্টার">${starSvg()}</button>`).join("")}
          </div>
          <textarea id="review-comment" class="bn" rows="3" placeholder="প্রোডাক্টটি নিয়ে তোমার অভিজ্ঞতা লিখো..." required>${existing ? escapeHtml(existing.comment) : ""}</textarea>
          <div class="form-msg" id="review-msg"></div>
          <button class="btn btn-primary bn" id="review-submit-btn">${existing ? "রিভিউ আপডেট করো" : "রিভিউ জমা দাও"}</button>
        </div>`;

        document.querySelectorAll("#review-star-input .star-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            selectedRating = Number(btn.dataset.value);
            document.querySelectorAll("#review-star-input .star-btn").forEach(b => {
              b.classList.toggle("active", Number(b.dataset.value) <= selectedRating);
            });
          });
        });

        document.getElementById("review-submit-btn").addEventListener("click", async () => {
          const msg = document.getElementById("review-msg");
          const btn = document.getElementById("review-submit-btn");
          const comment = document.getElementById("review-comment").value.trim();
          msg.className = "form-msg";
          if (!comment) {
            msg.textContent = "অনুগ্রহ করে তোমার মতামত লিখো।";
            msg.classList.add("error", "show");
            return;
          }
          const originalLabel = btn.textContent;
          btn.disabled = true;
          btn.innerHTML = `<span class="loader-spin"></span>`;
          try {
            const ref = db.collection("reviews").doc(`${product.id}_${user.uid}`);
            const userName = user.displayName || user.email.split("@")[0];
            if (existing) {
              await ref.update({
                rating: selectedRating,
                comment,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
            } else {
              await ref.set({
                productId: product.id,
                uid: user.uid,
                userName,
                rating: selectedRating,
                comment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
              });
              existing = { rating: selectedRating, comment };
            }
            msg.textContent = "ধন্যবাদ! তোমার রিভিউ সংরক্ষণ করা হয়েছে।";
            msg.classList.add("success", "show");
            btn.disabled = false;
            btn.textContent = "রিভিউ আপডেট করো";
            loadReviewsList();
          } catch (err) {
            msg.textContent = "দুঃখিত, রিভিউ সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করো।";
            msg.classList.add("error", "show");
            btn.disabled = false;
            btn.textContent = originalLabel;
          }
        });
      }
    }
  }
};
