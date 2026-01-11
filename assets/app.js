// assets/app.js
import { fetchEmails } from "./api.js";
import { renderEmails, setStatus, setPagination } from "./ui.js";

const API_BASE = "https://mail-viewer.lupinanh2k4.workers.dev";
const PAGE_SIZE = 5;
const FETCH_LIMIT = 50;

let refreshTimer = null;

// state
let allEmails = [];
let filteredEmails = [];
let currentPage = 1;

// ===== Guide =====
const GUIDE_KEY = "mv_guide_seen_v1";

function showGuide() {
    const modal = document.getElementById("guideModal");
    if (!modal) return;
    modal.classList.remove("hidden");
}

function hideGuide(markSeen = true) {
    const modal = document.getElementById("guideModal");
    if (!modal) return;
    modal.classList.add("hidden");
    if (markSeen) localStorage.setItem(GUIDE_KEY, "1");
}

function bindGuide() {
    const skip = document.getElementById("guideSkipBtn");
    const ok = document.getElementById("guideOkBtn");

    const onClose = () => {
        hideGuide(true);
        startApp(); // ✅ đóng modal thì mới chạy load + auto refresh
    };

    skip?.addEventListener("click", onClose);
    ok?.addEventListener("click", onClose);
}

// ===== Data / UI =====
function applyFilter() {
    const q = document.getElementById("searchInput").value.trim().toLowerCase();

    filteredEmails = q
        ? allEmails.filter((e) =>
            String(e.subject || "").toLowerCase().includes(q)
        )
        : [...allEmails];

    currentPage = 1; // reset về trang 1 khi filter thay đổi
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
        // fetch nhiều hơn để phân trang client-side
        const data = await fetchEmails(API_BASE, tag, FETCH_LIMIT);
        allEmails = Array.isArray(data.emails) ? data.emails : [];

        applyFilter();
        renderPage();
    } catch (e) {
        console.error(e);
        setStatus("❌ Lỗi tải mail");
    }
}

// ===== Pagination click handler =====
function handlePaginationClick(e) {
    const btn = e.target.closest("[data-page]");
    if (!btn) return;

    const action = btn.getAttribute("data-page");
    const totalPages = Math.max(1, Math.ceil(filteredEmails.length / PAGE_SIZE));

    if (action === "prev") currentPage = Math.max(1, currentPage - 1);
    if (action === "next") currentPage = Math.min(totalPages, currentPage + 1);
    if (action === "first") currentPage = 1;
    if (action === "last") currentPage = totalPages;

    renderPage();
}

// ===== Auto refresh =====
function startAutoRefresh() {
    stopAutoRefresh();
    refreshTimer = setInterval(load, 10_000);
}

function stopAutoRefresh() {
    if (refreshTimer) clearInterval(refreshTimer);
    refreshTimer = null;
}

// ===== Bind UI =====
function bindUI() {
    document.getElementById("loadBtn")?.addEventListener("click", load);

    document.getElementById("tagInput")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") load();
    });

    // search realtime
    document.getElementById("searchInput")?.addEventListener("input", () => {
        applyFilter();
        renderPage();
    });

    // pagination buttons (delegation)
    document.addEventListener("click", handlePaginationClick);
}

// ===== App start =====
function startApp() {
    // chống start nhiều lần nếu user bấm guide nhiều lần
    if (refreshTimer) return;

    load();
    startAutoRefresh();
}

window.addEventListener("DOMContentLoaded", () => {
    bindUI();
    bindGuide();

    // ✅ chưa đọc hướng dẫn thì chỉ show modal, chưa load mail
    if (localStorage.getItem(GUIDE_KEY) !== "1") {
        showGuide();
        return;
    }

    // ✅ đã đọc thì chạy luôn
    startApp();
});
