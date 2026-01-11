export function setStatus(text) {
    document.getElementById("status").textContent = text;
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
        const toAddr = String(mail.envelope_to || mail?.to_parsed?.[0]?.address || "");
        const subject = escapeHtml(mail.subject || "(no subject)");

        const html = mail.html || "";
        const text = mail.text || "";

        div.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
        <div class="small-text text-[color:var(--muted)]">${escapeHtml(date)}</div>
        <div class="badge">📩 ${escapeHtml(toAddr)}</div>
      </div>

      <div class="text-base mb-2">${subject}</div>

      <details class="cursor-pointer">
        <summary class="small-text text-[color:var(--blue2)]">▶ XEM NỘI DUNG</summary>

        <div class="mt-3 pixel-border panel p-3 overflow-hidden">
          <iframe
            class="w-full h-[420px] bg-white rounded-lg"
            sandbox=""
            referrerpolicy="no-referrer"
            srcdoc="${escapeAttr(html ? html : `<pre>${escapeHtml(text)}</pre>`)}"
          ></iframe>
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

// escape cho attribute (srcdoc="")
function escapeAttr(s) {
    // srcdoc vẫn là HTML, nhưng nó nằm trong attribute, nên cần escape tối thiểu để không vỡ quote
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;");
}
