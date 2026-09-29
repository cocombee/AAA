/** Fictional presentation fixtures. Never use these as a production catalogue. */
export type CourseSegment = {
  title: string;
  description: string;
  duration?: string;
  preview?: boolean;
};

export const coursePreviewDemo: CourseSegment = {
  title: "Demonstrasi pemain AAA",
  description: "Cuba pemain video dan kawalan pratonton. Klip demonstrasi ini bukan rakaman pengajaran kelas.",
  duration: "0:05",
  preview: true,
};

export type Course = {
  id: string; title: string; shortTitle: string; cardTitle: string; description: string;
  topic: "Asas saham" | "Analisis teknikal" | "Portfolio";
  level: "Asas" | "Pertengahan"; format: "Rakaman";
  duration: string; price: number;
  cover: "sand" | "blue" | "sage" | "plum"; number: string;
  outcomes: string[];
  sections: { title: string; duration?: string; segments: CourseSegment[] }[];
};

export const previewCourses: Course[] = [
  { id: "asas", title: "Langkah pertama dalam pelaburan saham", shortTitle: "Mula dengan asas.", cardTitle: "Asas saham",
    description: "Fahami pasaran, risiko dan cara membina asas sebelum membuat keputusan.",
    topic: "Asas saham", level: "Asas", format: "Rakaman", duration: "3 jam", price: 199, cover: "sand", number: "01",
    outcomes: ["Kenali cara pasaran saham berfungsi", "Fahami risiko dan matlamat pelaburan", "Bina senarai semak keputusan anda"],
    sections: [
      { title: "Kenali pasaran saham", segments: [{ title: "Bagaimana pasaran berfungsi", description: "Kenali hubungan antara syarikat, pelabur dan pasaran saham." }, { title: "Istilah asas dan peserta pasaran", description: "Fahami istilah yang digunakan serta peranan peserta pasaran." }] },
      { title: "Risiko dan matlamat", segments: [{ title: "Memahami risiko", description: "Bincangkan jenis risiko dan kesannya pada keputusan pelaburan." }, { title: "Menetapkan matlamat pelaburan", description: "Susun matlamat mengikut keperluan dan tempoh pelaburan." }] },
      { title: "Keputusan awal", segments: [{ title: "Menyusun senarai semak", description: "Bina panduan ringkas untuk menyemak keputusan sebelum bertindak." }, { title: "Langkah sebelum membuat keputusan", description: "Gabungkan maklumat, matlamat dan pertimbangan risiko dalam satu proses." }] },
    ] },
  { id: "carta", title: "Baca carta dengan lebih yakin", shortTitle: "Lihat corak. Faham konteks.", cardTitle: "Baca carta",
    description: "Terokai asas carta, trend dan disiplin analisis melalui rakaman dan latihan berpandu.",
    topic: "Analisis teknikal", level: "Pertengahan", format: "Rakaman", duration: "Tempoh belum tersedia", price: 349, cover: "blue", number: "02",
    outcomes: ["Kenal pasti trend dan konteks carta", "Susun proses analisis yang konsisten", "Semak kajian kes melalui latihan berpandu"],
    sections: [
      { title: "Asas membaca carta", segments: [{ title: "Struktur carta dan pergerakan harga", description: "Kenali komponen carta dan cara membaca perubahan harga." }, { title: "Trend dalam konteks pasaran", description: "Lihat trend bersama konteks pasaran dan tempoh pemerhatian." }] },
      { title: "Proses analisis", segments: [{ title: "Langkah analisis yang konsisten", description: "Susun urutan pemerhatian untuk membantu analisis yang berdisiplin." }, { title: "Risiko dan had tafsiran carta", description: "Bincangkan batas analisis carta dan andaian yang perlu disemak." }] },
      { title: "Latihan bersama", segments: [{ title: "Kajian kes carta", description: "Gunakan contoh carta untuk membincangkan pemerhatian dan konteks." }, { title: "Perbincangan keputusan dan disiplin", description: "Semak proses membuat keputusan dan tabiat analisis bersama kelas." }] },
    ] },
  { id: "portfolio", title: "Bina portfolio dengan tujuan", shortTitle: "Setiap pilihan, ada tujuan.", cardTitle: "Bina portfolio",
    description: "Padankan pendekatan portfolio dengan matlamat dan toleransi risiko anda.",
    topic: "Portfolio", level: "Pertengahan", format: "Rakaman", duration: "4 jam", price: 249, cover: "sage", number: "03",
    outcomes: ["Tentukan matlamat dan horizon pelaburan", "Fahami kepelbagaian dan risiko", "Susun rutin semakan portfolio"],
    sections: [
      { title: "Matlamat portfolio", segments: [{ title: "Matlamat dan horizon pelaburan", description: "Hubungkan tujuan portfolio dengan jangka masa dan keperluan anda." }, { title: "Menilai keutamaan peribadi", description: "Kenal pasti keutamaan yang mempengaruhi pendekatan portfolio." }] },
      { title: "Kepelbagaian dan risiko", segments: [{ title: "Peranan kepelbagaian", description: "Bincangkan fungsi kepelbagaian dan hadnya dalam mengurus risiko." }, { title: "Padankan risiko dengan matlamat", description: "Semak hubungan antara toleransi risiko, matlamat dan pilihan portfolio." }] },
      { title: "Semakan portfolio", segments: [{ title: "Apa yang perlu disemak", description: "Kenali perkara yang diperhatikan semasa menyemak portfolio." }, { title: "Membina rutin semakan", description: "Susun jadual dan senarai semak untuk semakan yang konsisten." }] },
    ] },
  { id: "bengkel", title: "Bengkel asas saham bersama AAA", shortTitle: "Belajar. Tanya. Praktik.", cardTitle: "Bengkel saham",
    description: "Mulakan dari awal dengan rakaman penerangan, latihan dan contoh aplikasi.",
    topic: "Asas saham", level: "Asas", format: "Rakaman", duration: "Tempoh belum tersedia", price: 299, cover: "plum", number: "04",
    outcomes: ["Bina pemahaman asas pasaran", "Buat latihan senarai semak", "Ulang kaji contoh aplikasi mengikut masa anda"],
    sections: [
      { title: "Asas pasaran", segments: [{ title: "Cara pasaran saham berfungsi", description: "Terokai asas pasaran melalui rakaman penerangan dan contoh aplikasi." }, { title: "Risiko dan istilah penting", description: "Kenali istilah utama dan risiko sebelum memulakan latihan." }] },
      { title: "Latihan berpandu", segments: [{ title: "Membina senarai semak", description: "Bina senarai semak bersama fasilitator menggunakan contoh kelas." }, { title: "Mencuba proses keputusan", description: "Cuba urutan semakan dan bincangkan alasan di sebalik keputusan." }] },
      { title: "Soalan dan aplikasi", segments: [{ title: "Perbincangan kajian kes", description: "Semak contoh soalan dan aplikasi dalam rakaman kelas." }, { title: "Langkah seterusnya selepas bengkel", description: "Susun perkara untuk dipelajari dan disemak selepas sesi." }] },
    ] },
];

export const topics = ["Semua topik", "Asas saham", "Analisis teknikal", "Portfolio"] as const;
export const money = (amount: number) => `RM${amount.toLocaleString("en-MY")}`;
