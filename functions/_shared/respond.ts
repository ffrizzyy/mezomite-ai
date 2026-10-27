/**
 * Shared response helpers for the Pages Functions.
 *
 * Error shape follows the PRD: `ok`, `field`, `message`. A `fields` map is
 * included as well because the form islands render per-field messages from it.
 */

export type Json = Record<string, unknown>;

const BASE_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

export function json(data: Json, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: BASE_HEADERS });
}

export function fail(field: string, message: string, status: number): Response {
  return json({ ok: false, field, message, fields: { [field]: message } }, status);
}

export function methodNotAllowed(allow: string): Response {
  return new Response(JSON.stringify({ ok: false, field: 'form', message: 'Method not allowed.' }), {
    status: 405,
    headers: { ...BASE_HEADERS, allow },
  });
}

export async function readJson<T>(request: Request): Promise<T | null> {
  const type = request.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) return null;
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    return body as T;
  } catch {
    return null;
  }
}

/** Cloudflare sets this header; the fallback keeps local `wrangler dev` honest. */
export function clientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'local';
}
