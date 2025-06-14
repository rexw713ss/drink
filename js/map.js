function initMap() {
  const lang = document.documentElement.lang;
  const isChinese = lang === "zh-Hant";

  const labelYouAreHere = isChinese ? "你在這裡" : "You are here";
  const labelNearbyStores = isChinese ? "附近的飲料店" : "Nearby Drink Shops";
  const locationError = isChinese
    ? "無法取得您的位置"
    : "Failed to get your location";
  const unsupportedGeolocation = isChinese
    ? "您的瀏覽器不支援定位功能"
    : "Your browser doesn't support geolocation";

  document.getElementById("map-title").textContent = labelNearbyStores;
  document.getElementById("legend-title").textContent = isChinese
    ? "圖例"
    : "Legend";

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

      const map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 14,
      });

      // 使用者位置
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: labelYouAreHere,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });

      const service = new google.maps.places.PlacesService(map);

      // 一般飲料店
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

      // 品牌顏色與強化查詢關鍵字
      const brandIcons = {
        "50嵐": "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        CoCo: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
        得正: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        可不可: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        迷客夏: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
      };

      const brandQueries = {
        "50嵐": "50嵐 飲料",
        CoCo: "CoCo 都可 飲料",
        得正: "得正 手搖飲",
        可不可: "可不可 熟成紅茶",
        迷客夏: "迷客夏 Milkshop",
      };

      const brands = Object.keys(brandIcons);

      brands.forEach((brand) => {
        const brandRequest = {
          query: brandQueries[brand],
          location: userLocation,
          radius: 5000,
          fields: ["name", "geometry", "formatted_address"],
        };

        service.textSearch(brandRequest, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
              // 僅標記品牌名稱準確包含的店
              if (!place.name.includes(brand)) return;

              const marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location,
                title: place.name,
                icon: brandIcons[brand],
              });

              const infowindow = new google.maps.InfoWindow({
                content: `<strong>${place.name}</strong><br>${
                  place.formatted_address || ""
                }`,
              });

              marker.addListener("click", () => {
                infowindow.open(map, marker);
              });
            });
          }
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

  const target = langMap[file] || "index_en.html";
  window.location.href = target;
}

window.initMap = initMap;
