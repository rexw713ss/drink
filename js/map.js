function initMap() {
  const lang = document.documentElement.lang; // 取得語言代碼，如 zh-Hant 或 en
  const isChinese = lang === "zh-Hant";

  const labelYouAreHere = isChinese ? "你在這裡" : "You are here";
  const labelNearbyStores = isChinese ? "附近的飲料店" : "Nearby Drink Shops";
  const locationError = isChinese
    ? "無法取得您的位置"
    : "Failed to get your location";
  const unsupportedGeolocation = isChinese
    ? "您的瀏覽器不支援定位功能"
    : "Your browser doesn't support geolocation";

  // 設定地圖標題
  document.getElementById("map-title").textContent = labelNearbyStores;

  if (!navigator.geolocation) {
    alert(unsupportedGeolocation);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // 初始化地圖
      const map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 14,
      });

      // 標記使用者位置
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: labelYouAreHere,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });

      // 搜尋附近的飲料店
      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: userLocation,
        radius: 5000,
        keyword: isChinese ? "飲料" : "bubble tea",
      };

      service.nearbySearch(request, (results, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK) return;

        results.forEach((place) => {
          const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
          });

          const infowindow = new google.maps.InfoWindow({
            content: `<strong>${place.name}</strong><br>${place.vicinity}`,
          });

          marker.addListener("click", () => {
            infowindow.open(map, marker);
          });
        });
      });
    },
    () => {
      alert(locationError);
    }
  );
}

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
window.initMap = initMap;
