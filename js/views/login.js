/* =========================================================
   ViveShop — Login ভিউ (আগের login.html + js/login.js)
   ========================================================= */
const LoginView = {
  mount(container, query) {
    const redirect = query?.get("redirect") || "";
    const signupHref = redirect ? `#/signup?redirect=${encodeURIComponent(redirect)}` : "#/signup";

    container.innerHTML = `
  <div class="auth-wrap">
    <div class="auth-card">
      <h1 class="bn">আবার স্বাগতম <i class="fa-solid fa-hand"></i></h1>
      <p class="sub bn">তোমার অ্যাকাউন্টে লগইন করো</p>

      <div class="form-msg" id="login-msg"></div>

      <form id="login-form">
        <div class="field">
          <label class="bn">ইমেইল</label>
          <input type="email" id="login-email" required autocomplete="email">
        </div>
        <div class="field">
          <label class="bn">পাসওয়ার্ড</label>
          <input type="password" id="login-password" required autocomplete="current-password">
          <div class="field-hint bn" style="text-align:right"><a href="#/forgot-password" style="color:var(--color-accent);font-weight:600">পাসওয়ার্ড ভুলে গেছো?</a></div>
        </div>
        <button type="submit" class="btn btn-primary btn-block btn-lg bn" id="login-btn">লগইন করো</button>
      </form>

      <p class="auth-alt bn">অ্যাকাউন্ট নেই? <a href="${signupHref}">সাইন আপ করো</a></p>
    </div>
  </div>`;

    document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const msg = document.getElementById("login-msg");
      const btn = document.getElementById("login-btn");
      msg.className = "form-msg";
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      btn.disabled = true; btn.innerHTML = `<span class="loader-spin"></span>`;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        msg.textContent = "লগইন সফল হয়েছে! নিয়ে যাওয়া হচ্ছে...";
        msg.classList.add("success", "show");
        setTimeout(() => { location.hash = redirect || "#/account"; }, 800);
      } catch (err) {
        msg.textContent = translateAuthError(err.code);
        msg.classList.add("error", "show");
        btn.disabled = false; btn.innerHTML = "লগইন করো";
      }
    });
  }
};
