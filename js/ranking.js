// 檔案：js/ranking.js
(function () {
  // 根據 <html lang> 屬性判斷中／英語系
  const isChinese = document.documentElement.lang === "zh-Hant";

  // 排行資料
  const rankingData = [
    {
      name_cn: "可不可熟成紅茶",
      name_en: "Kebuke",
      score: 4.7,
      reviews: 10,
      recommend_cn: "熟成紅茶",
      recommend_en: "Black Tea",
    },
    {
      name_cn: "50嵐",
      name_en: "50 Lan",
      score: 4.6,
      reviews: 10,
      recommend_cn: "1號, 冰淇淋紅茶",
      recommend_en: "No. 1, Ice cream Black Tea",
    },
    {
      name_cn: "CoCo都可",
      name_en: "CoCo",
      score: 4.3,
      reviews: 10,
      recommend_cn: "珍珠奶茶",
      recommend_en: "Bubble Milk Tea",
    },
    {
      name_cn: "迷客夏",
      name_en: "Milkshop",
      score: 4.4,
      reviews: 10,
      recommend_cn: "珍珠鮮奶",
      recommend_en: "Bubble Milk Tea",
    },
    {
      name_cn: "得正",
      name_en: "OOLONG TEA PROJECT",
      score: 4.4,
      reviews: 10,
      recommend_cn: "輕烏龍",
      recommend_en: "Light Roasted Oolong Tea",
    },
  ];

  // 切換語言函式（使用現有的檔案對應邏輯）
  function switchLanguage() {
    const file = window.location.pathname.split("/").pop();
    const map = {
      "index.html": "index_en.html",
      "index_en.html": "index.html",
      "search.html": "search_en.html",
      "search_en.html": "search.html",
      "price_compare.html": "price_compare_en.html",
      "price_compare_en.html": "price_compare.html",
      "ranking.html": "ranking_en.html",
      "ranking_en.html": "ranking.html",
      "map.html": "map_en.html",
      "map_en.html": "map.html",
      "menu.html": "menu_en.html",
      "menu_en.html": "menu.html",
    };
    window.location.href = map[file] || "index_en.html";
  }
  window.switchLanguage = switchLanguage;

  // 生成 Podium 排行
  function renderRanking() {
    const container = document.getElementById("ranking-list");
    container.innerHTML = "";

    // 更新標題
    document.getElementById("ranking-title").textContent = isChinese
      ? "熱門排行榜"
      : "Popular Rankings";

    rankingData.forEach((item, idx) => {
      const wrapper = document.createElement("div");
      wrapper.className = "card-wrapper";

      const badge = document.createElement("div");
      badge.className = "rank-badge";
      badge.textContent = idx + 1;
      wrapper.appendChild(badge);

      const card = document.createElement("div");
      card.className = "card";

      const h3 = document.createElement("h3");
      h3.textContent = isChinese ? item.name_cn : item.name_en;
      card.appendChild(h3);

      const p1 = document.createElement("p");
      p1.textContent = isChinese
        ? `⭐ 評分：${item.score} / 5`
        : `⭐ Rating: ${item.score} / 5`;
      card.appendChild(p1);

      const p2 = document.createElement("p");
      p2.textContent = isChinese
        ? `📝 評論數：${item.reviews}`
        : `📝 Reviews: ${item.reviews}`;
      card.appendChild(p2);

      const p3 = document.createElement("p");
      p3.textContent = isChinese
        ? `🔥 推薦品項：${item.recommend_cn}`
        : `🔥 Recommended: ${item.recommend_en}`;
      card.appendChild(p3);

      wrapper.appendChild(card);
      container.appendChild(wrapper);
    });
  }

  // 綁定事件並渲染
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("lang-btn");
    if (btn) {
      btn.textContent = isChinese ? "🌐 English" : "🌐 中文";
      btn.addEventListener("click", switchLanguage);
    }
    renderRanking();
  });
})();
