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
    list.innerHTML = `<div class="small-text text-[color:var(--muted)]">Không có email</div>`;
    return;
  }

  emails.forEach((mail) => {
    const div = document.createElement("div");
    div.className = "panel pixel-border p-4";

    const date = mail.date ? new Date(mail.date).toLocaleString() : "";
    const subject = escapeHtml(mail.subject || "(no subject)");

    div.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
        <div class="small-text text-[color:var(--muted)]">${date}</div>
        <div class="badge">📩 ${escapeHtml((mail.envelope_to || mail?.to_parsed?.[0]?.address || ""))}</div>
      </div>

      <div class="text-base mb-2">${subject}</div>

      <details class="cursor-pointer">
        <summary class="small-text text-[color:var(--blue2)]">▶ XEM NỘI DUNG</summary>
        <div class="mt-3 pixel-border p-3 bg-white text-black rounded-lg overflow-auto max-h-[420px]">
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
