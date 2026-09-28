/** Fictional presentation fixtures. Never use these as a production catalogue. */
export type Course = {
  id: string; title: string; shortTitle: string; cardTitle: string; cardMeta: string; description: string;
  topic: "Asas saham" | "Analisis teknikal" | "Portfolio";
  level: "Asas" | "Pertengahan"; format: "Online" | "Fizikal";
  date: string; location: string; duration: string; price: number;
  cover: "sand" | "blue" | "sage" | "plum"; number: string;
  outcomes: string[];
};

export const previewCourses: Course[] = [
  { id: "asas", title: "Langkah pertama dalam pelaburan saham", shortTitle: "Mula dengan asas.", cardTitle: "Asas saham", cardMeta: "Asas · 3 jam",
    description: "Fahami pasaran, risiko dan cara membina asas sebelum membuat keputusan.",
    topic: "Asas saham", level: "Asas", format: "Online", date: "17 Oktober 2026", location: "Kelas langsung online", duration: "3 jam", price: 199, cover: "sand", number: "01",
    outcomes: ["Kenali cara pasaran saham berfungsi", "Fahami risiko dan matlamat pelaburan", "Bina senarai semak keputusan anda"] },
  { id: "carta", title: "Baca carta dengan lebih yakin", shortTitle: "Lihat corak. Faham konteks.", cardTitle: "Baca carta", cardMeta: "Teknikal · 1 hari",
    description: "Terokai asas carta, trend dan disiplin analisis melalui latihan bersama.",
    topic: "Analisis teknikal", level: "Pertengahan", format: "Fizikal", date: "24 Oktober 2026", location: "Kuala Lumpur · Lokasi akan diumumkan", duration: "1 hari", price: 349, cover: "blue", number: "02",
    outcomes: ["Kenal pasti trend dan konteks carta", "Susun proses analisis yang konsisten", "Bincangkan kajian kes bersama kelas"] },
  { id: "portfolio", title: "Bina portfolio dengan tujuan", shortTitle: "Setiap pilihan, ada tujuan.", cardTitle: "Bina portfolio", cardMeta: "Portfolio · 4 jam",
    description: "Padankan pendekatan portfolio dengan matlamat dan toleransi risiko anda.",
    topic: "Portfolio", level: "Pertengahan", format: "Online", date: "31 Oktober 2026", location: "Kelas langsung online", duration: "4 jam", price: 249, cover: "sage", number: "03",
    outcomes: ["Tentukan matlamat dan horizon pelaburan", "Fahami kepelbagaian dan risiko", "Susun rutin semakan portfolio"] },
  { id: "bengkel", title: "Bengkel asas saham bersama AAA", shortTitle: "Belajar. Tanya. Praktik.", cardTitle: "Bengkel saham", cardMeta: "Asas · 1 hari",
    description: "Mulakan dari awal dengan sesi bersemuka, latihan dan ruang untuk bertanya.",
    topic: "Asas saham", level: "Asas", format: "Fizikal", date: "7 November 2026", location: "Shah Alam · Lokasi akan diumumkan", duration: "1 hari", price: 299, cover: "plum", number: "04",
    outcomes: ["Bina pemahaman asas pasaran", "Buat latihan senarai semak", "Bawa soalan anda ke sesi bersama"] },
];

export const topics = ["Semua topik", "Asas saham", "Analisis teknikal", "Portfolio"] as const;
export const formats = ["Semua format", "Online", "Fizikal"] as const;
export const money = (amount: number) => `RM${amount.toLocaleString("en-MY")}`;
