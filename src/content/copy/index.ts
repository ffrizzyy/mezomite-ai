import type { Locale } from '../../lib/i18n';
import type { Copy } from './types';
import { id } from './id';
import { en } from './en';

export const COPY: Record<Locale, Copy> = { id, en };

/** The single entry point components use. Never import `id.ts` directly. */
export function getCopy(locale: Locale): Copy {
  return COPY[locale];
}

export type { Copy, PageKey } from './types';
