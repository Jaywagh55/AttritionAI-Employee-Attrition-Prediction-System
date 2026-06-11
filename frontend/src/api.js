// Central API helper — uses VITE_API_URL in production (Netlify),
// falls back to relative paths during development (Vite proxy).
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchPredict(formData) {
  const res = await fetch(`${API_BASE}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text || 'Unknown error'}`);
  }
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/api/analytics`);
  return res.json();
}

export async function fetchModelInfo() {
  const res = await fetch(`${API_BASE}/api/model-info`);
  return res.json();
}

export function plotUrl(filename) {
  return `${API_BASE}/api/plots/${filename}`;
}
