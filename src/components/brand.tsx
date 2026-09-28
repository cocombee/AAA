import { assetPath } from "@/lib/site-path";
import Image from "next/image";

export function Brand() {
  return <span className="academy-brand">
    <span className="academy-logo"><Image src={assetPath("/images/aaa-logo.png")} alt="Asri Ahmad Academy" width={1578} height={1364} unoptimized /></span>
    <span className="academy-brand-name" aria-hidden="true">ASRI AHMAD<span>ACADEMY</span></span>
  </span>;
}
