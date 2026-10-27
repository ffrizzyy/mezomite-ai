import type { Locale } from '../../lib/i18n';
import type { LegalDocs } from './types';
import { legalId } from './id';
import { legalEn } from './en';

export const LEGAL: Record<Locale, LegalDocs> = { id: legalId, en: legalEn };

export function getLegal(locale: Locale): LegalDocs {
  return LEGAL[locale];
}

export type { LegalDoc, LegalSection } from './types';
