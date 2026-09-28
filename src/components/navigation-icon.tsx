import { assetPath } from "@/lib/site-path";
export type NavigationIconName = "home" | "grid" | "search" | "book-open" | "graduation-cap" | "calendar" | "user" | "payment";
/** Flaticon editable source geometry; masks inherit navigation state colours. */
export function NavigationIcon({ name }: { name: NavigationIconName }) {
  const source = `url("${assetPath(`/icons/${name === "grid" ? "category-grid" : name}.svg`)}")`;
  return <span className="navigation-icon" aria-hidden="true" style={{ maskImage: source, WebkitMaskImage: source }} />;
}
