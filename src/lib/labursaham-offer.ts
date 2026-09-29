// Published LaburSaham.com "From Zero to Hero" offer, checked 29 Sep 2026.
// Keep the checkout preview disconnected from live payment and registration.
export const laburSahamPackages = [
  {
    id: "Online",
    title: "Online",
    description: "Webinar sahaja",
    price: 49,
    originalPrice: 499,
    benefits: ["Akses webinar", "Akaun saham CGS International"],
  },
  {
    id: "Online+",
    title: "Online+",
    description: "Webinar + rakaman + bahan",
    price: 79,
    originalPrice: 799,
    benefits: ["Akses webinar", "Akaun saham CGS International", "Rakaman 48 jam", "eBook Asas Saham", "eWorkbook eksklusif", "Sesi bonus Live Market Updates"],
  },
  {
    id: "Fizikal",
    title: "Fizikal",
    description: "Seminar + bahan bercetak",
    price: 129,
    originalPrice: 1299,
    benefits: ["Akses seminar", "Akaun saham CGS International", "Rakaman 48 jam", "eBook Asas Saham", "Workbook eksklusif", "Sesi bonus Live Market Updates", "Buku Jom Mula Saham Syariah"],
  },
] as const;

export type LaburSahamPackage = (typeof laburSahamPackages)[number]["id"];
export const laburSahamPackage = (id: LaburSahamPackage) => laburSahamPackages.find((item) => item.id === id)!;
