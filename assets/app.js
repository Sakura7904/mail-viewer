// assets/app.js
import { fetchEmails } from "./api.js";
import { renderEmails, setStatus } from "./ui.js";

const API_BASE = "https://mail-viewer.lupinanh2k4.workers.dev";
let refreshTimer = null;

async function load() {
  const tag = document.getElementById("tagInput").value.trim();
  const q = document.getElementById("searchInput").value.trim();

  setStatus("⏳ Đang tải...");
  try {
    const data = await fetchEmails(API_BASE, tag);

    const filtered = q
      ? data.emails.filter((e) =>
          String(e.subject || "").toLowerCase().includes(q.toLowerCase())
        )
      : data.emails;

    renderEmails(filtered);
    setStatus(`📨 ${filtered.length} email`);
  } catch (e) {
    console.error(e);
    setStatus("❌ Lỗi tải mail");
  }
}

function startAutoRefresh() {
  stopAutoRefresh();
  refreshTimer = setInterval(load, 10_000);
}

function stopAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = null;
}

function bindUI() {
  document.getElementById("loadBtn").addEventListener("click", load);

  document.getElementById("tagInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") load();
  });

  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") load();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  bindUI();
  load();            // ✅ vào là load mail luôn
  startAutoRefresh();
});
