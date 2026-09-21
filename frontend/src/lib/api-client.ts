const API_BASE = "";

type ApiResult<T> = { success: true; data: T } | { success: false; error: string; details?: unknown };

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResult<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
    cache: "no-store",
  });

  try {
    const json = (await res.json()) as ApiResult<T>;
    return json;
  } catch {
    return { success: false, error: `Request failed (${res.status})` };
  }
}

export async function apiGet<T>(path: string) {
  return apiFetch<T>(path, { method: "GET" });
}

export async function apiSend<T>(path: string, method: string, body?: unknown) {
  return apiFetch<T>(path, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

/** Resolve media/product image URLs (uploads are served via frontend rewrite). */
export function mediaUrl(src: string | undefined | null) {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }
  return src;
}
