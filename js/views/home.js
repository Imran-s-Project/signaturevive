/* =========================================================
   ViveShop — Home ভিউ (আগের index.html + js/home.js)
   ========================================================= */
const HOME_CAT_BN_NAMES = {
  "Fashion": "ফ্যাশন",
  "Electronics": "ইলেকট্রনিক্স",
  "Home & Living": "হোম ও লিভিং",
  "Beauty": "বিউটি"
};

const HomeView = {
  mount(container) {
    container.innerHTML = `
  <section class="hero">
    <div class="hero-inner">
      <div>
        <span class="hero-eyebrow"><i class="fa-solid fa-wand-magic-sparkles"></i> নতুন কালেকশন এসেছে</span>
        <h1 class="bn">তোমার প্রয়োজনের <em>সবকিছু</em>,<br>এক জায়গায় পাও</h1>
        <p class="bn">ফ্যাশন থেকে ইলেকট্রনিক্স, হোম ডেকর থেকে বিউটি প্রোডাক্ট — যাচাই করা মানের পণ্য, সহজ পেমেন্ট আর দ্রুত ডেলিভারিতে, সরাসরি তোমার দরজায়।</p>
        <div class="hero-actions">
          <a href="#/shop" class="btn btn-primary btn-lg">এখনই কেনাকাটা করো</a>
          <a href="#featured" class="btn btn-outline btn-lg" style="background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.3);color:#fff">ফিচার্ড প্রোডাক্ট</a>
        </div>
      </div>
      <div class="hero-visual">
        <img src="https://picsum.photos/seed/heroshop/800/800" alt="ViveShop products">
        <div class="hero-badge-float"><span class="dot"></span> আজ ২৪০+ অর্ডার সম্পন্ন হয়েছে</div>
      </div>
    </div>
  </section>

  <section class="trust-strip container">
    <div class="trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
      <div><strong class="bn">সারাদেশে ডেলিভারি</strong><span class="bn">২-৫ কার্যদিবসে পৌঁছে যাবে</span></div>
    </div>
    <div class="trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5z"/></svg>
      <div><strong class="bn">১০০% অথেন্টিক পণ্য</strong><span class="bn">যাচাই করা মানের নিশ্চয়তা</span></div>
    </div>
    <div class="trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M2 11h20M6 15h4"/></svg>
      <div><strong class="bn">বিকাশ / নগদ / রকেট</strong><span class="bn">অথবা ক্যাশ অন ডেলিভারি</span></div>
    </div>
    <div class="trust-item">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 3v6h6"/></svg>
      <div><strong class="bn">৭ দিন রিটার্ন সুবিধা</strong><span class="bn">সহজ শর্তে পণ্য ফেরত</span></div>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <h2 class="bn">ক্যাটাগরি অনুযায়ী কেনাকাটা</h2>
    </div>
    <div class="cat-grid" id="cat-grid"></div>
  </section>

  <section class="section" id="featured">
    <div class="section-head">
      <div>
        <h2 class="bn">ফিচার্ড প্রোডাক্ট</h2>
        <p class="bn">এই মুহূর্তের সবচেয়ে জনপ্রিয় পণ্যসমূহ</p>
      </div>
      <a href="#/shop" class="section-link bn">সব দেখো
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
    </div>
    <div class="product-grid" id="featured-grid"></div>
  </section>

  <section class="section" id="newarrivals">
    <div class="section-head">
      <div>
        <h2 class="bn">নতুন এসেছে</h2>
        <p class="bn">সদ্য যোগ হওয়া প্রোডাক্টসমূহ</p>
      </div>
    </div>
    <div class="product-grid" id="new-grid"></div>
  </section>

  <section class="section">
    <div class="newsletter">
      <div>
        <h3 class="bn">অফার মিস করতে চাও না?</h3>
        <p class="bn">নতুন প্রোডাক্ট আর এক্সক্লুসিভ ডিসকাউন্টের খবর সবার আগে পাও।</p>
      </div>
      <form class="newsletter-form" id="newsletter-form">
        <input type="email" placeholder="তোমার ইমেইল দাও" required>
        <button type="submit" class="btn btn-primary">সাবস্ক্রাইব</button>
      </form>
    </div>
  </section>`;

    const catGrid = document.getElementById("cat-grid");
    if (catGrid) {
      catGrid.innerHTML = CATEGORIES.map(c => `
      <a href="#/shop?cat=${encodeURIComponent(c.name)}" class="cat-card">
        <i class="fa-solid ${c.icon} cat-icon"></i>
        <span class="bn">${HOME_CAT_BN_NAMES[c.name] || c.name}</span>
      </a>`).join("");
    }

    renderProductGrid(document.getElementById("featured-grid"), PRODUCTS.filter(p => p.tag === "SALE").slice(0, 4));
    renderProductGrid(document.getElementById("new-grid"), PRODUCTS.filter(p => p.tag === "NEW").slice(0, 4));

    document.getElementById("newsletter-form")?.addEventListener("submit", async e => {
      e.preventDefault();
      const form = e.target;
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim().toLowerCase();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="loader-spin"></span>`;
      try {
        const subscriberRef = db.collection("newsletter_subscribers").doc(email);
        const existing = await subscriberRef.get();

        if (existing.exists) {
          showToast("You are already subscribed with this email.");
          form.reset();
          return;
        }

        await subscriberRef.set({
          email,
          subscribedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        sendSubscribeConfirmationEmail(email);

        showToast(`Thank you for subscribing! <i class="fa-solid fa-champagne-glasses"></i>`);
        form.reset();
      } catch (err) {
        showToast("Sorry, try again later.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
      }
    });
  }
};
