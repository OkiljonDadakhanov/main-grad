export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://api.gradabroad.net";

export interface AuthPayloadLike {
  access?: string;
  access_token?: string;
  token?: string;
  refresh?: string;
  refresh_token?: string;
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

export function extractRefreshToken(payload: AuthPayloadLike): string | null {
  if (!payload || typeof payload !== "object") return null;
  if (typeof payload.refresh === "string" && payload.refresh) return payload.refresh;
  if (typeof payload.refresh_token === "string" && payload.refresh_token) return payload.refresh_token;
  return null;
}

export function saveAuthToStorage(payload: AuthPayloadLike): void {
  if (typeof window === "undefined") return;
  try {
    const accessToken = extractAccessToken(payload);
    const refreshToken = extractRefreshToken(payload);
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
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

export function getRefreshTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("refresh_token");
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
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  } catch {
    // ignore
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshTokenFromStorage();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) {
      clearAuthStorage();
      return null;
    }

    const data = await res.json();
    const newAccessToken = extractAccessToken(data);
    if (newAccessToken) {
      localStorage.setItem("access_token", newAccessToken);
      // Update refresh token if provided
      const newRefreshToken = extractRefreshToken(data);
      if (newRefreshToken) {
        localStorage.setItem("refresh_token", newRefreshToken);
      }
      return newAccessToken;
    }
    return null;
  } catch {
    clearAuthStorage();
    return null;
  }
}

export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  let token = getAccessTokenFromStorage();
  const headers = new Headers(init.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Accept", "application/json");
  
  let response = await fetch(input, { ...init, headers });
  
  // If 401 Unauthorized, try to refresh token
  if (response.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry the request with new token
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(input, { ...init, headers });
    }
  }
  
  return response;
}


