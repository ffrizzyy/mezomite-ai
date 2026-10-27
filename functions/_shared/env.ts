/** Bindings available to every Pages Function in this project. */
export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  MAIL_FROM?: string;
  MAIL_TO?: string;
  SITE_ORIGIN?: string;
  CANCEL_SECRET?: string;
}
