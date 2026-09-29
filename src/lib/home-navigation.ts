export const homeNavigation = [
  { label: "Home", href: "#utama", icon: "home" },
  { label: "LaburSaham", href: "#program", icon: "chart" },
  { label: "Courses", href: "#kelas", icon: "graduation" },
  { label: "About", href: "#tentang", icon: "academy" },
  { label: "Help", href: "#soalan", icon: "help" },
] as const;

export const homeNavigationFromDashboard = homeNavigation.map((item) => ({
  ...item,
  href: item.href === "#utama" ? "/" : `/${item.href}`,
}));
