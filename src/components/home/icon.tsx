import { assetPath } from "@/lib/site-path";
export const iconNames = ["search", "arrowLeft", "chevronDown", "menu", "calendar", "reset", "grid", "book", "chart", "portfolio", "home", "user", "payment", "refund", "lock", "logout", "video", "plus", "ticket", "bell", "shield", "help", "receipt", "history", "users", "key", "play", "settings", "academy", "graduation"] as const;
export type IconName = (typeof iconNames)[number];
const figmaIcons: Record<IconName, string> = {
  search: "search-inline", arrowLeft: "arrow-left-inline", chevronDown: "chevron-down-inline", menu: "menu-lines", calendar: "calendar-inline", reset: "reset-inline",
  grid: "category-grid", book: "category-book", chart: "category-chart",
  portfolio: "category-portfolio", home: "home-inline", user: "user-inline", payment: "payment", refund: "refund-inline",
  lock: "lock-inline", logout: "logout-inline", video: "video-inline", plus: "plus-inline",
  ticket: "ticket-inline", bell: "bell-inline", shield: "shield-inline", help: "help-inline",
  receipt: "receipt-inline", history: "history-inline", users: "users-inline", key: "key-inline",
  play: "play-inline", settings: "settings-inline", academy: "academy-inline", graduation: "graduation-inline",
};
const thinFigmaIcons: Partial<Record<IconName, string>> = {
  calendar: "calendar-inline-thin", ticket: "ticket-inline-thin", play: "play-inline-thin",
  receipt: "receipt-inline-thin", bell: "bell-inline-thin", help: "help-inline-thin",
};
export function Icon({ name, weight = "regular" }: { name: IconName; weight?: "regular" | "thin" }) {
  const iconName = weight === "thin" ? thinFigmaIcons[name] ?? figmaIcons[name] : figmaIcons[name];
  const iconUrl = `url("${assetPath(`/icons/${iconName}.svg`)}")`;
  return <span className="figma-inline-icon" style={{ maskImage: iconUrl, WebkitMaskImage: iconUrl }} aria-hidden="true" />;
}
