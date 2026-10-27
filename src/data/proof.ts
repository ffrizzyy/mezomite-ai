import type { Localized } from '../lib/i18n';

export type ProofPoint = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: Localized<string>;
  /** Format hint for the counter: plain integer, or hours. */
  format: 'integer' | 'hours';
};

/**
 * Proof numbers shown on the home page.
 *
 * PLACEHOLDER DATA. Every number here must be replaced with a verified figure
 * before launch, or the array must be emptied. An empty array is a supported
 * state: the section falls back to a text statement instead of a logo strip
 * (see F-002 acceptance criteria).
 */
export const PROOF_POINTS: ProofPoint[] = [
  {
    value: 120,
    suffix: '+',
    label: { id: 'Audit proses selesai', en: 'Process audits delivered' },
    format: 'integer',
  },
  {
    value: 14,
    label: { id: 'Industri ditangani', en: 'Industries served' },
    format: 'integer',
  },
  {
    value: 3200,
    label: { id: 'Jam kembali ke klien per tahun', en: 'Hours returned to clients per year' },
    format: 'hours',
  },
];

export const PROOF_IS_PLACEHOLDER = true;
