const COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24; // 24 hours

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded);
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createSession(secret: string): Promise<string> {
  const exp = Date.now() + SESSION_MAX_AGE_MS;
  const payload = base64UrlEncode(JSON.stringify({ admin: true, exp }));
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySession(value: string | undefined, secret: string): Promise<boolean> {
  if (!value || !secret) return false;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return false;

  try {
    const expected = await sign(payload, secret);
    if (expected !== signature) return false;

    const data = JSON.parse(base64UrlDecode(payload));
    if (typeof data.exp !== 'number') return false;
    if (data.exp < Date.now()) return false;
    return data.admin === true;
  } catch {
    return false;
  }
}

export function getAdminPassword(env: Record<string, any> = import.meta.env): string | undefined {
  return env.ADMIN_PASSWORD;
}

export function getSessionSecret(env: Record<string, any> = import.meta.env): string | undefined {
  return env.ADMIN_SESSION_SECRET;
}

export async function getRuntimeEnv(): Promise<Record<string, any>> {
  try {
    // @ts-ignore - Cloudflare Workers runtime module
    const { env } = await import('cloudflare:workers');
    return (env as Record<string, any>) ?? import.meta.env;
  } catch {
    return import.meta.env;
  }
}

export { COOKIE_NAME };
