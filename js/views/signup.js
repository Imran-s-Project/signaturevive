/* =========================================================
   ViveShop — Signup ভিউ (আগের signup.html + js/signup.js)
   ========================================================= */
const SignupView = {
  mount(container) {
    container.innerHTML = `
  <div class="auth-wrap">
    <div class="auth-card">
      <h1 class="bn">অ্যাকাউন্ট তৈরি করো ✨</h1>
      <p class="sub bn">ViveShop-এ প্রথম অর্ডার করতে সাইন আপ করো</p>

      <div class="form-msg" id="signup-msg"></div>

      <form id="signup-form">
        <div class="field">
          <label class="bn">পূর্ণ নাম</label>
          <input type="text" id="signup-name" required autocomplete="name">
        </div>
        <div class="field">
          <label class="bn">ইমেইল</label>
          <input type="email" id="signup-email" required autocomplete="email">
        </div>
        <div class="field">
          <label class="bn">মোবাইল নম্বর</label>
          <input type="tel" id="signup-phone" required placeholder="01XXXXXXXXX" pattern="01[0-9]{9}">
        </div>
        <div class="field">
          <label class="bn">পাসওয়ার্ড</label>
          <input type="password" id="signup-password" required autocomplete="new-password" minlength="6">
          <div class="pw-strength"><div class="pw-strength-bar" id="pw-bar"></div></div>
          <div class="field-hint bn" id="pw-hint">কমপক্ষে ৬ ক্যারেক্টার ব্যবহার করো</div>
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg bn" id="signup-btn">সাইন আপ করো</button>
      </form>

      <p class="auth-alt bn">আগে থেকেই অ্যাকাউন্ট আছে? <a href="#/login">লগইন করো</a></p>
    </div>
  </div>`;

    const pwInput = document.getElementById("signup-password");
    const pwBar = document.getElementById("pw-bar");

    pwInput.addEventListener("input", () => {
      const v = pwInput.value;
      let strength = 0;
      if (v.length >= 6) strength++;
      if (v.length >= 10) strength++;
      if (/[A-Z]/.test(v) && /[0-9]/.test(v)) strength++;
      if (/[^A-Za-z0-9]/.test(v)) strength++;
      const pct = (strength / 4) * 100;
      const colors = ["#D93025", "#E8A33D", "#E8A33D", "#1F9D55"];
      pwBar.style.width = pct + "%";
      pwBar.style.background = colors[Math.max(0, strength - 1)] || "#D93025";
    });

    document.getElementById("signup-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = document.getElementById("signup-msg");
      const btn = document.getElementById("signup-btn");
      msg.className = "form-msg";

      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const phone = document.getElementById("signup-phone").value.trim();
      const password = pwInput.value;

      btn.disabled = true; btn.innerHTML = `<span class="loader-spin"></span>`;
      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await cred.user.updateProfile({ displayName: name });
        await db.collection("users").doc(cred.user.uid).set({
          name, email, phone,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        msg.textContent = "অ্যাকাউন্ট তৈরি হয়েছে! নিয়ে যাওয়া হচ্ছে...";
        msg.classList.add("success", "show");
        setTimeout(() => { location.hash = "#/account"; }, 800);
      } catch (err) {
        msg.textContent = translateAuthError(err.code);
        msg.classList.add("error", "show");
        btn.disabled = false; btn.innerHTML = "সাইন আপ করো";
      }
    });
  }
};
