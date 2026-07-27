export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export function getToken() {
  return localStorage.getItem("token");
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  window.dispatchEvent(new Event("auth-change"));
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    clearAuth();
  }

  return response;
}

export async function readJson(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || data.errors?.[0]?.msg || "Request failed");
  }

  return data;
}
