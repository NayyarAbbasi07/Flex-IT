/** Same-origin admin fetches that always send the auth cookie. */
export async function adminFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(path, {
    ...init,
    credentials: "include",
    headers,
    cache: "no-store",
  });
}

export async function adminJson<T = unknown>(path: string, init?: RequestInit) {
  const res = await adminFetch(path, init);
  const json = await res.json().catch(() => ({ success: false, error: "Bad response" }));
  return { res, json: json as { success?: boolean; data?: T; error?: string; pagination?: unknown } };
}
