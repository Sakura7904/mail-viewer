// assets/ui.js
export function setStatus(text) {
  document.getElementById("status").textContent = text;
}

export function showAuth() {
  document.getElementById("authModal").classList.remove("hidden");
  document.getElementById("app").classList.add("blur-sm");
}

export function hideAuth() {
  document.getElementById("authModal").classList.add("hidden");
  document.getElementById("app").classList.remove("blur-sm");
  document.getElementById("passwordInput").value = "";
  document.getElementById("authError").textContent = "";
}

export function renderEmails(emails) {
  const list = document.getElementById("mailList");
  list.innerHTML = "";

  if (!emails.length) {
    list.innerHTML = `<div class="text-slate-400">Không có email</div>`;
    return;
  }

  emails.forEach((mail) => {
    const div = document.createElement("div");
    div.className =
      "bg-slate-800 border border-slate-700 rounded-xl p-4 hover:bg-slate-700 transition";

    const date = mail.date ? new Date(mail.date).toLocaleString() : "";

    div.innerHTML = `
      <div class="text-sm text-slate-400 mb-1">${date}</div>
      <div class="font-semibold mb-2">${escapeHtml(mail.subject || "(no subject)")}</div>
      <details class="cursor-pointer">
        <summary class="text-blue-400">Xem nội dung</summary>
        <div class="mt-3 p-3 bg-white text-black rounded-lg overflow-auto max-h-[420px]">
          ${mail.html || `<pre>${escapeHtml(mail.text || "")}</pre>`}
        </div>
      </details>
    `;

    list.appendChild(div);
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
