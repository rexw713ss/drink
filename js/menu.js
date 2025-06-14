/* ====== menu.js ====== */

// 請確保在此之前已載入 js/menu_data.js，並且該檔案定義了 const menuImages = { ... }

/* ====== 語言判斷 ====== */
const isChinese = document.documentElement.lang === "zh-Hant";

/* ====== 多語系切換功能 ====== */
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
  const target = langMap[file] || (isChinese ? "index_en.html" : "index.html");
  window.location.href = target;
}

/* ====== 取得查詢參數 ====== */
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/* ====== 主流程 ====== */
const brandId = getQueryParam("brand");
const data = menuImages[brandId];
const imagePath = data ? (isChinese ? data.zh : data.en) : null;

const brandTitle = document.getElementById("brand-title");
const container = document.getElementById("menu-container");

if (imagePath) {
  // 設定標題
  brandTitle.textContent = isChinese
    ? `🍹 ${brandId} 菜單`
    : `🍹 ${brandId} Menu`;

  // 顯示圖片
  const img = document.createElement("img");
  img.src = imagePath;
  img.alt = isChinese ? `${brandId} 菜單` : `${brandId} Menu`;
  img.className = "menu-image";
  img.addEventListener("click", () => openImageInNewTab(imagePath));
  container.appendChild(img);
} else {
  // 顯示錯誤訊息
  container.innerHTML = isChinese
    ? `<p>😥 找不到這間店的菜單</p>`
    : `<p>😥 Menu not found for this brand.</p>`;
}

/* ====== 開啟圖片新分頁 ====== */
function openImageInNewTab(url) {
  window.open(url, "_blank");
}

/* ====== 返回按鈕 ====== */
const backBtn = document.getElementById("back-btn");
if (backBtn) {
  backBtn.textContent = isChinese ? "⬅️ 回到品牌列表" : "⬅️ Back to brand list";
  backBtn.addEventListener("click", () => {
    window.location.href = isChinese ? "search.html" : "search_en.html";
  });
}

/* ====== 下載按鈕 ====== */
const downloadBtn = document.getElementById("download");
if (downloadBtn && imagePath) {
  downloadBtn.textContent = isChinese ? "⬇️ 下載菜單" : "⬇️ Download Menu";
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = imagePath;
    link.download = isChinese ? `${brandId}_菜單.jpg` : `${brandId}_menu.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

/* ====== 分享按鈕（Web Share API + Clipboard） ====== */
const shareBtn = document.getElementById("share-btn");
const shareStatus = document.getElementById("share-status");
if (shareBtn) {
  shareBtn.textContent = isChinese ? "🔗 分享這個菜單" : "🔗 Share this menu";
  shareBtn.addEventListener("click", async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: isChinese ? "分享菜單" : "Share Menu",
          text: isChinese
            ? "這是我找到的飲料店菜單："
            : "Check out this drink shop menu:",
          url,
        });
        shareStatus.textContent = isChinese
          ? "✅ 已成功分享！"
          : "✅ Shared successfully!";
      } catch {
        shareStatus.textContent = isChinese
          ? "❌ 分享取消或失敗"
          : "❌ Share canceled or failed";
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        shareStatus.textContent = isChinese
          ? "✅ 已複製連結到剪貼簿！"
          : "✅ URL copied to clipboard!";
      } catch {
        shareStatus.textContent = isChinese ? "❌ 複製失敗" : "❌ Copy failed";
      }
    }
    setTimeout(() => {
      shareStatus.textContent = "";
    }, 3000);
  });
}

/* ====== 社群分享連結 ====== */
const currentURL = encodeURIComponent(window.location.href);

const fbShare = document.getElementById("facebook-share");
if (fbShare) {
  fbShare.href = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
}

const lineShare = document.getElementById("line-share");
if (lineShare) {
  lineShare.href = `https://social-plugins.line.me/lineit/share?url=${currentURL}`;
}

const igTip = document.getElementById("instagram-tip");
if (igTip) {
  igTip.addEventListener("click", () => {
    alert(
      isChinese
        ? "IG 暫不支援網頁直接分享，請截圖或複製網址手動分享！"
        : "Instagram sharing is not supported. Please screenshot or copy the link manually!"
    );
  });
}
