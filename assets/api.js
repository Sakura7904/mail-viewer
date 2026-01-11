// assets/api.js
export async function fetchEmails(API_BASE, tag, limit = 50) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  params.set("limit", String(limit)); // <-- thêm

  const url = `${API_BASE}/emails?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    let detail = "";
    try { detail = await res.text(); } catch {}
    throw new Error(`fetchEmails failed: ${res.status} ${detail}`);
  }
  return await res.json();
}
