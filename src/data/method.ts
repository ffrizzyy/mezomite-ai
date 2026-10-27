import type { Localized } from '../lib/i18n';

export type MethodStep = {
  id: string;
  number: string;
  title: Localized<string>;
  summary: Localized<string>;
  consultant: Localized<string[]>;
  client: Localized<string[]>;
  output: Localized<string[]>;
  /** Diagram key handled by MethodDiagram.astro. */
  diagram: 'intake' | 'map' | 'measure' | 'score' | 'report';
};

export const METHOD_STEPS: MethodStep[] = [
  {
    id: 'intake',
    number: '01',
    title: { id: 'Penerimaan', en: 'Intake' },
    summary: {
      id: 'Percakapan awal untuk menentukan proses mana yang layak diperiksa dan data apa yang sudah tersedia.',
      en: 'A first conversation to decide which process is worth examining and what data already exists.',
    },
    consultant: {
      id: [
        'Mewawancarai pemilik proses dan menanyakan di mana pekerjaan tersendat.',
        'Meminta data dasar: jumlah transaksi, jumlah orang, dan jam kerja.',
        'Menulis lingkup audit sebelum pekerjaan dimulai.',
      ],
      en: [
        'Interview the process owner and ask where work gets stuck.',
        'Request the baseline numbers: transaction volume, headcount, working hours.',
        'Write the audit scope down before any work starts.',
      ],
    },
    client: {
      id: [
        'Akses ke 3–5 orang kunci selama dua minggu.',
        'Contoh dokumen: faktur, pesanan pembelian, atau rekap stok.',
        'Satu jam untuk rapat pembukaan.',
      ],
      en: [
        'Access to 3–5 key people for two weeks.',
        'Sample documents: invoices, purchase orders, or stock records.',
        'One hour for the opening meeting.',
      ],
    },
    output: {
      id: ['Lingkup audit tertulis', 'Jadwal wawancara', 'Daftar proses yang diperiksa'],
      en: ['A written audit scope', 'The interview schedule', 'The list of processes under review'],
    },
    diagram: 'intake',
  },
  {
    id: 'mapping',
    number: '02',
    title: { id: 'Pemetaan proses', en: 'Process mapping' },
    summary: {
      id: 'Menggambar alur kerja yang sebenarnya, termasuk langkah informal yang tidak ada di SOP mana pun.',
      en: 'Drawing the workflow as it really runs, including the informal steps that appear in no SOP.',
    },
    consultant: {
      id: [
        'Mengamati pekerjaan berjalan selama satu hari kerja.',
        'Mencatat langkah di WhatsApp, spreadsheet, dan buku catatan.',
        'Menggambar alur sebagai diagram dengan penanggung jawab dan titik serah terima.',
      ],
      en: [
        'Observe the work for one working day.',
        'Record the steps that live in WhatsApp, spreadsheets, and paper.',
        'Draw the flow with owners and handoff points marked.',
      ],
    },
    client: {
      id: [
        'Satu orang yang bisa menjelaskan pekerjaan harian.',
        'Izin mengamati tim di lokasi atau lewat panggilan video.',
        'Koreksi kalau peta yang kami gambar tidak sesuai kenyataan.',
      ],
      en: [
        'One person who can explain the daily work.',
        'Permission to observe the team on site or over a video call.',
        'Corrections when our map does not match reality.',
      ],
    },
    output: {
      id: ['Peta alur kerja saat ini', 'Daftar titik serah terima', 'Daftar langkah manual yang berulang'],
      en: ['The current-state workflow map', 'A list of handoff points', 'A list of repeated manual steps'],
    },
    diagram: 'map',
  },
  {
    id: 'measurement',
    number: '03',
    title: { id: 'Pengukuran', en: 'Measurement' },
    summary: {
      id: 'Menghitung waktu dan uang yang keluar di setiap langkah, bukan menebaknya.',
      en: 'Counting the time and money each step consumes instead of estimating it.',
    },
    consultant: {
      id: [
        'Mengukur durasi setiap langkah dan waktu tunggu di antaranya.',
        'Menghitung biaya tenaga kerja per proses.',
        'Mencatat tingkat kesalahan dan pengerjaan ulang.',
      ],
      en: [
        'Time each step and the waiting between them.',
        'Calculate labour cost per process.',
        'Record error rates and rework.',
      ],
    },
    client: {
      id: [
        'Data volume transaksi per bulan.',
        'Gaji rata-rata per peran, bukan per orang.',
        'Kalau data tidak ada, kami memakai estimasi dan menandainya di laporan.',
      ],
      en: [
        'Monthly transaction volumes.',
        'Average salary per role, not per person.',
        'Where data is missing we use estimates and mark them as estimates in the report.',
      ],
    },
    output: {
      id: ['Jam per proses per bulan', 'Rupiah per proses', 'Waktu tunggu dan tingkat pengerjaan ulang'],
      en: ['Hours per process per month', 'Rupiah per process', 'Waiting time and rework rate'],
    },
    diagram: 'measure',
  },
  {
    id: 'scoring',
    number: '04',
    title: { id: 'Skor peluang', en: 'Opportunity scoring' },
    summary: {
      id: 'Memberi peringkat pada setiap peluang dengan tiga bobot: jam yang kembali, biaya, dan risiko perubahan.',
      en: 'Ranking every opportunity on three weights: hours returned, cost, and risk of change.',
    },
    consultant: {
      id: [
        'Menilai setiap peluang dengan bobot yang sama untuk semua klien.',
        'Memisahkan yang bisa dikerjakan tim Anda sendiri dari yang butuh bantuan kami.',
        'Menandai peluang yang terlihat menarik tetapi berisiko tinggi.',
      ],
      en: [
        'Score every opportunity with the same weights for every client.',
        'Separate what your team can do alone from what needs us.',
        'Flag the opportunities that look attractive but carry high risk.',
      ],
    },
    client: {
      id: [
        'Konfirmasi prioritas bisnis kuartal ini.',
        'Batas hal yang tidak boleh berubah.',
        'Satu jam untuk membahas peringkat awal.',
      ],
      en: [
        'Confirm this quarter’s business priorities.',
        'Name what must not change.',
        'One hour to discuss the first ranking.',
      ],
    },
    output: {
      id: ['Daftar peluang berurutan', 'Estimasi jam kembali per peluang', 'Tingkat kesulitan dan risiko'],
      en: ['A ranked opportunity list', 'Estimated hours returned per opportunity', 'Difficulty and risk level'],
    },
    diagram: 'score',
  },
  {
    id: 'report',
    number: '05',
    title: { id: 'Laporan', en: 'Report' },
    summary: {
      id: 'Menyerahkan dokumen yang bisa dipakai untuk mengambil keputusan, bukan slide yang dibaca sekali.',
      en: 'Handing over a document you can decide with, not a deck that gets read once.',
    },
    consultant: {
      id: [
        'Menulis laporan dengan angka, asumsi, dan batasan yang jelas.',
        'Menyiapkan presentasi 60 menit untuk pemilik proses.',
        'Menandai langkah berikutnya dan siapa yang mengerjakannya.',
      ],
      en: [
        'Write the report with the numbers, assumptions, and limits stated.',
        'Prepare a 60-minute presentation for the process owner.',
        'Mark the next step and who owns it.',
      ],
    },
    client: {
      id: [
        'Satu jam untuk sesi presentasi.',
        'Tiga puluh menit untuk tanya jawab.',
        'Keputusan: lanjut, tunda, atau berhenti.',
      ],
      en: [
        'One hour for the findings session.',
        'Thirty minutes for questions.',
        'A decision: proceed, postpone, or stop.',
      ],
    },
    output: {
      id: ['Laporan audit', 'Peta proses final', 'Roadmap berharga', 'Presentasi hasil'],
      en: ['The audit report', 'The final process map', 'A priced roadmap', 'The findings presentation'],
    },
    diagram: 'report',
  },
];

/** What the report contains, stated on the method page (F-004). */
export const REPORT_CONTENTS = {
  id: [
    { title: 'Peta alur kerja', detail: 'Alur saat ini dengan penanggung jawab, alat, dan titik serah terima.' },
    { title: 'Waktu dan biaya per proses', detail: 'Jam dan rupiah yang keluar setiap bulan, termasuk waktu tunggu.' },
    { title: 'Daftar peluang berskor', detail: 'Setiap peluang diberi peringkat dengan jam kembali, biaya, dan risiko.' },
    { title: 'Roadmap berharga', detail: 'Urutan pengerjaan dengan harga dan ukuran keberhasilan per tahap.' },
  ],
  en: [
    { title: 'The workflow map', detail: 'The current flow with owners, tools, and handoff points.' },
    { title: 'Time and cost per process', detail: 'The hours and rupiah spent each month, including waiting time.' },
    { title: 'The scored opportunity list', detail: 'Every opportunity ranked by hours returned, cost, and risk.' },
    { title: 'A priced roadmap', detail: 'The order of work with a price and a success measure per phase.' },
  ],
} satisfies Localized<{ title: string; detail: string }[]>;
