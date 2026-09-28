import { assetPath } from "@/lib/site-path";
export type IconName = "search" | "menu" | "calendar" | "reset" | "grid" | "book" | "chart" | "portfolio" | "home" | "user" | "payment" | "lock" | "logout" | "video" | "plus" | "ticket" | "bell" | "shield" | "help" | "receipt" | "history" | "users" | "key" | "play" | "settings";
const figmaIcons: Record<IconName, string> = {
  search: "search-inline", menu: "menu-lines", calendar: "calendar-inline", reset: "reset-inline",
  grid: "category-grid", book: "category-book", chart: "category-chart",
  portfolio: "category-portfolio", home: "home-inline", user: "user-inline", payment: "payment",
  lock: "lock-inline", logout: "logout-inline", video: "video-inline", plus: "plus-inline",
  ticket: "ticket-inline", bell: "bell-inline", shield: "shield-inline", help: "help-inline",
  receipt: "receipt-inline", history: "history-inline", users: "users-inline", key: "key-inline",
  play: "play-inline", settings: "settings-inline",
};
export function Icon({ name }: {name: IconName}) {
  const iconUrl = `url("${assetPath(`/icons/${figmaIcons[name]}.svg`)}")`;
  return <span className="figma-inline-icon" style={{ maskImage: iconUrl, WebkitMaskImage: iconUrl }} aria-hidden="true" />;
}
