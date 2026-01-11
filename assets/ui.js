// assets/ui.js
export function setStatus(text) {
    document.getElementById("status").textContent = text;
}

export function renderEmails(emails) {
    const list = document.getElementById("mailList");
    list.innerHTML = "";

    ensureToast();

    if (!emails.length) {
        list.innerHTML = `<div class="small-text text-[color:var(--muted)]">Không có email</div>`;
        return;
    }

    emails.forEach((mail) => {
        const div = document.createElement("div");
        div.className = "panel pixel-border p-4";

        const date = mail.date ? new Date(mail.date).toLocaleString() : "";
        const toAddr = String(mail.envelope_to || mail?.to_parsed?.[0]?.address || "");
        const subject = mail.subject || "(no subject)";

        // ✅ detect code
        const code = extractLikelyCode(mail);

        div.innerHTML = `
      <div class="flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div class="small-text text-[color:var(--muted)]">${escapeHtml(date)}</div>
          <div class="badge truncate">📩 ${escapeHtml(toAddr)}</div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="text-base break-words">${escapeHtml(subject)}</div>

          ${code
                ? `
              <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div class="badge">🔑 CODE: <span class="text-white">${escapeHtml(code)}</span></div>
                <button class="pixel-btn btn-accent w-full sm:w-auto"
                        data-copy="${escapeAttr(code)}">
                  COPY CODE
                </button>
              </div>
            `
                : ``
            }
        </div>

        <details class="cursor-pointer">
          <summary class="small-text text-[color:var(--blue2)]">▶ XEM NỘI DUNG</summary>
          <div class="mt-3 pixel-border panel p-3 overflow-hidden">
            <iframe
              class="w-full h-[420px] bg-white rounded-lg"
              sandbox=""
              referrerpolicy="no-referrer"
              srcdoc="${escapeAttr(mail.html ? mail.html : `<pre>${escapeHtml(mail.text || "")}</pre>`)}"
            ></iframe>
          </div>
        </details>
      </div>
    `;

        // bind copy button
        const btn = div.querySelector("[data-copy]");
        if (btn) {
            btn.addEventListener("click", async () => {
                const v = btn.getAttribute("data-copy");
                try {
                    await navigator.clipboard.writeText(v);
                    showToast(`✅ Copied: ${v}`);
                } catch {
                    // fallback
                    fallbackCopy(v);
                    showToast(`✅ Copied: ${v}`);
                }
            });
        }

        list.appendChild(div);
    });
}

function extractLikelyCode(mail) {
    const subject = String(mail.subject || "");
    const text = String(mail.text || "");
    const html = String(mail.html || "");

    // Keywords to increase confidence
    const hay = (subject + "\n" + text + "\n" + html).toLowerCase();
    const hasKeyword = /(otp|code|verification|verify|login|one[- ]time|passcode)/i.test(hay);

    // Find digit codes (4-10 digits), pick the first best-looking one
    const candidates = [...(subject + "\n" + text).matchAll(/\b(\d{4,10})\b/g)].map(m => m[1]);

    if (!candidates.length) return null;

    // Prefer 6 digits if keyword present
    if (hasKeyword) {
        const six = candidates.find(c => c.length === 6);
        if (six) return six;
    }

    // Else return first candidate
    return candidates[0];
}

function ensureToast() {
    if (document.getElementById("toast")) return;
    const t = document.createElement("div");
    t.id = "toast";
    t.className = "toast hidden";
    document.body.appendChild(t);
}

function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    t.classList.add("show");
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
        t.classList.remove("show");
        t.classList.add("hidden");
    }, 1800);
}

function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
}

function escapeHtml(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function escapeAttr(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;");
}
