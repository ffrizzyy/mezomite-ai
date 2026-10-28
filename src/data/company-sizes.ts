/**
 * The canonical company-size buckets.
 *
 * These are codes, not copy. `31-100` is what the server validates and what D1
 * stores; the label a visitor reads ("31-100 karyawan", "31-100 employees") is
 * presentation and lives in the locale dictionaries. Sending the label as the
 * value is how the form once rejected every answer to its own question.
 *
 * The buckets are the PRD's (see the sample payload in docs/PRD.md). Changing
 * one is a data migration, not a copy edit.
 */
export const COMPANY_SIZES = ['1-10', '11-30', '31-100', '101-300', '300+'] as const;

export type CompanySize = (typeof COMPANY_SIZES)[number];
