// 語言判斷
const isChinese = document.documentElement.lang === "zh-Hant";

// 飲料價格資料
const drinkPrices = {
  pearl: [
    { brand: "CoCo 都可", price: 55 },
    { brand: "50嵐", price: 55 },
    { brand: "可不可熟成紅茶", price: 70 },
    { brand: "迷客夏", price: 70 },
    { brand: "得正", price: 55 },
  ],
  green: [
    { brand: "CoCo 都可", price: 35 },
    { brand: "50嵐", price: 35 },
    { brand: "可不可熟成紅茶", price: 40 },
    { brand: "迷客夏", price: 35 },
    { brand: "得正", price: 30 },
  ],
  milkcap: [
    { brand: "CoCo 都可", price: 35 },
    { brand: "50嵐", price: 35 },
    { brand: "可不可熟成紅茶", price: 40 },
    { brand: "迷客夏", price: 35 },
    { brand: "得正", price: 30 },
  ],
};

// 取得容器
const container = document.getElementById("compare-container");

// 顯示卡片並加上最便宜提示
function renderCards(drinkKey) {
  container.innerHTML = ""; // 清空畫面
  const items = drinkPrices[drinkKey] || [];

  // 👉 顯示最便宜提示
  if (items.length > 0) {
    const minPrice = Math.min(...items.map((i) => i.price));
    const cheapest = items.find((i) => i.price === minPrice);

    const tip = document.createElement("p");
    tip.style.textAlign = "center";
    tip.style.fontWeight = "bold";
    tip.style.fontSize = "1.2em";
    tip.style.color = "#ff6600";
    tip.innerText = isChinese
      ? `最便宜的是 ${cheapest.brand}：$${cheapest.price}`
      : `Cheapest: ${cheapest.brand}, $${cheapest.price}`;
    container.appendChild(tip);
  }

  // 👉 顯示品牌卡片 + 動畫
  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "brand-card animated";
    card.style.animationDelay = `${index * 0.1}s`;

    card.innerHTML = `
      <h3>${item.brand}</h3>
      <p>${isChinese ? "價格" : "Price"}：$${item.price}</p>
    `;
    container.appendChild(card);
  });
}

// 綁定按鈕事件
const buttons = document.querySelectorAll(".drink-btn");
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    renderCards(btn.dataset.drink);
  });
});

// 預設載入：珍珠奶茶
renderCards("pearl");

// 語言切換
function switchLanguage() {
  const path = window.location.pathname;
  const file = path.split("/").pop();
  const langMap = {
    "index.html": "index_en.html",
    "index_en.html": "index.html",
    "search.html": "search_en.html",
    "search_en.html": "search.html",
    "ranking.html": "ranking_en.html",
    "ranking_en.html": "ranking.html",
    "map.html": "map_en.html",
    "map_en.html": "map.html",
    "price_compare.html": "price_compare_en.html",
    "price_compare_en.html": "price_compare.html",
    "menu.html": "menu_en.html",
    "menu_en.html": "menu.html",
  };
  window.location.href = langMap[file] || "index_en.html";
}
