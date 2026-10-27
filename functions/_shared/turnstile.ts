/**
 * Turnstile verification. Tokens are single use and expire after five minutes,
 * so a failed submission needs a fresh token before it can succeed.
 */

type TurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
};

export type Verification = 'passed' | 'rejected' | 'unconfigured';

export async function verifyTurnstile(
  secret: string | undefined,
  token: unknown,
  ip: string,
): Promise<Verification> {
  if (!secret) return 'unconfigured';
  if (typeof token !== 'string' || token.trim().length === 0) return 'rejected';

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip && ip !== 'local') body.append('remoteip', ip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    if (!response.ok) return 'rejected';
    const result = (await response.json()) as TurnstileResponse;
    return result.success ? 'passed' : 'rejected';
  } catch {
    // A network failure is not proof of a bot, but it is also not verification.
    return 'rejected';
  }
}
