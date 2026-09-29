"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import fieldMap from "@/lib/figma-flow-fields.json";

const profileFields = fieldMap.find((item) => item.slug === "member-36-profil-saya")?.fields ?? [];
const profileValue = (label: string) => profileFields.find((field) => field.label === label)?.value ?? "";
const malaysiaStates = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Perak", "Perlis",
  "Pulau Pinang", "Sabah", "Sarawak", "Selangor", "Terengganu",
  "Wilayah Persekutuan Kuala Lumpur", "Wilayah Persekutuan Labuan", "Wilayah Persekutuan Putrajaya",
];

export function MemberProfileCard() {
  const headingId = useId();
  const [country, setCountry] = useState("Malaysia");
  const [state, setState] = useState("Selangor");
  const isMalaysia = country.trim().toLocaleLowerCase() === "malaysia";

  return <section className="flow-card flow-profile-card" aria-labelledby={headingId}>
    <h2 id={headingId}>Maklumat peribadi.</h2>
    <div className="flow-profile-fields">
      <label className="flow-field"><span>Nama penuh</span><Input name="full-name" autoComplete="name" defaultValue={profileValue("Nama penuh")} /></label>
      <label className="flow-field"><span>Telefon</span><Input name="phone" type="tel" autoComplete="tel" defaultValue={profileValue("Telefon")} /></label>
      <label className="flow-field flow-profile-field-wide"><span>E-mel</span><Input name="email" type="email" autoComplete="email" defaultValue={profileValue("E-mel Google")} /></label>
      <label className="flow-field"><span>Alamat baris 1</span><Input name="address-line-1" autoComplete="address-line1" placeholder="Nombor rumah dan nama jalan" /></label>
      <label className="flow-field"><span>Alamat baris 2 (pilihan)</span><Input name="address-line-2" autoComplete="address-line2" placeholder="Taman, bangunan atau unit" /></label>
      <label className="flow-field"><span>Poskod</span><Input name="postal-code" autoComplete="postal-code" inputMode={isMalaysia ? "numeric" : "text"} maxLength={isMalaysia ? 5 : undefined} placeholder="Poskod" /></label>
      <label className="flow-field"><span>Bandar</span><Input name="city" autoComplete="address-level2" defaultValue={profileValue("Bandar")} /></label>
      <label className="flow-field"><span>Negeri / Wilayah</span>{isMalaysia
        ? <select name="state" autoComplete="address-level1" value={state} onChange={(event) => setState(event.target.value)}><option value="">Pilih negeri / wilayah</option>{malaysiaStates.map((name) => <option key={name} value={name}>{name}</option>)}</select>
        : <Input name="state" autoComplete="address-level1" placeholder="Negeri / wilayah" />}</label>
      <label className="flow-field"><span>Negara</span><Input name="country" autoComplete="country-name" value={country} onChange={(event) => setCountry(event.target.value)} /></label>
    </div>
  </section>;
}
