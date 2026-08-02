/* =========================================================
   ViveShop — Shop ভিউ (আগের shop.html + js/shop.js)
   ========================================================= */
const SHOP_CAT_BN_NAMES = { "Fashion": "ফ্যাশন", "Electronics": "ইলেকট্রনিক্স", "Home & Living": "হোম ও লিভিং", "Beauty": "বিউটি" };

const ShopView = {
  mount(container, query) {
    let state = {
      categories: query.get("cat") ? [query.get("cat")] : [],
      maxPrice: 3000,
      search: "",
      sort: "default"
    };

    container.innerHTML = `
  <div class="section">
    <div class="breadcrumb bn"><a href="#/">হোম</a> / <span>শপ</span></div>
    <h1 class="bn" style="font-size:26px;margin-bottom:24px">সব প্রোডাক্ট</h1>

    <div class="shop-layout">
      <aside class="filters">
        <h3 class="bn">ক্যাটাগরি</h3>
        <div class="filter-group" id="cat-filters"></div>

        <h3 class="bn">দাম</h3>
        <div class="filter-group">
          <div class="price-range">
            <span>৳0</span>
            <input type="range" id="price-range" min="0" max="3000" step="50" value="3000">
            <span id="price-range-val">৳3000</span>
          </div>
        </div>

        <button class="btn btn-outline btn-block bn" id="clear-filters">ফিল্টার মুছে ফেলো</button>
      </aside>

      <div>
        <div class="shop-toolbar">
          <span class="results-count bn" id="results-count"></span>
          <select id="sort-select" class="bn">
            <option value="default">সাজাও: ডিফল্ট</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
            <option value="rating">সর্বোচ্চ রেটিং</option>
          </select>
        </div>
        <div class="product-grid" id="shop-grid"></div>
      </div>
    </div>
  </div>`;

    function renderCatFilters() {
      const el = document.getElementById("cat-filters");
      el.innerHTML = CATEGORIES.map(c => `
    <label>
      <input type="checkbox" value="${c.name}" ${state.categories.includes(c.name) ? "checked" : ""}>
      <span class="bn">${SHOP_CAT_BN_NAMES[c.name]}</span>
    </label>`).join("");
      el.querySelectorAll("input").forEach(input => {
        input.addEventListener("change", () => {
          state.categories = [...el.querySelectorAll("input:checked")].map(i => i.value);
          applyFilters();
        });
      });
    }

    function applyFilters() {
      let results = PRODUCTS.filter(p => {
        const matchCat = state.categories.length === 0 || state.categories.includes(p.category);
        const matchPrice = p.price <= state.maxPrice;
        const matchSearch = !state.search || p.name.toLowerCase().includes(state.search.toLowerCase());
        return matchCat && matchPrice && matchSearch;
      });

      if (state.sort === "price-asc") results.sort((a, b) => a.price - b.price);
      else if (state.sort === "price-desc") results.sort((a, b) => b.price - a.price);
      else if (state.sort === "rating") results.sort((a, b) => b.rating - a.rating);

      document.getElementById("results-count").textContent = `${results.length}টি প্রোডাক্ট পাওয়া গেছে`;
      renderProductGrid(document.getElementById("shop-grid"), results);
    }

    renderCatFilters();
    applyFilters();

    document.getElementById("price-range").addEventListener("input", e => {
      state.maxPrice = Number(e.target.value);
      document.getElementById("price-range-val").textContent = "৳" + state.maxPrice;
      applyFilters();
    });

    document.getElementById("search-input")?.addEventListener("input", e => {
      state.search = e.target.value;
      applyFilters();
    });

    document.getElementById("sort-select").addEventListener("change", e => {
      state.sort = e.target.value;
      applyFilters();
    });

    document.getElementById("clear-filters").addEventListener("click", () => {
      state = { categories: [], maxPrice: 3000, search: "", sort: "default" };
      document.getElementById("price-range").value = 3000;
      document.getElementById("price-range-val").textContent = "৳3000";
      const searchInput = document.getElementById("search-input");
      if (searchInput) searchInput.value = "";
      document.getElementById("sort-select").value = "default";
      renderCatFilters();
      applyFilters();
    });
  }
};
