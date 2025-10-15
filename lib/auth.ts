export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://api.gradabroad.net";

export interface AuthPayloadLike {
  access?: string;
  access_token?: string;
  token?: string;
  user?: unknown;
  [key: string]: unknown;
}

export function extractAccessToken(payload: AuthPayloadLike): string | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.access === "string" && payload.access) return payload.access;
  if (typeof payload.access_token === "string" && payload.access_token) return payload.access_token;
  if (typeof payload.token === "string" && payload.token) return payload.token;
  return null;
}

export function saveAuthToStorage(payload: AuthPayloadLike): void {
  if (typeof window === "undefined") return;
  try {
    const accessToken = extractAccessToken(payload);
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (payload.user !== undefined) {
      localStorage.setItem("user", JSON.stringify(payload.user));
    }
  } catch {
    // ignore storage errors
  }
}

export function getAccessTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("access_token");
  } catch {
    return null;
  }
}

export function getUserFromStorage<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  } catch {
    // ignore
  }
}

export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = getAccessTokenFromStorage();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");
  return fetch(input, { ...init, headers });
}


