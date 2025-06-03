const brands = [
  { name: "CoCo 都可", image: "assets/brands/coco.jpg", id: "coco" },
  { name: "50嵐", image: "assets/brands/50lan.png", id: "50lan" },
  { name: "可不可熟成紅茶", image: "assets/brands/kebuke.png", id: "kebuke" },
  { name: "迷客夏", image: "assets/brands/milkshop.png", id: "milkshop" },
  { name: "得正", image: "assets/brands/proof.png", id: "proof" },
];

const container = document.getElementById("brand-container");

brands.forEach((brand) => {
  const card = document.createElement("div");
  card.className = "brand-card";
  card.innerHTML = `
      <img src="${brand.image}" alt="${brand.name}" />
      <h3>${brand.name}</h3>
    `;

  const isChinese = document.documentElement.lang === "zh-Hant";
  const menuPage = isChinese ? "menu.html" : "menu_en.html";

  card.addEventListener("click", () => {
    window.location.href = `${menuPage}?brand=${brand.id}`;
  });

  container.appendChild(card);
});

function switchLanguage() {
  const path = window.location.pathname;
  const file = path.split("/").pop(); // 取得目前頁面檔名

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

  const target = langMap[file] || "index_en.html";
  window.location.href = target;
}
