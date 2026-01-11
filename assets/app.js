// assets/app.js
import { fetchEmails } from "./api.js";
import { renderEmails, setStatus, showAuth, hideAuth } from "./ui.js";

const API_BASE = "https://mail-viewer.lupinanh2k4.workers.dev";
let refreshTimer = null;

function isAuthed() {
    return localStorage.getItem("mv_authed") === "1";
}

function setAuthed(ok) {
    localStorage.setItem("mv_authed", ok ? "1" : "0");
}

async function load() {
    const tag = document.getElementById("tagInput").value.trim();
    const q = document.getElementById("searchInput").value.trim();

    setStatus("⏳ Đang tải...");
    try {
        const data = await fetchEmails(API_BASE, tag);

        // Search subject (tính năng #6 mình làm luôn nhẹ nhàng)
        const filtered = q
            ? data.emails.filter(e =>
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
    refreshTimer = setInterval(load, 10_000); // tính năng #3 (auto refresh 10s)
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

    if (!isAuthed()) {
        showAuth();
        return;
    }

    hideAuth();
    load();
    startAutoRefresh();
});
