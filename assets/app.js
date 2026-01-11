// assets/app.js
import { fetchEmails } from "./api.js";
import { renderEmails, setStatus, setPagination } from "./ui.js";

const API_BASE = "https://mail-viewer.lupinanh2k4.workers.dev";
const PAGE_SIZE = 10;

let refreshTimer = null;

// state
let allEmails = [];
let filteredEmails = [];
let currentPage = 1;

function applyFilter() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  filteredEmails = q
    ? allEmails.filter(e => String(e.subject || "").toLowerCase().includes(q))
    : [...allEmails];

  // reset về trang 1 khi filter đổi
  currentPage = 1;
}

function renderPage() {
  const total = filteredEmails.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredEmails.slice(start, start + PAGE_SIZE);

  renderEmails(pageItems);

  setStatus(`📨 ${total} email • Trang ${currentPage}/${totalPages}`);
  setPagination({
    page: currentPage,
    totalPages,
    total,
    pageSize: PAGE_SIZE,
  });
}

async function load() {
  const tag = document.getElementById("tagInput").value.trim();

  setStatus("⏳ Đang tải...");
  try {
    const data = await fetchEmails(API_BASE, tag, 50); // fetch 50 rồi chia 10/trang
    allEmails = Array.isArray(data.emails) ? data.emails : [];

    applyFilter();
    renderPage();
  } catch (e) {
    console.error(e);
    setStatus("❌ Lỗi tải mail");
  }
}

function bindUI() {
  document.getElementById("loadBtn").addEventListener("click", load);

  document.getElementById("tagInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") load();
  });

  document.getElementById("searchInput").addEventListener("input", () => {
    applyFilter();
    renderPage();
  });

  // pagination buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;

    const action = btn.getAttribute("data-page");
    const totalPages = Math.max(1, Math.ceil(filteredEmails.length / PAGE_SIZE));

    if (action === "prev") currentPage = Math.max(1, currentPage - 1);
    if (action === "next") currentPage = Math.min(totalPages, currentPage + 1);
    if (action === "first") currentPage = 1;
    if (action === "last") currentPage = totalPages;

    renderPage();
  });
}

function startAutoRefresh() {
  stopAutoRefresh();
  refreshTimer = setInterval(load, 10_000);
}
function stopAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = null;
}

window.addEventListener("DOMContentLoaded", () => {
  bindUI();
  load();
  startAutoRefresh();
});
