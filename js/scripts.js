// Firebase 初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdxFxYyMEc5B369_jvuDeCVomqKrt9uMc",
  authDomain: "web-project-d6ec9.firebaseapp.com",
  projectId: "web-project-d6ec9",
  storageBucket: "web-project-d6ec9.firebasestorage.app",
  messagingSenderId: "264897216767",
  appId: "1:264897216767:web:61b57278bbb7d56c000cca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const isChinese = document.documentElement.lang === "zh-Hant";

// —— 語言切換 —— //
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

// —— 切換聊天視窗 —— //
function toggleChatbot() {
  const pop = document.getElementById("chatbot-popup");
  if (!pop) return;
  pop.classList.toggle("active");
  if (pop.classList.contains("active")) resetBot();
}
window.toggleChatbot = toggleChatbot;

// —— 工具函式 —— //
function appendBubble(text, sender = "bot", speed = 30) {
  const chat = document.getElementById("chat-container");
  if (!chat) return;
  const b = document.createElement("div");
  b.className = `bubble ${sender}`;
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
  let i = 0;
  const t = setInterval(() => {
    b.textContent += text[i++] || "";
    chat.scrollTop = chat.scrollHeight;
    if (i >= text.length) clearInterval(t);
  }, speed);
}

function appendButtons(html) {
  const chat = document.getElementById("chat-container");
  if (!chat) return;
  const w = document.createElement("div");
  w.innerHTML = html;
  chat.appendChild(w);
  chat.scrollTop = chat.scrollHeight;
}

// —— 新增：按鈕快速觸發命令 —— //
function triggerCommand(keyword) {
  const inp = document.getElementById("user-input");
  inp.value = `/${keyword}`;
  sendMessage();
}
window.triggerCommand = triggerCommand;

// —— 重置機器人對話（顯示命令按鈕） —— //
function resetBot() {
  const chat = document.getElementById("chat-container");
  if (!chat) return;
  chat.innerHTML = "";

  if (isChinese) {
    appendBubble("請輸入關鍵字（或點按按鈕）來獲取對應飲料：(記得加'/')");
    appendButtons(`
      <button class="reply-button" onclick="triggerCommand('清爽')">/清爽</button>
      <button class="reply-button" onclick="triggerCommand('甜')">/甜</button>
      <button class="reply-button" onclick="triggerCommand('茶')">/茶</button>
      <button class="reply-button" onclick="triggerCommand('濃郁')">/濃郁</button>
      <button class="reply-button" onclick="triggerCommand('鹹')">/鹹</button>
      <button class="reply-button" onclick="triggerCommand('檸檬')">/檸檬</button>
    `);
  } else {
    appendBubble(
      "Enter a keyword (or click a button) to get matching drinks:(remember to add '/')"
    );
    appendButtons(`
      <button class="reply-button" onclick="triggerCommand('fresh')">/fresh</button>
      <button class="reply-button" onclick="triggerCommand('sweet')">/sweet</button>
      <button class="reply-button" onclick="triggerCommand('tea')">/tea</button>
      <button class="reply-button" onclick="triggerCommand('rich')">/rich</button>
      <button class="reply-button" onclick="triggerCommand('salty')">/salty</button>
      <button class="reply-button" onclick="triggerCommand('lemon')">/lemon</button>
    `);
  }
}

// —— 關鍵字 & 後端混合回覆 —— //
async function sendMessage() {
  const inp = document.getElementById("user-input");
  if (!inp) return;
  const msg = inp.value.trim();
  if (!msg) return;

  appendBubble(msg, "user");
  inp.value = "";

  // 1. 關鍵字命令攔截
  if (msg.startsWith("/")) {
    const cmd = msg.slice(1);

    // —— 特殊罵人命令 —— //
    if (cmd === "不知道") {
      const insult = "攏麥呤，出頭這濟🙄🙄";
      appendBubble(insult);
      try {
        const docRef = await addDoc(collection(db, "chats"), {
          user: msg,
          bot: insult,
          createdAt: serverTimestamp(),
        });
        console.log("✅ Firestore 寫入成功，ID:", docRef.id);
      } catch (e) {
        console.error("❌ Firestore 寫入失敗：", e.code, e.message);
      }
      return;
    }
    if (cmd.toLowerCase() === "idk") {
      const insult = "Don’t drink any of it—there’s nothing but problems!";
      appendBubble(insult);
      try {
        const docRef = await addDoc(collection(db, "chats"), {
          user: msg,
          bot: insult,
          createdAt: serverTimestamp(),
        });
        console.log("✅ Firestore 寫入成功，ID:", docRef.id);
      } catch (e) {
        console.error("❌ Firestore 寫入失敗：", e.code, e.message);
      }
      return;
    }

    // —— 一般推薦命令 —— //
    const menu = isChinese
      ? {
          清爽: ["水果茶", "紅茶", "果汁冰沙"],
          甜: ["珍珠奶茶", "布丁奶茶", "布丁厚奶"],
          茶: ["奶蓋烏龍", "古早味紅茶", "鐵觀音"],
          濃郁: ["黑糖厚奶", "焦糖鮮奶茶", "巧克力奶昔"],
          鹹: ["鹹檸七", "蘆薈綠茶", "海鹽奶蓋紅茶"],
          檸檬: ["檸檬冬瓜", "檸檬愛玉", "蜂蜜檸檬茶"],
        }
      : {
          fresh: ["Fruit Tea", "Black Tea", "Fruit Slush"],
          sweet: ["Pearl Milk Tea", "Pudding Milk Tea", "Pudding Thick Milk"],
          tea: ["TeaTop Milk Cap Oolong", "Classic Black Tea", "Tieguanyin"],
          rich: [
            "Brown Sugar Thick Milk",
            "Caramel Milk Tea",
            "Chocolate Shake",
          ],
          salty: [
            "Salty Lemon Soda",
            "Aloe Vera Green Tea",
            "Sea Salt Milk Cap",
          ],
          lemon: ["Lemon Wintermelon", "Lemon Aiyu Jelly", "Honey Lemon Tea"],
        };

    const list = menu[cmd] || [];
    const reply = list.length
      ? isChinese
        ? `以下是${cmd}飲料推薦：\n• ${list.join("\n• ")}`
        : `Here are some ${cmd} drink suggestions:\n• ${list.join("\n• ")}`
      : isChinese
      ? `抱歉，目前沒有「${cmd}」相關的推薦。`
      : `Sorry, no recommendations for "${cmd}".`;

    appendBubble(reply);
    try {
      const docRef = await addDoc(collection(db, "chats"), {
        user: msg,
        bot: reply,
        createdAt: serverTimestamp(),
      });
      console.log("✅ Firestore 寫入成功，ID:", docRef.id);
    } catch (e) {
      console.error("❌ Firestore 寫入失敗：", e.code, e.message);
    }
    return;
  }

  // 2. 其他訊息走後端
  let replyText = "";
  try {
    const qs = `?message=${encodeURIComponent(msg)}&isChinese=${isChinese}`;
    const res = await fetch(`/api/chat${qs}`);
    if (!res.ok) throw new Error(`伺服器錯誤：${res.status}`);
    const txt = await res.text();
    replyText = JSON.parse(txt).reply;
  } catch (err) {
    console.error("取得機器人回覆失敗：", err);
    replyText = isChinese
      ? "回覆或指令錯誤，請再試一次"
      : "Reply/command error, please try again later";
  }

  appendBubble(replyText);

  // 3. 寫入 Firestore
  try {
    const docRef = await addDoc(collection(db, "chats"), {
      user: msg,
      bot: replyText,
      createdAt: server,
    });
    console.log("✅ Firestore 寫入成功，ID:", docRef.id);
  } catch (err) {
    console.error("❌ Firestore 寫入失敗：", err.code, err.message);
  }
}

// —— DOM 初始化 —— //
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("lang-toggle");
  const tglBtn = document.getElementById("chatbot-toggle");
  const closeBtn = document.querySelector(".chatbot-close");
  const sendBtn = document.getElementById("send-btn");
  const inp = document.getElementById("user-input");
  const pop = document.getElementById("chatbot-popup");

  if (langBtn) langBtn.addEventListener("click", switchLanguage);
  if (tglBtn) tglBtn.addEventListener("click", toggleChatbot);
  if (closeBtn) closeBtn.addEventListener("click", toggleChatbot);
  if (sendBtn) sendBtn.addEventListener("click", sendMessage);

  if (inp)
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendMessage();
    });

  if (pop) pop.classList.remove("active");
});
