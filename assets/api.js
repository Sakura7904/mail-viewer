// assets/api.js
export async function fetchEmails(API_BASE, tag) {
  const url = tag
    ? `${API_BASE}/emails?tag=${encodeURIComponent(tag)}`
    : `${API_BASE}/emails`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}
