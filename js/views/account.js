/* =========================================================
   ViveShop — Account ভিউ (আগের account.html + js/account.js)
   ========================================================= */
const ACCOUNT_PAY_LABELS = { cod: "ক্যাশ অন ডেলিভারি", bkash: "বিকাশ", nagad: "নগদ", rocket: "রকেট" };
const ACCOUNT_STATUS_LABELS = { pending: "প্রসেসিং", confirmed: "কনফার্ম হয়েছে", shipped: "শিপড", delivered: "ডেলিভারড", cancelled: "বাতিল" };

function renderOrderCard(doc) {
  const o = doc.data();
  return `<div class="checkout-card bn">
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;flex-wrap:wrap;gap:6px">
      <strong>অর্ডার #${doc.id.slice(0, 8)}</strong>
      <span style="color:var(--color-success);font-weight:600">${ACCOUNT_STATUS_LABELS[o.status] || o.status}</span>
    </div>
    <div style="font-size:13.5px;color:var(--color-muted);margin-bottom:8px">
      ${o.items.map(i => `${i.name} × ${i.qty}`).join(", ")}
    </div>
    <div style="display:flex;justify-content:space-between;font-size:13.5px">
      <span>পেমেন্ট: ${ACCOUNT_PAY_LABELS[o.payment.method] || o.payment.method}</span>
      <strong>${formatTaka(o.total)}</strong>
    </div>
  </div>`;
}

const AccountView = {
  mount(container) {
    container.innerHTML = `
  <div class="section" style="max-width:760px">
    <div id="account-loading" class="empty-state bn">লোড হচ্ছে...</div>

    <div id="account-content" style="display:none">
      <div class="checkout-card" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
        <div>
          <h2 class="bn" id="account-name" style="margin-bottom:4px"></h2>
          <p class="bn" style="color:var(--color-muted);margin:0" id="account-email"></p>
        </div>
        <button class="btn btn-outline bn" id="logout-btn">লগআউট</button>
      </div>

      <h3 class="bn" style="margin-bottom:16px">অর্ডার হিস্টোরি</h3>
      <div id="orders-list" style="display:flex;flex-direction:column;gap:14px"></div>
    </div>
  </div>`;

    const unsub = auth.onAuthStateChanged(async (user) => {
      unsub();
      if (!user) { location.hash = "#/login"; return; }

      document.getElementById("account-loading").style.display = "none";
      document.getElementById("account-content").style.display = "block";
      document.getElementById("account-name").textContent = user.displayName || "তোমার অ্যাকাউন্ট";
      document.getElementById("account-email").textContent = user.email;

      document.getElementById("logout-btn").addEventListener("click", () => {
        auth.signOut().then(() => { location.hash = "#/"; });
      });

      try {
        // uid দিয়ে ফিল্টার করে সব অর্ডার আনা হচ্ছে, তারপর ক্লায়েন্ট সাইডে সময় অনুযায়ী সাজানো হচ্ছে —
        // এভাবে করলে Firestore-এ আলাদা কম্পোজিট ইনডেক্স তৈরি করার দরকার হয় না
        const snap = await db.collection("orders").where("uid", "==", user.uid).get();
        const list = document.getElementById("orders-list");
        if (snap.empty) {
          list.innerHTML = `<div class="empty-state bn">এখনো কোনো অর্ডার নেই। <a href="#/shop" style="color:var(--color-accent);font-weight:600">কেনাকাটা শুরু করো</a></div>`;
          return;
        }
        const docs = snap.docs.slice().sort((a, b) => {
          const ta = a.data().createdAt?.toMillis ? a.data().createdAt.toMillis() : 0;
          const tb = b.data().createdAt?.toMillis ? b.data().createdAt.toMillis() : 0;
          return tb - ta;
        });
        list.innerHTML = docs.map(renderOrderCard).join("");
      } catch (err) {
        document.getElementById("orders-list").innerHTML = `<div class="empty-state bn">অর্ডার লোড করতে সমস্যা হয়েছে।</div>`;
      }
    });
  }
};
