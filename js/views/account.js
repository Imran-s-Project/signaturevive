/* =========================================================
   ViveShop — Account ভিউ (প্রোফাইল ফটো, নাম/ফোন এডিট, অর্ডার হিস্টোরি)
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

function accountAvatarHtml(user) {
  return user.photoURL
    ? `<img src="${user.photoURL}" alt="" id="avatar-img">`
    : `<span class="avatar-fallback" id="avatar-img">${userInitials(user)}</span>`;
}

const AccountView = {
  mount(container) {
    container.innerHTML = `
  <div class="section" style="max-width:760px">
    <div id="account-loading" class="empty-state bn">লোড হচ্ছে...</div>

    <div id="account-content" style="display:none">
      <div class="checkout-card" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
        <div style="display:flex;align-items:center;gap:16px">
          <div class="avatar-upload">
            <span id="avatar-slot"></span>
            <label class="avatar-edit-btn" title="ছবি পরিবর্তন করো">
              <i class="fa-solid fa-camera"></i>
              <input type="file" id="avatar-input" accept="image/*">
            </label>
          </div>
          <div>
            <h2 class="bn" id="account-name" style="margin-bottom:4px"></h2>
            <p class="bn" style="color:var(--color-muted);margin:0" id="account-email"></p>
          </div>
        </div>
        <button class="btn btn-outline bn" id="logout-btn">লগআউট</button>
      </div>

      <div class="checkout-card" style="margin-bottom:24px">
        <h3 class="bn" style="margin-bottom:16px">প্রোফাইল তথ্য</h3>
        <div class="form-msg" id="profile-msg"></div>
        <div class="profile-edit-grid">
          <div class="field"><label class="bn">পূর্ণ নাম</label><input type="text" id="profile-name"></div>
          <div class="field"><label class="bn">মোবাইল নম্বর</label><input type="tel" id="profile-phone" placeholder="01XXXXXXXXX" pattern="01[0-9]{9}"></div>
        </div>
        <button class="btn btn-primary bn" id="profile-save-btn">তথ্য আপডেট করো</button>
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
      document.getElementById("avatar-slot").innerHTML = accountAvatarHtml(user);
      document.getElementById("profile-name").value = user.displayName || "";

      document.getElementById("logout-btn").addEventListener("click", () => {
        auth.signOut().then(() => { location.hash = "#/"; });
      });

      /* ---------- প্রোফাইল ফটো আপলোড (Firebase Storage) ---------- */
      document.getElementById("avatar-input").addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
          showToast("দুঃখিত, শুধু ছবি ফাইল আপলোড করা যাবে");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showToast("ছবির সাইজ ৫MB এর কম হতে হবে");
          return;
        }
        const slot = document.getElementById("avatar-slot");
        const prevHtml = slot.innerHTML;
        slot.innerHTML = `<span class="avatar-fallback"><span class="loader-spin"></span></span>`;
        try {
          const path = `avatars/${user.uid}/avatar`;
          const ref = storage.ref(path);
          await ref.put(file);
          const url = await ref.getDownloadURL();
          await user.updateProfile({ photoURL: url });
          await db.collection("users").doc(user.uid).set({
            photoURL: url,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          slot.innerHTML = `<img src="${url}" alt="">`;
          if (typeof refreshAuthSlot === "function") refreshAuthSlot();
          showToast(`প্রোফাইল ছবি আপডেট হয়েছে <i class="fa-solid fa-champagne-glasses"></i>`);
        } catch (err) {
          slot.innerHTML = prevHtml;
          showToast("দুঃখিত, ছবি আপলোড করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
        }
      });

      /* ---------- নাম/ফোন লোড ও এডিট ---------- */
      try {
        const userDoc = await db.collection("users").doc(user.uid).get();
        if (userDoc.exists && userDoc.data().phone) {
          document.getElementById("profile-phone").value = userDoc.data().phone;
        }
      } catch (err) { /* সাইলেন্টলি ইগনোর — ফর্ম খালি থাকবে */ }

      document.getElementById("profile-save-btn").addEventListener("click", async () => {
        const msg = document.getElementById("profile-msg");
        const btn = document.getElementById("profile-save-btn");
        const name = document.getElementById("profile-name").value.trim();
        const phone = document.getElementById("profile-phone").value.trim();
        msg.className = "form-msg";

        if (phone && !/^01[0-9]{9}$/.test(phone)) {
          msg.textContent = "সঠিক মোবাইল নম্বর দাও (উদাহরণ: 01712345678)।";
          msg.classList.add("error", "show");
          return;
        }

        btn.disabled = true;
        const originalLabel = btn.textContent;
        btn.innerHTML = `<span class="loader-spin"></span>`;
        try {
          if (name) await user.updateProfile({ displayName: name });
          await db.collection("users").doc(user.uid).set({
            name: name || null,
            phone: phone || null,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
          document.getElementById("account-name").textContent = name || "তোমার অ্যাকাউন্ট";
          if (typeof refreshAuthSlot === "function") refreshAuthSlot();
          msg.textContent = "প্রোফাইল তথ্য আপডেট হয়েছে।";
          msg.classList.add("success", "show");
        } catch (err) {
          msg.textContent = "দুঃখিত, আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করো।";
          msg.classList.add("error", "show");
        } finally {
          btn.disabled = false;
          btn.textContent = originalLabel;
        }
      });

      /* ---------- অর্ডার হিস্টোরি ---------- */
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
