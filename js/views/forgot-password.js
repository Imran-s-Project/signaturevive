/* =========================================================
   ViveShop — Forgot password ভিউ (আগের forgot-password.html + js/forgot-password.js)
   ========================================================= */
const ForgotPasswordView = {
  mount(container) {
    container.innerHTML = `
  <div class="auth-wrap">
    <div class="auth-card">
      <h1 class="bn">পাসওয়ার্ড রিসেট করো <i class="fa-solid fa-key"></i></h1>
      <p class="sub bn">তোমার ইমেইল দাও — আমরা রিসেট লিংক পাঠিয়ে দেব</p>

      <div class="form-msg" id="reset-msg"></div>

      <form id="reset-form">
        <div class="field">
          <label class="bn">ইমেইল</label>
          <input type="email" id="reset-email" required autocomplete="email">
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg bn" id="reset-btn">রিসেট লিংক পাঠাও</button>
      </form>

      <p class="auth-alt bn">পাসওয়ার্ড মনে পড়েছে? <a href="#/login">লগইনে ফিরে যাও</a></p>
    </div>
  </div>`;

    document.getElementById("reset-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = document.getElementById("reset-msg");
      const btn = document.getElementById("reset-btn");
      msg.className = "form-msg";
      const email = document.getElementById("reset-email").value.trim();

      btn.disabled = true; btn.innerHTML = `<span class="loader-spin"></span>`;
      try {
        await auth.sendPasswordResetEmail(email);
        msg.textContent = "রিসেট লিংক পাঠানো হয়েছে! তোমার ইমেইল ইনবক্স (ও স্প্যাম ফোল্ডার) চেক করো।";
        msg.classList.add("success", "show");
        document.getElementById("reset-form").reset();
        btn.disabled = false; btn.innerHTML = "রিসেট লিংক পাঠাও";
      } catch (err) {
        msg.textContent = translateAuthError(err.code);
        msg.classList.add("error", "show");
        btn.disabled = false; btn.innerHTML = "রিসেট লিংক পাঠাও";
      }
    });
  }
};
