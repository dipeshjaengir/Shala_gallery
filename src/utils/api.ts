/**
 * SHALAGALLERY Centralized API Client & URL Configuration
 * 
 * Supports:
 * 1. Relative /api routing (seamlessly proxied via vercel.json in production, or vite in dev).
 * 2. Direct Render backend routing via VITE_API_URL if configured.
 * 3. Automatic JWT Bearer token fallback for browsers that restrict third-party cross-origin cookies.
 * 4. Automatic credentials: 'include' for HttpOnly secure cookie transmission.
 */

// If VITE_API_URL is set (e.g. https://shala-gallery.onrender.com), use it.
// Otherwise, default to empty string '' so requests route through relative /api paths
// (proxied by Vite in local development and vercel.json in production).
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE_URL) {
    return `${API_BASE_URL}${cleanPath}`;
  }
  return cleanPath;
}

export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('shala_admin_token');
  } catch {
    return null;
  }
}

export function setStoredAdminToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      sessionStorage.setItem('shala_admin_token', token);
    } else {
      sessionStorage.removeItem('shala_admin_token');
    }
  } catch {
    // Ignore storage restrictions
  }
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(path);
  const token = getStoredAdminToken();

  const headers = new Headers(options.headers || {});
  
  // Attach Bearer token for defense-in-depth across cross-origin browsers
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Ensure HttpOnly cookies are passed in all environments
  });
}
