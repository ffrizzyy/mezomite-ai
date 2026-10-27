import type { LegalDocs } from './types';

/**
 * Draft legal copy. `draft: true` renders a visible review notice on every
 * legal page, so this cannot be mistaken for reviewed text if it ships early.
 * A lawyer must review all three documents before the notice is removed.
 */
export const legalId: LegalDocs = {
  draft: true,
  draftNote:
    'Draf untuk peninjauan hukum. Teks ini belum diperiksa penasihat hukum dan belum berlaku sebagai dokumen final.',
  privacy: {
    title: 'Kebijakan privasi',
    updated: '24 Oktober 2026',
    intro:
      'Mezomite.ai adalah praktik konsultasi yang berbasis di Jakarta. Kebijakan ini menjelaskan data apa yang dikumpulkan situs mezomite.ai, mengapa data itu dikumpulkan, berapa lama disimpan, dan bagaimana Anda bisa meminta penghapusannya.',
    sections: [
      {
        heading: 'Siapa yang mengendalikan data',
        paragraphs: [
          'Pengendali data adalah Mezomite.ai, Jakarta, Indonesia. Pertanyaan tentang kebijakan ini dapat dikirim ke halo@mezomite.ai. Kami membalas dalam 1 hari kerja.',
        ],
      },
      {
        heading: 'Data yang kami kumpulkan',
        paragraphs: [
          'Kami mengumpulkan dua kelompok data: data yang Anda kirim sendiri lewat formulir, dan data teknis minimum yang dibutuhkan untuk menjalankan situs.',
        ],
        list: [
          'Formulir kontak: nama, alamat email, nama perusahaan, jumlah karyawan, dan isi pesan.',
          'Formulir jadwal: nama, alamat email, nama perusahaan, waktu pilihan, dan catatan tambahan.',
          'Catatan persetujuan: kategori yang Anda pilih, versi kebijakan, waktu, dan alamat IP yang dipotong.',
          'Pemeriksaan bot: token Turnstile dan alamat IP, diproses oleh Cloudflare untuk memastikan formulir dikirim manusia.',
          'Catatan server: waktu permintaan, alamat IP, dan kode status, disimpan oleh Cloudflare selama 90 hari.',
        ],
      },
      {
        heading: 'Mengapa data diproses',
        paragraphs: [
          'Kami memproses data formulir karena Anda memintanya, yaitu untuk membalas pesan atau mengonfirmasi jadwal. Dasar pemrosesannya adalah persetujuan Anda dan, setelah pekerjaan disepakati, pelaksanaan kontrak.',
          'Kami tidak memakai data Anda untuk iklan, tidak menjualnya, dan tidak mengirimkan buletin tanpa pendaftaran terpisah.',
        ],
      },
      {
        heading: 'Siapa yang menerima data',
        paragraphs: [
          'Data hanya diterima oleh pihak yang diperlukan untuk menjalankan situs:',
        ],
        list: [
          'Cloudflare, untuk hosting, basis data, dan pemeriksaan bot. Data dapat diproses di luar Indonesia.',
          'Resend, untuk mengirim email pemberitahuan ke kotak masuk kami.',
          'Penyedia domain, untuk pencatatan domain.',
        ],
      },
      {
        heading: 'Berapa lama disimpan',
        paragraphs: [
          'Pesan formulir dan data jadwal disimpan 12 bulan, lalu dihapus. Catatan persetujuan disimpan 24 bulan karena kami perlu membuktikan dasar pemrosesan. Catatan server dihapus otomatis setelah 90 hari. Data yang sudah masuk ke email kami mengikuti kebijakan retensi email internal.',
        ],
      },
      {
        heading: 'Hak Anda',
        paragraphs: [
          'Anda berhak meminta salinan data Anda, meminta perbaikan, meminta penghapusan, menarik persetujuan, dan mengajukan keberatan atas pemrosesan. Kirim permintaan ke halo@mezomite.ai dengan subjek "Permintaan data". Kami menjawab dalam 14 hari kalender.',
          'Kalau jawaban kami tidak memuaskan, Anda dapat mengajukan pengaduan kepada otoritas perlindungan data Indonesia.',
        ],
      },
      {
        heading: 'Keamanan',
        paragraphs: [
          'Situs memakai HTTPS dengan HSTS, kata sandi dan kunci API disimpan sebagai variabel lingkungan, dan akses basis data dibatasi pada fungsi server yang membutuhkannya. Kami tidak menuliskan data pribadi ke log aplikasi.',
        ],
      },
      {
        heading: 'Anak-anak',
        paragraphs: [
          'Situs ini ditujukan untuk pemilik dan pengelola bisnis. Kami tidak dengan sengaja mengumpulkan data dari orang di bawah 18 tahun.',
        ],
      },
      {
        heading: 'Perubahan',
        paragraphs: [
          'Kalau kebijakan ini berubah, tanggal di bagian atas halaman ikut berubah, dan perubahan yang memengaruhi dasar pemrosesan akan diberitahukan lewat banner di situs.',
        ],
      },
    ],
  },

  terms: {
    title: 'Syarat dan ketentuan',
    updated: '24 Oktober 2026',
    intro:
      'Syarat ini mengatur penggunaan situs mezomite.ai dan dasar kerja sama untuk paket yang dijual di situs ini. Dengan mengirim formulir atau menyetujui paket, Anda menyatakan telah membaca syarat ini.',
    sections: [
      {
        heading: 'Lingkup situs',
        paragraphs: [
          'Situs ini adalah halaman informasi. Tidak ada akun, tidak ada portal klien, dan tidak ada pembayaran yang diproses di situs. Pengiriman formulir bukan perjanjian kerja; perjanjian lahir dari dokumen penawaran yang ditandatangani kedua pihak.',
        ],
      },
      {
        heading: 'Paket dan harga',
        paragraphs: [
          'Harga yang tertera adalah harga dalam rupiah dan belum termasuk PPN. Harga berlaku untuk cakupan yang tertulis di halaman paket. Perubahan lingkup di luar cakupan tersebut memerlukan penawaran baru yang disetujui sebelum pekerjaan tambahan dimulai.',
          'Perkiraan dalam dolar Amerika hanya alat bantu dan tidak mengikat. Invoice selalu diterbitkan dalam rupiah.',
        ],
      },
      {
        heading: 'Pembayaran',
        paragraphs: [
          'Pembayaran dibagi dua: 50% saat paket disetujui dan 50% saat laporan diserahkan. Pembayaran dilakukan lewat transfer bank atau QRIS ke rekening yang tercantum di invoice. Pekerjaan dimulai setelah pembayaran pertama diterima.',
        ],
      },
      {
        heading: 'Kewajiban klien',
        paragraphs: [
          'Klien menyediakan akses ke orang kunci, data yang diminta, dan waktu untuk sesi yang dijadwalkan. Keterlambatan pemberian akses dapat menggeser tanggal selesai, dan pergeseran itu akan diberitahukan tertulis.',
        ],
      },
      {
        heading: 'Kerahasiaan dan kekayaan intelektual',
        paragraphs: [
          'Kami menjaga kerahasiaan informasi klien dan menandatangani NDA bila diminta. Laporan audit menjadi milik klien setelah pembayaran penuh. Metode, templat, dan alat internal kami tetap milik Mezomite.ai dan tidak dialihkan.',
        ],
      },
      {
        heading: 'Batas tanggung jawab',
        paragraphs: [
          'Laporan audit berisi rekomendasi, bukan jaminan hasil finansial. Keputusan bisnis tetap milik klien. Tanggung jawab kami atas klaim yang timbul dari satu paket dibatasi pada nilai paket tersebut, sejauh diizinkan hukum yang berlaku.',
        ],
      },
      {
        heading: 'Pembatalan dan penghentian',
        paragraphs: [
          'Klien dapat menghentikan pekerjaan dengan pemberitahuan tertulis 7 hari. Pembayaran untuk pekerjaan yang sudah dilakukan tetap menjadi kewajiban. Kami dapat menghentikan pekerjaan bila ada konflik kepentingan atau permintaan yang melanggar hukum.',
        ],
      },
      {
        heading: 'Hukum yang berlaku',
        paragraphs: [
          'Syarat ini tunduk pada hukum Republik Indonesia. Sengketa diselesaikan lebih dulu secara musyawarah, dan bila tidak selesai, melalui pengadilan yang berwenang di Jakarta.',
        ],
      },
    ],
  },

  cookies: {
    title: 'Kebijakan cookie',
    updated: '24 Oktober 2026',
    intro:
      'Situs ini memakai penyimpanan lokal seminimal mungkin. Tidak ada cookie iklan, tidak ada pelacak lintas situs, dan analitik berjalan tanpa cookie.',
    sections: [
      {
        heading: 'Kategori wajib',
        paragraphs: ['Penyimpanan ini dibutuhkan agar situs berfungsi dan agar pilihan Anda diingat. Kategori ini tidak dapat dimatikan.'],
        list: [
          'mz-lang, penyimpanan lokal, 12 bulan: mengingat pilihan bahasa Anda.',
          'mz-theme, penyimpanan lokal, 12 bulan: mengingat pilihan tema terang atau gelap.',
          'mz-consent, penyimpanan lokal, 24 bulan: menyimpan kategori yang Anda setujui, versi kebijakan, dan waktu persetujuan.',
          'cf_clearance, cookie, 30 menit: dipasang Cloudflare saat pemeriksaan bot aktif di halaman formulir.',
        ],
      },
      {
        heading: 'Kategori analitik',
        paragraphs: [
          'Kalau Anda menyetujui kategori ini, situs memuat Cloudflare Web Analytics. Layanan itu tidak memasang cookie, tidak membuat profil, dan hanya mencatat jalur halaman, perujuk, agen pengguna, dan perkiraan wilayah. Kalau Anda menolak, skrip itu tidak dimuat sama sekali.',
        ],
      },
      {
        heading: 'Yang tidak kami pakai',
        paragraphs: [
          'Tidak ada Google Analytics, tidak ada piksel iklan, tidak ada peta panas sesi, tidak ada widget obrolan pihak ketiga, dan tidak ada font dari CDN pihak ketiga.',
        ],
      },
      {
        heading: 'Mengubah pilihan',
        paragraphs: [
          'Buka "Pengaturan cookie" di footer setiap halaman. Pilihan baru berlaku segera setelah disimpan. Menghapus penyimpanan peramban akan mengembalikan situs ke keadaan belum memilih, dan banner akan muncul lagi.',
        ],
      },
    ],
  },
};
