import type { Localized, RouteKey } from '../lib/i18n';

export type Service = {
  slug: string;
  order: number;
  title: Localized<string>;
  summary: Localized<string>;
  deliverable: Localized<string>;
  duration: Localized<string>;
  price: number;
  bestFor: Localized<string>;
  includes: Localized<string[]>;
  nextStep: { key: RouteKey; label: Localized<string> };
};

/** Ordered cheapest to most expensive, as F-003 requires. */
export const SERVICES: Service[] = [
  {
    slug: 'audit-proses',
    order: 1,
    title: { id: 'Audit proses', en: 'Process audit' },
    summary: {
      id: 'Kami memetakan cara kerja Anda, menghitung waktu dan biaya per proses, lalu memberi peringkat pada setiap peluang perbaikan.',
      en: 'We map how work actually moves, price the time each process burns, and rank every improvement opportunity.',
    },
    deliverable: {
      id: 'Laporan audit dengan peta alur kerja, biaya per proses, dan daftar peluang berskor.',
      en: 'An audit report with the workflow map, cost per process, and a scored opportunity list.',
    },
    duration: { id: '2 minggu', en: '2 weeks' },
    price: 1_500_000,
    bestFor: {
      id: 'Pemilik yang tahu ada yang salah, tetapi belum tahu bagian mana.',
      en: 'An owner who knows something is wrong but not which part.',
    },
    includes: {
      id: [
        'Wawancara 3–5 orang kunci',
        'Peta alur kerja saat ini',
        'Hitungan jam dan biaya per proses',
        'Daftar peluang dengan skor dan estimasi dampak',
        'Sesi presentasi hasil 60 menit',
      ],
      en: [
        'Interviews with 3–5 key people',
        'The current-state workflow map',
        'Hours and cost per process',
        'An opportunity list with scores and expected impact',
        'A 60-minute findings session',
      ],
    },
    nextStep: { key: 'method', label: { id: 'Lihat metode audit', en: 'See the audit method' } },
  },
  {
    slug: 'pemetaan-otomasi',
    order: 2,
    title: { id: 'Pemetaan dan otomasi', en: 'Mapping and automation' },
    summary: {
      id: 'Setelah audit, kami membangun satu otomasi yang benar-benar dipakai: alur baru, integrasi, dokumentasi, dan pelatihan tim.',
      en: 'After the audit we build one automation that gets used: a new workflow, the integrations, the documentation, and team training.',
    },
    deliverable: {
      id: 'Satu alur kerja baru yang berjalan di produksi, plus dokumentasi dan pelatihan.',
      en: 'One new workflow running in production, plus documentation and training.',
    },
    duration: { id: '4–6 minggu', en: '4–6 weeks' },
    price: 6_000_000,
    bestFor: {
      id: 'Bisnis yang sudah selesai diaudit dan ingin satu perbaikan berjalan.',
      en: 'A business that has been audited and wants one fix shipped.',
    },
    includes: {
      id: [
        'Desain alur kerja yang dituju',
        'Satu otomasi prioritas, misalnya persetujuan pembelian atau rekonsiliasi stok',
        'Integrasi ke alat yang sudah Anda pakai',
        'Dokumentasi dan panduan operasi',
        'Dua sesi pelatihan tim',
        'Pendampingan 30 hari setelah rilis',
      ],
      en: [
        'The target-state workflow design',
        'One priority automation, such as purchase approvals or stock reconciliation',
        'Integration with the tools you already use',
        'Documentation and an operating guide',
        'Two team training sessions',
        '30 days of support after release',
      ],
    },
    nextStep: { key: 'contact', label: { id: 'Diskusikan lingkupnya', en: 'Discuss the scope' } },
  },
  {
    slug: 'roadmap-12-bulan',
    order: 3,
    title: { id: 'Roadmap 12 bulan', en: '12-month roadmap' },
    summary: {
      id: 'Untuk perusahaan yang butuh rencana bertahap: setiap tahap punya keluaran, harga, dan ukuran keberhasilan sendiri.',
      en: 'For companies that need a staged plan: every phase carries its own deliverable, price, and measure of success.',
    },
    deliverable: {
      id: 'Roadmap 12 bulan dengan harga per tahap dan ukuran keberhasilan per tahap.',
      en: 'A 12-month roadmap priced per phase, with a success measure for each phase.',
    },
    duration: { id: '3 minggu', en: '3 weeks' },
    price: 15_000_000,
    bestFor: {
      id: 'Direktur yang perlu membawa keputusan ini ke rapat direksi.',
      en: 'A director who has to take this decision to the board.',
    },
    includes: {
      id: [
        'Validasi temuan audit',
        'Prioritas per kuartal',
        'Harga dan cakupan per tahap',
        'Ukuran keberhasilan per tahap',
        'Dokumen siap dibawa ke rapat direksi',
        'Sesi tanya jawab dengan pimpinan',
      ],
      en: [
        'Validation of the audit findings',
        'Priorities by quarter',
        'Price and scope per phase',
        'A success measure per phase',
        'A document ready for a board meeting',
        'A question and answer session with leadership',
      ],
    },
    nextStep: { key: 'contact', label: { id: 'Bicarakan roadmap', en: 'Talk through the roadmap' } },
  },
];

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
