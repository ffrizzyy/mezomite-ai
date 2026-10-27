import type { Copy } from './types';

/**
 * Indonesian is the default locale and the one written first. Copy rules:
 * plain, direct, specific. The firm is the actor. Numbers are numbers.
 * No sentence claims a result we cannot show.
 */
export const id = {
  site: {
    name: 'Mezomite.ai',
    tagline: 'Audit proses, pemetaan alur kerja, dan otomasi untuk bisnis Indonesia.',
    email: 'halo@mezomite.ai',
    whatsappDisplay: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    responseTime: 'Kami membalas dalam 1 hari kerja.',
    currencyNote: 'Harga dalam rupiah, belum termasuk PPN.',
    lastUpdated: 'Diperbarui 24 Oktober 2026',
  },

  nav: {
    skip: 'Lewati ke konten utama',
    mainNav: 'Navigasi utama',
    home: 'Beranda',
    services: 'Layanan',
    method: 'Metode audit',
    pricing: 'Harga',
    glossary: 'Glosarium',
    cases: 'Studi kasus',
    contact: 'Hubungi kami',
    book: 'Jadwalkan panggilan',
    menu: 'Buka menu',
    close: 'Tutup menu',
    themeLight: 'Ganti ke tema terang',
    themeDark: 'Ganti ke tema gelap',
    languageLabel: 'Bahasa',
    languageSwitch: 'Baca halaman ini dalam bahasa Inggris',
    currentLanguage: 'Bahasa Indonesia',
  },

  pages: {
    home: {
      title: 'Mezomite.ai — Audit proses dan otomasi untuk bisnis Indonesia',
      description:
        'Audit proses dua minggu, pemetaan alur kerja, dan otomasi untuk UMKM dan perusahaan Indonesia. Harga paket awal Rp 1.500.000 tertera sebelum Anda menghubungi kami.',
    },
    services: {
      title: 'Layanan — audit, pemetaan, dan roadmap | Mezomite.ai',
      description:
        'Tiga layanan dengan keluaran, durasi, dan harga yang tertera: audit proses Rp 1.500.000, pemetaan dan otomasi Rp 6.000.000, roadmap 12 bulan Rp 15.000.000.',
    },
    method: {
      title: 'Metode audit — lima langkah yang bisa Anda periksa | Mezomite.ai',
      description:
        'Lima langkah audit: penerimaan, pemetaan proses, pengukuran, skor peluang, dan laporan. Setiap langkah menyebut masukan, keluaran, dan waktunya.',
    },
    pricing: {
      title: 'Harga — tiga paket dengan harga tertera | Mezomite.ai',
      description:
        'Harga paket Mezomite.ai: Paket Awal Rp 1.500.000, Paket Bangun Rp 6.000.000, Paket Roadmap Rp 15.000.000. Cakupan dan pengecualian tertulis di setiap paket.',
    },
    contact: {
      title: 'Hubungi Mezomite.ai',
      description:
        'Ceritakan proses yang paling menyita waktu di bisnis Anda. Kami membalas dalam 1 hari kerja, dan panggilan pertama tidak dikenakan biaya.',
    },
    booking: {
      title: 'Jadwalkan panggilan 30 menit | Mezomite.ai',
      description:
        'Pilih waktu panggilan 30 menit tanpa biaya. Slot dibuka Senin sampai Jumat, 09.00–16.00 WIB, dan dikonfirmasi lewat email.',
    },
    glossary: {
      title: 'Glosarium — istilah audit dan otomasi | Mezomite.ai',
      description:
        'Sepuluh istilah yang kami pakai di laporan audit, dijelaskan dalam bahasa sehari-hari, masing-masing dengan padanan bahasa Inggris.',
    },
    cases: {
      title: 'Studi kasus | Mezomite.ai',
      description:
        'Studi kasus hanya diterbitkan dengan izin tertulis dari klien. Halaman ini kosong sampai izin pertama ada.',
    },
    privacy: {
      title: 'Kebijakan privasi | Mezomite.ai',
      description:
        'Data apa yang dikumpulkan situs ini, mengapa, berapa lama disimpan, dan bagaimana meminta penghapusannya.',
    },
    terms: {
      title: 'Syarat dan ketentuan | Mezomite.ai',
      description:
        'Lingkup pekerjaan, pembayaran, kerahasiaan, dan batas tanggung jawab untuk setiap paket Mezomite.ai.',
    },
    cookies: {
      title: 'Kebijakan cookie | Mezomite.ai',
      description:
        'Daftar setiap cookie dan kunci penyimpanan yang dipakai situs ini, beserta kategori dan masa berlakunya.',
    },
    notFound: {
      title: 'Halaman tidak ditemukan | Mezomite.ai',
      description: 'Alamat ini tidak ada. Berikut tautan ke halaman yang Anda cari.',
    },
  },

  common: {
    bookCall: 'Jadwalkan panggilan',
    freeDiagnostic: 'Sesi diagnostik 30 menit, tanpa biaya',
    freeDiagnosticShort: 'Diagnostik 30 menit, gratis',
    startingFrom: 'Mulai dari',
    entryPackage: 'Paket awal',
    duration: 'Durasi',
    deliverable: 'Keluaran',
    bestFor: 'Cocok untuk',
    includes: 'Termasuk',
    excludes: 'Tidak termasuk',
    nextStep: 'Langkah berikutnya',
    viewServices: 'Lihat semua layanan',
    viewPricing: 'Lihat harga',
    viewMethod: 'Lihat metode audit',
    viewAll: 'Lihat semua',
    back: 'Kembali',
    loading: 'Memuat',
    retry: 'Coba lagi',
    required: 'wajib',
    optional: 'opsional',
    updated: 'Terakhir diperbarui',
    minutes: 'menit',
    close: 'Tutup',
    priceVatNote: 'Belum termasuk PPN.',
    usdNote:
      'Perkiraan USD memakai kurs Rp 18.100 per dolar, diperiksa 24 Oktober 2026. Invoice selalu dalam rupiah.',
    or: 'atau',
  },

  home: {
    eyebrow: 'Audit proses · Otomasi · Agen AI',
    title: 'Kami audit cara kerja Anda, lalu otomatiskan bagian yang repetitif.',
    lead: 'Dua minggu, satu laporan: peta alur kerja, biaya per proses, dan daftar peluang yang sudah diberi skor.',
    priceLabel: 'Paket awal',
    priceNote: 'Satu area proses, laporan, dan sesi presentasi.',
    primaryCta: 'Jadwalkan panggilan 30 menit',
    secondaryCta: 'Lihat metode audit',
    specTitle: 'Ringkasan paket',
    specRows: [
      { key: 'Paket', value: 'Audit proses, 1 area' },
      { key: 'Durasi', value: '2 minggu' },
      { key: 'Keluaran', value: 'Laporan + presentasi' },
      { key: 'Diagnostik', value: '30 menit, tanpa biaya' },
    ],
    specNote: 'Slot panggilan dibuka Senin–Jumat, 09.00–16.00 WIB.',
    proofTitle: 'Rekam jejak singkat',
    proofNote: 'Angka diperbarui Oktober 2026. Rincian per industri kami bawakan saat panggilan.',
    proofEmpty:
      'Belum ada angka yang bisa kami publikasikan. Yang kami punya: metode yang bisa Anda periksa, dan harga yang tertera.',
    servicesEyebrow: 'Layanan',
    servicesTitle: 'Tiga cara kami bekerja sama',
    servicesLead:
      'Mulai dari audit. Naik ke implementasi hanya kalau temuannya layak dibangun, dan itu keputusan Anda, bukan kami.',
    servicesCta: 'Lihat semua layanan',
    whyEyebrow: 'Kenapa cara ini berbeda',
    whyTitle: 'Kami menjual metode, bukan janji',
    whyItems: [
      {
        index: '01',
        title: 'Harga tertera sebelum kontak',
        body: 'Paket awal punya harga dan cakupan yang bisa Anda baca sekarang. Tidak ada penawaran yang lahir setelah tiga panggilan.',
      },
      {
        index: '02',
        title: 'Metodenya adalah produknya',
        body: 'Setiap langkah audit punya masukan, keluaran, dan ukuran. Anda bisa membandingkan kami dengan firma lain tanpa perlu bertanya.',
      },
      {
        index: '03',
        title: 'Kami mulai dari proses, bukan perangkat',
        body: 'Otomasi yang dibeli sebelum prosesnya dipetakan berakhir tidak terpakai. Urutannya kami balik: peta dulu, perangkat kemudian.',
      },
    ],
    methodEyebrow: 'Metode',
    methodTitle: 'Audit yang bisa Anda periksa langkahnya',
    methodLead:
      'Lima langkah, masing-masing dengan masukan dan keluaran yang jelas. Tidak ada bagian yang disembunyikan di balik sesi konsultasi.',
    methodCta: 'Baca metode audit',
    ctaEyebrow: 'Langkah berikutnya',
    ctaTitle: 'Ceritakan proses yang paling menyita waktu Anda.',
    ctaLead:
      'Satu panggilan 30 menit, tanpa biaya. Kalau audit bukan langkah yang tepat untuk Anda sekarang, kami akan mengatakannya di panggilan itu.',
    ctaPrimary: 'Jadwalkan panggilan',
    ctaSecondary: 'Kirim pesan',
  },

  services: {
    eyebrow: 'Layanan',
    title: 'Tiga layanan, satu urutan',
    lead: 'Kami tidak menjual tiga hal sekaligus. Audit dulu, karena implementasi tanpa peta proses berakhir sebagai perangkat yang tidak dipakai.',
    orderNote: 'Diurutkan dari harga terendah ke tertinggi.',
    priceLabel: 'Harga mulai',
    ctaTitle: 'Belum yakin harus mulai dari mana?',
    ctaLead:
      'Mulai dari sesi diagnostik 30 menit. Kami akan menanyakan tiga hal: proses apa yang paling menyita waktu, siapa yang mengerjakannya, dan data apa yang sudah Anda punya.',
  },

  method: {
    eyebrow: 'Metode audit',
    title: 'Lima langkah, masing-masing dengan keluaran',
    lead: 'Ini bukan ringkasan pemasaran. Ini urutan kerja yang kami lakukan, termasuk hal yang harus Anda siapkan dan waktu yang dibutuhkan.',
    stepLabel: 'Langkah',
    consultantLabel: 'Yang kami lakukan',
    clientLabel: 'Yang Anda siapkan',
    outputLabel: 'Yang Anda terima',
    reportEyebrow: 'Isi laporan',
    reportTitle: 'Empat bagian, tidak lebih',
    reportLead: 'Setiap bagian menjawab satu pertanyaan yang biasa ditanyakan pemilik proses.',
    prepareTitle: 'Yang perlu Anda siapkan',
    prepareItems: [
      'Akses ke 3–5 orang kunci selama dua minggu, masing-masing sekitar dua jam.',
      'Data volume transaksi per bulan dan gaji rata-rata per peran, kalau tersedia.',
      'Satu jam untuk sesi pembukaan dan satu jam untuk presentasi hasil.',
    ],
    excludesTitle: 'Yang tidak termasuk',
    excludesBody:
      'Paket audit tidak termasuk implementasi otomasi, lisensi perangkat lunak, atau pendampingan setelah presentasi. Kalau temuannya layak dibangun, kami kirim penawaran terpisah dengan harga tertera.',
    ctaTitle: 'Sudah tahu proses mana yang ingin diperiksa?',
    ctaLead:
      'Bawa satu proses ke panggilan pertama. Dalam 30 menit kami bisa bilang apakah audit dua minggu masuk akal, atau ada langkah yang lebih murah lebih dulu.',
  },

  pricing: {
    eyebrow: 'Harga',
    title: 'Harga tertera, cakupan tertulis',
    lead: 'Tiga paket. Harga di halaman ini sama dengan harga di invoice. Tidak ada penawaran yang lahir setelah panggilan penjualan.',
    entryLabel: 'Titik mulai',
    chooseTitle: 'Cara memilih paket',
    chooseItems: [
      {
        title: 'Pilih Paket Awal kalau',
        body: 'Anda tahu ada proses yang mahal, tetapi belum tahu bagian mana. Paket ini menghasilkan diagnosis, bukan perangkat.',
      },
      {
        title: 'Pilih Paket Bangun kalau',
        body: 'Audit sudah selesai, satu perbaikan sudah dipilih, dan Anda butuh satu otomasi berjalan di produksi bulan ini.',
      },
      {
        title: 'Pilih Paket Roadmap kalau',
        body: 'Keputusan ini butuh persetujuan direksi, dan Anda perlu dokumen bertahap dengan harga per tahap.',
      },
    ],
    freeTitle: 'Belum siap membeli?',
    freeBody:
      'Ambil sesi diagnostik 30 menit tanpa biaya. Kami akan bilang terus terang kalau audit belum perlu, atau kalau ada vendor lain yang lebih cocok untuk masalah Anda.',
    freeCta: 'Jadwalkan sesi diagnostik',
    paymentTitle: 'Cara pembayaran',
    paymentBody:
      '50% saat paket disetujui, 50% saat laporan diserahkan. Transfer bank atau QRIS. Tidak ada pembayaran yang diambil di situs ini.',
    faqTitle: 'Pertanyaan yang sering muncul',
    faq: [
      {
        q: 'Apakah harga bisa berubah di tengah pekerjaan?',
        a: 'Harga tetap untuk cakupan yang tertulis di halaman ini. Kalau lingkupnya berubah, kami kirim penawaran baru sebelum pekerjaan tambahan dimulai. Tidak ada biaya kejutan di invoice.',
      },
      {
        q: 'Bagaimana kalau kami belum punya data yang rapi?',
        a: 'Itu kondisi normal. Kami memakai estimasi dari wawancara dan pengamatan, lalu menandai setiap angka estimasi di laporan supaya Anda tahu mana yang perlu diverifikasi.',
      },
      {
        q: 'Apakah bisa mulai dari diagnostik saja?',
        a: 'Bisa. Sesi 30 menit tidak dikenakan biaya, dan Anda tidak wajib melanjutkan ke paket mana pun.',
      },
      {
        q: 'Berapa lama sampai pekerjaan dimulai?',
        a: 'Biasanya 5–10 hari kerja setelah paket disetujui dan pembayaran pertama masuk. Kami memberi tanggal mulai tertulis sebelum Anda membayar.',
      },
      {
        q: 'Apakah Anda menandatangani NDA?',
        a: 'Ya, kalau dibutuhkan. Kami juga tidak mencantumkan nama klien di situs ini tanpa izin tertulis.',
      },
    ],
  },

  contact: {
    eyebrow: 'Hubungi kami',
    title: 'Ceritakan proses yang ingin Anda perbaiki',
    lead: 'Semakin spesifik, semakin cepat kami bisa memberi jawaban yang berguna. Kami membalas dalam 1 hari kerja.',
    formTitle: 'Formulir kontak',
    name: 'Nama lengkap',
    namePlaceholder: 'Nama Anda',
    email: 'Email kerja',
    emailPlaceholder: 'nama@perusahaan.co.id',
    company: 'Nama perusahaan',
    companyPlaceholder: 'PT Contoh Sejahtera',
    employees: 'Jumlah karyawan',
    employeesPlaceholder: 'Pilih jumlah karyawan',
    employeeOptions: ['1–10 orang', '11–50 orang', '51–200 orang', '201–500 orang', 'Lebih dari 500 orang'],
    message: 'Ceritakan masalahnya',
    messagePlaceholder:
      'Contoh: tim pembelian memakai tiga spreadsheet dan WhatsApp. Persetujuan pembelian bisa menunggu dua hari, dan stok sering berbeda dengan catatan.',
    consent: 'Saya setuju data saya diproses sesuai',
    consentLink: 'kebijakan privasi',
    submit: 'Kirim pesan',
    submitting: 'Mengirim pesan',
    asideTitle: 'Yang terjadi setelah ini',
    asideSteps: [
      { index: '01', title: 'Kami baca pesan Anda', body: 'Dalam 1 hari kerja, dari orang yang akan mengerjakan pekerjaannya, bukan tim penjualan.' },
      { index: '02', title: 'Panggilan 30 menit', body: 'Kalau relevan, kami tawarkan sesi diagnostik tanpa biaya untuk mempersempit masalahnya.' },
      { index: '03', title: 'Ringkasan tertulis', body: 'Setelah panggilan, Anda menerima ringkasan berisi langkah yang kami sarankan dan harganya.' },
    ],
    asideChannels: 'Atau hubungi langsung',
    asideEmailLabel: 'Email',
    asideWhatsappLabel: 'WhatsApp',
    asideResponse: 'Jam kerja Senin–Jumat, 09.00–17.00 WIB.',
    successTitle: 'Pesan Anda sudah terkirim.',
    successBody:
      'Kami membalas dalam 1 hari kerja ke alamat email yang Anda tulis. Kalau pesan ini mendesak, hubungi WhatsApp di bawah.',
    successRef: 'Nomor referensi',
    successNext: 'Sambil menunggu, Anda bisa membaca rincian harga atau langsung memilih waktu panggilan.',
    successPricing: 'Lihat harga',
    successBook: 'Jadwalkan panggilan',
    privacyNote: 'Data Anda hanya dipakai untuk membalas pesan ini, lalu dihapus setelah 12 bulan.',
    turnstileNote: 'Formulir ini dilindungi Turnstile. Tidak ada CAPTCHA yang perlu Anda pecahkan.',
  },

  booking: {
    eyebrow: 'Jadwalkan',
    title: 'Panggilan 30 menit, tanpa biaya',
    lead: 'Pilih waktu yang cocok. Kami mengirim undangan ke email Anda, dan Anda bisa membatalkannya dari tautan yang sama.',
    dayLabel: 'Pilih hari',
    timeLabel: 'Pilih waktu',
    detailsLabel: 'Data Anda',
    selectionLabel: 'Pilihan Anda',
    asideTitle: 'Rincian panggilan',
    hoursLabel: 'Jam tersedia',
    metaTimezone: 'Zona waktu',
    metaFee: 'Biaya',
    name: 'Nama lengkap',
    email: 'Email kerja',
    company: 'Nama perusahaan',
    notes: 'Catatan',
    notesPlaceholder: 'Zona waktu Anda, proses yang ingin dibahas, atau hal yang perlu kami siapkan.',
    submit: 'Konfirmasi jadwal',
    submitting: 'Menyimpan jadwal',
    loading: 'Memuat jadwal',
    empty: 'Belum ada jadwal dalam 14 hari ke depan. Hubungi kami untuk waktu khusus di luar jam ini.',
    holidayNote: 'Tanggal merah Indonesia tidak dibuka.',
    timezoneNote: 'Waktu ditampilkan dalam WIB (GMT+7). Tulis zona waktu Anda di catatan kalau berbeda.',
    successTitle: 'Jadwal Anda tercatat.',
    successBody:
      'Undangan sudah kami kirim ke email Anda. Kami akan mengirim pengingat satu hari sebelum panggilan, dan tautan untuk membatalkan ada di email itu.',
    successRef: 'Nomor referensi',
    successCancel: 'Butuh waktu lain? Batalkan lewat tautan di email, lalu pilih ulang.',
    stepOne: 'Pilih hari',
    stepTwo: 'Pilih waktu',
    stepThree: 'Isi data',
  },

  cancel: {
    title: 'Batalkan jadwal',
    lead: 'Konfirmasi dulu sebelum kami melepas slot ini. Setelah dibatalkan, waktunya terbuka untuk orang lain.',
    referenceLabel: 'Nomor referensi',
    slotLabel: 'Jadwal',
    confirm: 'Batalkan jadwal ini',
    confirming: 'Membatalkan',
    keep: 'Simpan jadwal saya',
    successTitle: 'Jadwal sudah dibatalkan.',
    successBody:
      'Slotnya sudah dilepas dan konfirmasi pembatalan dikirim ke email Anda. Kalau berubah pikiran, pilih waktu baru kapan saja.',
    missingTitle: 'Tautan ini tidak lengkap.',
    missingBody:
      'Buka tautan pembatalan langsung dari email konfirmasi Anda. Kalau emailnya hilang, balas dari alamat yang sama dan kami akan membantu.',
    errorTitle: 'Jadwal belum bisa dibatalkan.',
    errorBody:
      'Tautan mungkin sudah tidak berlaku, atau jadwal ini sudah dibatalkan sebelumnya. Muat ulang halaman, lalu coba lagi.',
    backToBooking: 'Pilih waktu lain',
    contact: 'Hubungi kami',
    noScript: 'Pembatalan memerlukan JavaScript. Balas email konfirmasi Anda dan kami yang membatalkan.',
  },

  glossary: {
    eyebrow: 'Glosarium',
    title: 'Istilah yang kami pakai, dijelaskan',
    lead: 'Setiap istilah di laporan audit punya satu definisi, ditulis dalam bahasa sehari-hari, dengan padanan bahasa Inggris.',
    search: 'Cari istilah',
    count: 'istilah',
    empty: 'Tidak ada istilah yang cocok. Coba kata lain.',
    enLabel: 'Inggris',
    idLabel: 'Indonesia',
  },

  cases: {
    eyebrow: 'Studi kasus',
    title: 'Bukti, kalau sudah ada izinnya',
    lead: 'Kami hanya menerbitkan studi kasus dengan izin tertulis dari klien. Sampai izin pertama ada, halaman ini kosong dengan sengaja.',
    emptyTitle: 'Belum ada studi kasus yang diterbitkan',
    emptyBody:
      'Kami memilih tidak mengisi halaman ini dengan contoh yang tidak nyata. Kalau Anda ingin melihat pekerjaan kami, kami bisa membahasnya di panggilan dengan batas kerahasiaan yang disepakati lebih dulu.',
    cta: 'Bahas di panggilan',
  },

  notFound: {
    code: '404',
    title: 'Halaman ini tidak ada',
    body: 'Alamatnya mungkin salah ketik, atau halamannya sudah dipindahkan. Ini halaman yang biasanya dicari orang:',
    linksTitle: 'Halaman yang tersedia',
  },

  footer: {
    tagline: 'Audit proses, pemetaan alur kerja, dan otomasi. Harga tertera, metode terbuka.',
    servicesTitle: 'Layanan',
    companyTitle: 'Perusahaan',
    legalTitle: 'Legal',
    contactTitle: 'Kontak',
    consentSettings: 'Pengaturan cookie',
    whatsapp: 'WhatsApp',
    rights: 'Seluruh hak dilindungi.',
    built: 'Dibangun dengan Astro, di-host di Cloudflare.',
    locationLabel: 'Lokasi',
  },

  consent: {
    title: 'Cookie dan pengukuran',
    body: 'Kami memakai penyimpanan yang benar-benar diperlukan untuk mengingat pilihan bahasa dan tema. Analitik hanya aktif kalau Anda setuju.',
    acceptAll: 'Terima semua',
    rejectOptional: 'Tolak opsional',
    customise: 'Atur pilihan',
    save: 'Simpan pilihan',
    necessaryTitle: 'Wajib',
    necessaryBody: 'Menyimpan pilihan bahasa, tema, dan jawaban cookie ini. Tidak bisa dimatikan.',
    analyticsTitle: 'Analitik',
    analyticsBody: 'Menghitung kunjungan halaman tanpa cookie dan tanpa data pribadi.',
    policyLink: 'Baca kebijakan cookie',
    saved: 'Pilihan Anda tersimpan.',
    error: 'Pilihan Anda belum tersimpan. Coba lagi.',
    preferencesTitle: 'Pengaturan cookie',
    close: 'Tutup',
  },

  errors: {
    nameRequired: 'Nama belum diisi. Kami perlu tahu harus memanggil siapa.',
    emailRequired: 'Email belum diisi. Tanpa email, kami tidak bisa membalas.',
    emailInvalid: 'Format email belum benar. Periksa kembali alamat email Anda.',
    messageShort: 'Ceritakan sedikit lebih banyak, minimal 20 karakter, supaya kami bisa menjawab dengan tepat.',
    consentRequired: 'Centang persetujuan supaya kami boleh memproses data Anda.',
    submitFailed: 'Pesan Anda belum terkirim. Coba lagi dalam beberapa saat.',
    rateLimited: 'Terlalu banyak percobaan dari jaringan ini. Coba lagi dalam satu menit.',
    slotRequired: 'Pilih tanggal dan waktu dulu.',
    slotTaken: 'Jadwal ini baru saja diambil. Pilih waktu lain.',
    bookingFailed: 'Jadwal Anda belum tersimpan. Coba lagi, atau kirim pesan lewat halaman hubungi.',
    network: 'Koneksi terputus. Periksa jaringan Anda, lalu coba lagi.',
    summary: 'Ada isian yang perlu diperbaiki.',
  },

  a11y: {
    external: 'Tautan eksternal',
    requiredMark: 'wajib diisi',
    copied: 'Disalin',
  },
} satisfies Copy;
