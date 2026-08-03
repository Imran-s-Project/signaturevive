/* =========================================================
   ViveShop — Admin Panel
   ---------------------------------------------------------
   এই ফাইলটা এডিট করার আগে অবশ্যই দুইটা জিনিস কনফিগার করে নাও:

   1) নিচে ADMIN_EMAILS এ যেসব ইমেইল দিয়ে অ্যাডমিন প্যানেলে ঢুকতে
      পারবে, সেগুলো বসাও। এগুলো অবশ্যই Firebase Authentication এ
      (Console → Authentication → Users) আগে থেকে তৈরি করা
      email/password ইউজার হতে হবে।

   2) Firestore Console → Rules এ গিয়ে newsletter_subscribers এর
      rule টা এভাবে আপডেট করো (নইলে অ্যাডমিন প্যানেল সাবস্ক্রাইবার
      লিস্ট করতে/মুছতে পারবে না — এখনকার rule এ list/delete বন্ধ আছে):

        match /newsletter_subscribers/{email} {
          allow create: if true;
          allow get: if true;
          allow list, delete: if request.auth != null &&
            request.auth.token.email in [
              "admin1@example.com", "admin2@example.com"
            ];
          allow update: if false;
        }

      উপরের ইমেইল লিস্টটা ঠিক ADMIN_EMAILS এর সাথে মিলিয়ে বসাও।
   ========================================================= */

const ADMIN_EMAILS = [
  "imran.info.me@gmail.com"
];

let allSubscribers = [];          // Firestore থেকে লোড হওয়া সব সাবস্ক্রাইবার
const selectedEmails = new Set(); // সাবস্ক্রাইবার পেজে টিক দেওয়া ইমেইলগুলো
let currentView = "dashboard";
let activeRecipientMode = "all";  // "all" | "selected" — ক্যাম্পেইন ভিউতে

/* ---------- Toast ---------- */
function showAdminToast(message, type) {
  const host = document.getElementById("toast-host");
  const el = document.createElement("div");
  el.className = "toast" + (type ? " " + type : "");
  el.innerHTML = message;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3800);
}

/* ---------- Auth gate ---------- */
const loginScreen = document.getElementById("login-screen");
const adminShell = document.getElementById("admin-shell");

document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorEl = document.getElementById("login-error");
  const submitBtn = document.getElementById("login-submit");
  errorEl.hidden = true;
  submitBtn.disabled = true;
  submitBtn.innerHTML = "<span>লগইন হচ্ছে…</span>";
  try {
    await auth.signInWithEmailAndPassword(email, password);
    // onAuthStateChanged বাকিটা সামলাবে
  } catch (err) {
    errorEl.textContent = "ইমেইল অথবা পাসওয়ার্ড ভুল। আবার চেষ্টা করো।";
    errorEl.hidden = false;
    submitBtn.disabled = false;
    submitBtn.innerHTML = "<span>লগইন করো</span>";
  }
});

document.getElementById("logout-btn").addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged(async user => {
  const submitBtn = document.getElementById("login-submit");
  submitBtn.disabled = false;
  submitBtn.innerHTML = "<span>লগইন করো</span>";

  if (!user) {
    loginScreen.hidden = false;
    adminShell.hidden = true;
    return;
  }
  if (!ADMIN_EMAILS.includes(user.email)) {
    const errorEl = document.getElementById("login-error");
    errorEl.textContent = "এই ইমেইলের অ্যাডমিন অ্যাক্সেস নেই।";
    errorEl.hidden = false;
    await auth.signOut();
    return;
  }

  loginScreen.hidden = true;
  adminShell.hidden = false;
  document.getElementById("topbar-email").textContent = user.email;
  document.getElementById("topbar-avatar").textContent = user.email.charAt(0).toUpperCase();

  await loadSubscribers();
  populateProductSelect();
});

/* ---------- Nav switching ---------- */
const viewTitles = { dashboard: "ড্যাশবোর্ড", subscribers: "সাবস্ক্রাইবার", campaign: "ইমেইল পাঠাও" };

function switchView(view) {
  currentView = view;
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });
  document.querySelectorAll(".view").forEach(sec => {
    sec.hidden = sec.id !== "view-" + view;
  });
  document.getElementById("topbar-title").textContent = viewTitles[view];
}

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});
document.querySelectorAll("[data-goto]").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.goto));
});

/* ---------- Subscribers: load + render ---------- */
async function loadSubscribers() {
  try {
    const snap = await db.collection("newsletter_subscribers").orderBy("subscribedAt", "desc").get();
    allSubscribers = snap.docs.map(doc => ({
      email: doc.id,
      subscribedAt: doc.data().subscribedAt ? doc.data().subscribedAt.toDate() : null
    }));
  } catch (err) {
    console.error(err);
    showAdminToast("সাবস্ক্রাইবার লোড করতে সমস্যা হয়েছে। Firestore rules চেক করো (list অনুমতি লাগবে)।", "error");
    allSubscribers = [];
  }
  renderDashboard();
  renderSubscriberTable();
  updateRecipientCounts();
}

function formatDate(d) {
  if (!d) return "—";
  return d.toLocaleDateString("bn-BD", { year: "numeric", month: "short", day: "numeric" });
}

function renderDashboard() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  document.getElementById("stat-total").textContent = allSubscribers.length;
  document.getElementById("stat-week").textContent = allSubscribers.filter(s => s.subscribedAt && s.subscribedAt > weekAgo).length;
  document.getElementById("stat-month").textContent = allSubscribers.filter(s => s.subscribedAt && s.subscribedAt > monthAgo).length;

  const recentList = document.getElementById("recent-list");
  const recent = allSubscribers.slice(0, 5);
  if (recent.length === 0) {
    recentList.innerHTML = `<div class="empty-hint">এখনো কোনো সাবস্ক্রাইবার নেই।</div>`;
    return;
  }
  recentList.innerHTML = recent.map(s => `
    <div class="recent-row">
      <span class="r-email">${s.email}</span>
      <span class="r-date">${formatDate(s.subscribedAt)}</span>
    </div>`).join("");
}

function renderSubscriberTable() {
  const tbody = document.getElementById("subscriber-tbody");
  const query = (document.getElementById("subscriber-search").value || "").trim().toLowerCase();
  const filtered = allSubscribers.filter(s => s.email.includes(query));

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-hint">${allSubscribers.length === 0 ? "এখনো কোনো সাবস্ক্রাইবার নেই।" : "কোনো মিল পাওয়া যায়নি।"}</td></tr>`;
    updateSelectionUI();
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td><input type="checkbox" class="row-checkbox" data-email="${s.email}" ${selectedEmails.has(s.email) ? "checked" : ""}></td>
      <td>${s.email}</td>
      <td>${formatDate(s.subscribedAt)}</td>
      <td class="col-action"><button class="row-delete" data-email="${s.email}" title="মুছে ফেলো"><i class="fa-solid fa-trash"></i></button></td>
    </tr>`).join("");

  tbody.querySelectorAll(".row-checkbox").forEach(cb => {
    cb.addEventListener("change", () => {
      if (cb.checked) selectedEmails.add(cb.dataset.email);
      else selectedEmails.delete(cb.dataset.email);
      updateSelectionUI();
    });
  });
  tbody.querySelectorAll(".row-delete").forEach(btn => {
    btn.addEventListener("click", () => deleteSubscriber(btn.dataset.email));
  });
  updateSelectionUI();
}

document.getElementById("subscriber-search").addEventListener("input", renderSubscriberTable);

document.getElementById("select-all-checkbox").addEventListener("change", e => {
  const checked = e.target.checked;
  document.querySelectorAll(".row-checkbox").forEach(cb => {
    cb.checked = checked;
    if (checked) selectedEmails.add(cb.dataset.email);
    else selectedEmails.delete(cb.dataset.email);
  });
  updateSelectionUI();
});

function updateSelectionUI() {
  const count = selectedEmails.size;
  const countEl = document.getElementById("selected-count");
  countEl.hidden = count === 0;
  countEl.textContent = `${count} জন সিলেক্টেড`;
  document.getElementById("delete-selected-btn").disabled = count === 0;
  document.getElementById("email-selected-btn").disabled = count === 0;
  updateRecipientCounts();
}

function updateRecipientCounts() {
  document.getElementById("recipient-all-count").textContent = allSubscribers.length;
  document.getElementById("recipient-selected-count").textContent = selectedEmails.size;
}

/* ---------- Delete ---------- */
async function deleteSubscriber(email) {
  if (!confirm(`${email} কে সাবস্ক্রাইবার লিস্ট থেকে মুছে ফেলবে?`)) return;
  try {
    await db.collection("newsletter_subscribers").doc(email).delete();
    allSubscribers = allSubscribers.filter(s => s.email !== email);
    selectedEmails.delete(email);
    renderDashboard();
    renderSubscriberTable();
    showAdminToast("সাবস্ক্রাইবার মুছে ফেলা হয়েছে।", "success");
  } catch (err) {
    console.error(err);
    showAdminToast("মুছতে সমস্যা হয়েছে। Firestore rules এ delete অনুমতি আছে কিনা চেক করো।", "error");
  }
}

document.getElementById("delete-selected-btn").addEventListener("click", async () => {
  const emails = Array.from(selectedEmails);
  if (emails.length === 0) return;
  if (!confirm(`${emails.length} জন সাবস্ক্রাইবারকে মুছে ফেলবে? এটা ফেরানো যাবে না।`)) return;
  try {
    await Promise.all(emails.map(email => db.collection("newsletter_subscribers").doc(email).delete()));
    allSubscribers = allSubscribers.filter(s => !selectedEmails.has(s.email));
    selectedEmails.clear();
    renderDashboard();
    renderSubscriberTable();
    showAdminToast("সিলেক্টেড সাবস্ক্রাইবাররা মুছে ফেলা হয়েছে।", "success");
  } catch (err) {
    console.error(err);
    showAdminToast("মুছতে সমস্যা হয়েছে।", "error");
  }
});

/* ---------- CSV export ---------- */
document.getElementById("export-csv-btn").addEventListener("click", () => {
  if (allSubscribers.length === 0) {
    showAdminToast("এক্সপোর্ট করার মতো কোনো সাবস্ক্রাইবার নেই।", "error");
    return;
  }
  const rows = [["email", "subscribed_at"]].concat(
    allSubscribers.map(s => [s.email, s.subscribedAt ? s.subscribedAt.toISOString() : ""])
  );
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `viveshop-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

/* ---------- Send to selected shortcut ---------- */
document.getElementById("email-selected-btn").addEventListener("click", () => {
  activeRecipientMode = "selected";
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.recipient === "selected"));
  switchView("campaign");
});

/* ---------- Campaign: product autofill ---------- */
function populateProductSelect() {
  const select = document.getElementById("campaign-product-select");
  PRODUCTS.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
}

document.getElementById("campaign-product-select").addEventListener("change", e => {
  const product = PRODUCTS.find(p => p.id === e.target.value);
  if (!product) return;
  document.getElementById("campaign-name").value = product.name;
  document.getElementById("campaign-price").value = "৳ " + product.price.toLocaleString("bn-BD");
  document.getElementById("campaign-image").value = (product.images && product.images[0]) || "";
  document.getElementById("campaign-url").value = `${location.origin}${location.pathname.replace(/admin\/.*/, "")}#/product?id=${product.id}`;
  updatePreview();
});

["campaign-name", "campaign-price", "campaign-image"].forEach(id => {
  document.getElementById(id).addEventListener("input", updatePreview);
});

function updatePreview() {
  document.getElementById("preview-name").textContent = document.getElementById("campaign-name").value || "প্রোডাক্টের নাম এখানে দেখাবে";
  document.getElementById("preview-price").textContent = document.getElementById("campaign-price").value || "৳ 0";
  const img = document.getElementById("campaign-image").value;
  document.getElementById("preview-image").src = img || "";
  document.getElementById("preview-image").style.display = img ? "block" : "none";
}

/* ---------- Campaign: recipient toggle ---------- */
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    activeRecipientMode = chip.dataset.recipient;
    document.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
  });
});

/* ---------- Campaign: send ---------- */
document.getElementById("send-campaign-btn").addEventListener("click", async () => {
  const name = document.getElementById("campaign-name").value.trim();
  const price = document.getElementById("campaign-price").value.trim();
  const image = document.getElementById("campaign-image").value.trim();
  const url = document.getElementById("campaign-url").value.trim();

  if (!name || !price || !image || !url) {
    showAdminToast("সব ফিল্ড পূরণ করো — নাম, দাম, ছবি, লিংক।", "error");
    return;
  }

  const recipients = activeRecipientMode === "selected" ? Array.from(selectedEmails) : allSubscribers.map(s => s.email);
  if (recipients.length === 0) {
    showAdminToast("পাঠানোর মতো কোনো রিসিপিয়েন্ট নেই।", "error");
    return;
  }
  if (!confirm(`${recipients.length} জন সাবস্ক্রাইবারকে "${name}" নিয়ে ইমেইল পাঠাবে?`)) return;

  const btn = document.getElementById("send-campaign-btn");
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> পাঠানো হচ্ছে…`;

  try {
    await sendProductEmail(recipients, { name, price, image, url });
    showAdminToast(`✅ ${recipients.length} জনকে ইমেইল পাঠানো হয়েছে।`, "success");
  } catch (err) {
    console.error(err);
    showAdminToast("ইমেইল পাঠাতে সমস্যা হয়েছে। EmailJS কনফিগ চেক করো।", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
});
