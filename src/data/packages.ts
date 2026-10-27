import type { Localized } from '../lib/i18n';

export type Package = {
  id: string;
  order: number;
  name: Localized<string>;
  price: number;
  duration: Localized<string>;
  summary: Localized<string>;
  includes: Localized<string[]>;
  excludes: Localized<string[]>;
  cta: Localized<string>;
  /** The entry package is marked for the buyer who is not ready to commit. */
  entry?: boolean;
  badge?: Localized<string>;
};

export const PACKAGES: Package[] = [
  {
    id: 'awal',
    order: 1,
    name: { id: 'Paket Awal', en: 'Entry package' },
    price: 1_500_000,
    duration: { id: '2 minggu', en: '2 weeks' },
    summary: {
      id: 'Audit satu area proses dengan laporan dan presentasi. Paket terkecil yang kami jual, dan titik mulai yang kami sarankan.',
      en: 'An audit of one process area with a written report and a presentation. The smallest engagement we sell, and the one we recommend starting with.',
    },
    includes: {
      id: [
        'Satu area proses, misalnya pembelian, penjualan, atau stok',
        'Peta alur kerja saat ini',
        'Jam dan biaya per proses',
        'Daftar peluang berskor',
        'Laporan dan sesi presentasi 60 menit',
      ],
      en: [
        'One process area, such as purchasing, sales, or stock',
        'The current-state workflow map',
        'Hours and cost per process',
        'A scored opportunity list',
        'The report and a 60-minute findings session',
      ],
    },
    excludes: {
      id: ['Implementasi otomasi', 'Perangkat lunak khusus', 'Pendampingan setelah presentasi'],
      en: ['Automation implementation', 'Custom software', 'Support after the presentation'],
    },
    cta: { id: 'Pilih paket awal', en: 'Start with the entry package' },
    entry: true,
    badge: { id: 'Titik mulai', en: 'Start here' },
  },
  {
    id: 'bangun',
    order: 2,
    name: { id: 'Paket Bangun', en: 'Build package' },
    price: 6_000_000,
    duration: { id: '4–6 minggu', en: '4–6 weeks' },
    summary: {
      id: 'Audit ditambah satu otomasi yang berjalan di produksi, dengan dokumentasi dan pelatihan. Untuk tim yang sudah tahu apa yang ingin diperbaiki.',
      en: 'The audit plus one automation running in production, with documentation and training. For a team that already knows what it wants fixed.',
    },
    includes: {
      id: [
        'Semua isi Paket Awal',
        'Desain alur kerja yang dituju',
        'Satu otomasi prioritas di produksi',
        'Integrasi dengan alat yang sudah dipakai',
        'Dokumentasi dan dua sesi pelatihan',
        'Pendampingan 30 hari',
      ],
      en: [
        'Everything in the entry package',
        'The target-state workflow design',
        'One priority automation in production',
        'Integration with your existing tools',
        'Documentation and two training sessions',
        '30 days of support',
      ],
    },
    excludes: {
      id: ['Lebih dari satu otomasi', 'Lisensi perangkat lunak pihak ketiga', 'Dukungan di luar 30 hari'],
      en: ['More than one automation', 'Third-party software licences', 'Support beyond 30 days'],
    },
    cta: { id: 'Pilih paket bangun', en: 'Choose the build package' },
  },
  {
    id: 'roadmap',
    order: 3,
    name: { id: 'Paket Roadmap', en: 'Roadmap package' },
    price: 15_000_000,
    duration: { id: '3 minggu', en: '3 weeks' },
    summary: {
      id: 'Rencana 12 bulan bertahap, diberi harga per tahap, dengan ukuran keberhasilan yang bisa dibawa ke rapat direksi.',
      en: 'A staged 12-month plan, priced phase by phase, with success measures you can put in front of a board.',
    },
    includes: {
      id: [
        'Semua isi Paket Awal',
        'Roadmap 12 bulan per kuartal',
        'Harga dan cakupan per tahap',
        'Ukuran keberhasilan per tahap',
        'Dokumen siap rapat direksi',
        'Sesi tanya jawab dengan pimpinan',
      ],
      en: [
        'Everything in the entry package',
        'A 12-month roadmap by quarter',
        'Price and scope per phase',
        'A success measure per phase',
        'A board-ready document',
        'A Q&A session with leadership',
      ],
    },
    excludes: {
      id: ['Pelaksanaan tahap di dalam roadmap', 'Pendampingan bulanan', 'Perekrutan atau pelatihan staf baru'],
      en: ['Delivering the roadmap phases', 'Monthly retainers', 'Hiring or training new staff'],
    },
    cta: { id: 'Pilih paket roadmap', en: 'Choose the roadmap package' },
  },
];

export function packageById(id: string): Package | undefined {
  return PACKAGES.find((p) => p.id === id);
}
