/* =========================================================
   ViveShop — Checkout ভিউ (আগের checkout.html + js/checkout.js)
   ========================================================= */
const CHECKOUT_FREE_SHIPPING_THRESHOLD = 500;
const CHECKOUT_SHIPPING_FEE = 70;

const CheckoutView = {
  mount(container) {
    container.innerHTML = `<div class="empty-state bn" id="checkout-authcheck">লোড হচ্ছে...</div>`;
    const unsub = auth.onAuthStateChanged(user => {
      unsub();
      if (!user) {
        location.hash = "#/login?redirect=" + encodeURIComponent("#/checkout");
        return;
      }
      renderCheckout(container, user);
    });
  }
};

function renderCheckout(container, user) {
    container.innerHTML = `
  <div class="section">
    <div class="breadcrumb bn"><a href="#/">হোম</a> / <a href="#/shop">শপ</a> / <span>চেকআউট</span></div>
    <h1 class="bn" style="font-size:26px;margin-bottom:28px">চেকআউট</h1>

    <div id="checkout-empty" class="empty-state" style="display:none">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
      <p class="bn">তোমার কার্ট খালি আছে।</p>
      <a href="#/shop" class="btn btn-primary bn" style="margin-top:14px">কেনাকাটা শুরু করো</a>
    </div>

    <form id="checkout-layout" class="checkout-layout">
      <div style="display:flex;flex-direction:column;gap:20px">
        <div class="checkout-card">
          <h2 class="bn"><span class="step-num">১</span> ডেলিভারি তথ্য</h2>
          <div class="field-grid">
            <div class="field"><label class="bn">পূর্ণ নাম *</label><input type="text" id="cf-name" required></div>
            <div class="field"><label class="bn">মোবাইল নম্বর *</label><input type="tel" id="cf-phone" required placeholder="01XXXXXXXXX" pattern="01[0-9]{9}"></div>
          </div>
          <div class="field"><label class="bn">সম্পূর্ণ ঠিকানা *</label><input type="text" id="cf-address" required placeholder="বাসা/হোল্ডিং, রোড, এলাকা"></div>
          <div class="field-grid">
            <div class="field"><label class="bn">শহর *</label><input type="text" id="cf-city" required></div>
            <div class="field"><label class="bn">ইমেইল (ঐচ্ছিক)</label><input type="email" id="cf-email"></div>
          </div>
          <div class="field"><label class="bn">অর্ডার নোট (ঐচ্ছিক)</label><input type="text" id="cf-note" placeholder="বিশেষ কোনো নির্দেশনা থাকলে লিখো"></div>
        </div>

        <div class="checkout-card">
          <h2 class="bn"><span class="step-num">২</span> পেমেন্ট মেথড</h2>
          <div class="pay-options" id="pay-options">
            <label class="pay-option active">
              <input type="radio" name="pay" value="cod" checked>
              <div><div class="pay-name bn">ক্যাশ অন ডেলিভারি</div><div class="pay-desc bn">পণ্য হাতে পেয়ে টাকা পরিশোধ করবে</div></div>
            </label>
            <div class="pay-detail show bn" id="detail-cod">ডেলিভারি ম্যানের কাছে সরাসরি নগদ টাকা পরিশোধ করবে। কোনো অগ্রিম পেমেন্ট লাগবে না।</div>

            <label class="pay-option">
              <input type="radio" name="pay" value="bkash">
              <div><div class="pay-name bn">বিকাশ (Send Money)</div><div class="pay-desc bn">ম্যানুয়াল সেন্ড মানি</div></div>
            </label>
            <div class="pay-detail bn" id="detail-bkash">
              এই নম্বরে <strong>Send Money</strong> করো: <strong>01XXXXXXXXX</strong> (Personal)<br>
              পেমেন্ট করার পর নিচে ট্রানজেকশন আইডি দাও।
            </div>

            <label class="pay-option">
              <input type="radio" name="pay" value="nagad">
              <div><div class="pay-name bn">নগদ (Send Money)</div><div class="pay-desc bn">ম্যানুয়াল সেন্ড মানি</div></div>
            </label>
            <div class="pay-detail bn" id="detail-nagad">
              এই নম্বরে <strong>Send Money</strong> করো: <strong>01XXXXXXXXX</strong> (Personal)<br>
              পেমেন্ট করার পর নিচে ট্রানজেকশন আইডি দাও।
            </div>

            <label class="pay-option">
              <input type="radio" name="pay" value="rocket">
              <div><div class="pay-name bn">রকেট (Send Money)</div><div class="pay-desc bn">ম্যানুয়াল সেন্ড মানি</div></div>
            </label>
            <div class="pay-detail bn" id="detail-rocket">
              এই নম্বরে <strong>Send Money</strong> করো: <strong>01XXXXXXXXX-1</strong> (Personal)<br>
              পেমেন্ট করার পর নিচে ট্রানজেকশন আইডি দাও।
            </div>
          </div>

          <div class="field" id="txn-field" style="display:none;margin-top:16px">
            <label class="bn">ট্রানজেকশন আইডি *</label>
            <input type="text" id="cf-txn" placeholder="যেমন: 8N7A6B5C4D">
            <div class="field-hint bn">পেমেন্ট সম্পন্ন হওয়ার পর SMS-এ পাওয়া ট্রানজেকশন আইডি এখানে বসাও।</div>
          </div>
        </div>
      </div>

      <div class="checkout-card" style="position:sticky;top:90px">
        <h2 class="bn">অর্ডার সামারি</h2>
        <div class="order-summary-list" id="order-summary-list"></div>
        <div class="order-summary-row bn"><span>সাবটোটাল</span><span id="summary-subtotal"></span></div>
        <div class="order-summary-row bn"><span>ডেলিভারি চার্জ</span><span id="summary-shipping"></span></div>
        <div class="order-summary-row total bn"><span>সর্বমোট</span><span id="summary-total"></span></div>
        <div class="form-msg" id="checkout-msg"></div>
        <button type="submit" class="btn btn-primary btn-block btn-lg bn" id="place-order-btn" style="margin-top:16px">অর্ডার কনফার্ম করো</button>
        <p class="bn" style="font-size:12px;color:var(--color-muted);text-align:center;margin-top:10px">অর্ডার করার মাধ্যমে তুমি আমাদের শর্তাবলীতে সম্মত হচ্ছো।</p>
      </div>
    </form>

    <div id="order-success" style="display:none;text-align:center;padding:60px 20px">
      <div style="width:72px;height:72px;border-radius:50%;background:#E9F8EF;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
        <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#1F9D55" stroke-width="2.5" stroke-linecap="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <h2 class="bn">তোমার অর্ডার সফলভাবে সম্পন্ন হয়েছে! <i class="fa-solid fa-champagne-glasses"></i></h2>
      <p class="bn" style="color:var(--color-muted);max-width:420px;margin:8px auto 24px">অর্ডার আইডি: <strong id="success-order-id"></strong><br>আমরা শীঘ্রই তোমার সাথে যোগাযোগ করবো।</p>
      <a href="#/shop" class="btn btn-primary bn">কেনাকাটা চালিয়ে যাও</a>
    </div>
  </div>`;

    const items = Cart.get();
    if (items.length === 0) {
      document.getElementById("checkout-layout").style.display = "none";
      document.getElementById("checkout-empty").style.display = "block";
      return;
    }
    renderOrderSummary();
    setupPaymentToggle();
    prefillFromUser();
    document.getElementById("checkout-layout").addEventListener("submit", handleSubmit);

    function prefillFromUser() {
      const nameInput = document.getElementById("cf-name");
      const emailInput = document.getElementById("cf-email");
      if (user.displayName) nameInput.value = user.displayName;
      if (user.email) emailInput.value = user.email;
    }

    function renderOrderSummary() {
      const items = Cart.get();
      const list = document.getElementById("order-summary-list");
      list.innerHTML = items.map(item => {
        const p = getProductById(item.productId);
        if (!p) return "";
        const optsText = Object.values(item.opts).filter(Boolean).join(" / ");
        return `<div style="display:flex;gap:10px;align-items:center">
      <img src="${p.images[0]}" style="width:52px;height:52px;border-radius:8px;object-fit:cover;flex-shrink:0">
      <div style="flex:1">
        <div class="bn" style="font-size:13.5px;font-weight:600">${p.name} ${item.qty > 1 ? `× ${item.qty}` : ""}</div>
        ${optsText ? `<div class="bn" style="font-size:12px;color:var(--color-muted)">${optsText}</div>` : ""}
      </div>
      <strong style="font-size:13.5px">${formatTaka(p.price * item.qty)}</strong>
    </div>`;
      }).join("");

      const subtotal = Cart.subtotal();
      const shipping = subtotal >= CHECKOUT_FREE_SHIPPING_THRESHOLD ? 0 : CHECKOUT_SHIPPING_FEE;
      document.getElementById("summary-subtotal").textContent = formatTaka(subtotal);
      document.getElementById("summary-shipping").textContent = shipping === 0 ? "ফ্রি" : formatTaka(shipping);
      document.getElementById("summary-total").textContent = formatTaka(subtotal + shipping);
    }

    function setupPaymentToggle() {
      const options = document.querySelectorAll(".pay-option");
      const txnField = document.getElementById("txn-field");

      options.forEach(opt => {
        opt.addEventListener("click", () => {
          options.forEach(o => o.classList.remove("active"));
          document.querySelectorAll(".pay-detail").forEach(d => d.classList.remove("show"));
          opt.classList.add("active");
          opt.querySelector("input").checked = true;
          const method = opt.querySelector("input").value;
          document.getElementById("detail-" + method).classList.add("show");
          txnField.style.display = method === "cod" ? "none" : "block";
          document.getElementById("cf-txn").required = method !== "cod";
        });
      });
    }

    async function handleSubmit(e) {
      e.preventDefault();
      const msg = document.getElementById("checkout-msg");
      const btn = document.getElementById("place-order-btn");
      msg.className = "form-msg";

      const name = document.getElementById("cf-name").value.trim();
      const phone = document.getElementById("cf-phone").value.trim();
      const address = document.getElementById("cf-address").value.trim();
      const city = document.getElementById("cf-city").value.trim();
      const email = document.getElementById("cf-email").value.trim();
      const note = document.getElementById("cf-note").value.trim();
      const method = document.querySelector('input[name="pay"]:checked').value;
      const txnId = document.getElementById("cf-txn").value.trim();

      if (!name || !phone || !address || !city) {
        msg.textContent = "অনুগ্রহ করে সব প্রয়োজনীয় (*) তথ্য পূরণ করো।";
        msg.classList.add("error", "show");
        return;
      }
      if (!/^01[0-9]{9}$/.test(phone)) {
        msg.textContent = "সঠিক মোবাইল নম্বর দাও (উদাহরণ: 01712345678)।";
        msg.classList.add("error", "show");
        return;
      }
      if (method !== "cod" && !txnId) {
        msg.textContent = "অনুগ্রহ করে পেমেন্ট ট্রানজেকশন আইডি দাও।";
        msg.classList.add("error", "show");
        return;
      }

      const items = Cart.get();
      const subtotal = Cart.subtotal();
      const shipping = subtotal >= CHECKOUT_FREE_SHIPPING_THRESHOLD ? 0 : CHECKOUT_SHIPPING_FEE;

      const orderData = {
        uid: user.uid,
        customer: { name, phone, address, city, email: email || null, note: note || null },
        items: items.map(i => {
          const p = getProductById(i.productId);
          return { productId: i.productId, name: p?.name, price: p?.price, qty: i.qty, opts: i.opts };
        }),
        payment: { method, txnId: txnId || null },
        subtotal, shipping, total: subtotal + shipping,
        status: "pending",
        createdAt: (typeof firebase !== "undefined") ? firebase.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
      };

      btn.disabled = true;
      btn.innerHTML = `<span class="loader-spin"></span>`;

      try {
        let orderId = "VS" + Date.now().toString().slice(-8);
        if (typeof db !== "undefined") {
          const ref = await db.collection("orders").add(orderData);
          orderId = ref.id;
        }
        Cart.clear();
        document.getElementById("checkout-layout").style.display = "none";
        document.getElementById("order-success").style.display = "block";
        document.getElementById("success-order-id").textContent = orderId;
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        msg.textContent = "দুঃখিত, অর্ডার সাবমিট করতে সমস্যা হয়েছে। আবার চেষ্টা করো। (" + err.message + ")";
        msg.classList.add("error", "show");
        btn.disabled = false;
        btn.innerHTML = "অর্ডার কনফার্ম করো";
      }
    }
}
