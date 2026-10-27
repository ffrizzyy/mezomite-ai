/**
 * Server-side messages. The visitor reads these in the language they were
 * using, and every message says what happened and how to fix it (PRD §8).
 */

export type Locale = 'id' | 'en';

export const MESSAGES = {
  id: {
    name: 'Nama perlu diisi, minimal 2 karakter.',
    email: 'Format email belum benar. Periksa kembali alamat email Anda.',
    message: 'Ceritakan sedikit lebih banyak, minimal 20 karakter.',
    company: 'Nama perusahaan terlalu panjang. Cukup 120 karakter.',
    consent: 'Kami perlu persetujuan Anda sebelum memproses data.',
    slot: 'Pilih tanggal dan waktu dulu.',
    slotTaken: 'Jadwal ini baru saja diambil. Pilih waktu lain.',
    slotInvalid: 'Jadwal ini tidak termasuk jam yang tersedia.',
    turnstile: 'Verifikasi bot gagal. Muat ulang halaman ini, lalu coba lagi.',
    rate: 'Terlalu banyak percobaan dari jaringan ini. Coba lagi dalam satu menit.',
    server: 'Ada gangguan di sisi kami. Coba lagi sebentar lagi, atau kirim email langsung.',
    config: 'Formulir ini belum dikonfigurasi. Hubungi kami lewat email.',
    notFound: 'Tautan pembatalan ini tidak dikenali.',
    cancelled: 'Jadwal ini sudah dibatalkan sebelumnya.',
    badToken: 'Tautan pembatalan tidak berlaku. Balas email konfirmasi Anda untuk mengubah jadwal.',
  },
  en: {
    name: 'Please enter a name of at least 2 characters.',
    email: 'That email address is not valid. Check it and try again.',
    message: 'Tell us a little more, at least 20 characters.',
    company: 'The company name is too long. Keep it under 120 characters.',
    consent: 'We need your consent before we can process the data.',
    slot: 'Choose a date and time first.',
    slotTaken: 'That slot was just taken. Choose another time.',
    slotInvalid: 'That time is not one of the available slots.',
    turnstile: 'Bot verification failed. Reload the page and try again.',
    rate: 'Too many requests from this network. Try again in a minute.',
    server: 'Something failed on our side. Try again shortly, or email us directly.',
    config: 'This form is not configured yet. Reach us by email instead.',
    notFound: 'That cancellation link is not recognised.',
    cancelled: 'This booking was already cancelled.',
    badToken: 'That cancellation link is not valid. Reply to your confirmation email to change the time.',
  },
} as const;

export type MessageKey = keyof (typeof MESSAGES)['id'];

export function message(locale: Locale, key: MessageKey): string {
  return MESSAGES[locale][key];
}

export function asLocale(value: unknown): Locale {
  return value === 'en' ? 'en' : 'id';
}
