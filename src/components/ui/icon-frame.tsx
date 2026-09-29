import { Icon, type IconName } from "@/components/home/icon";

export type IconFrameVariant = "outline" | "navy" | "gold" | "muted" | "navy-soft" | "gold-soft" | "light";

type IconFrameContent = { name: IconName; label?: never } | { name?: never; label: string };

export function IconFrame({ name, label, variant = "outline", className = "" }: IconFrameContent & { variant?: IconFrameVariant; className?: string }) {
  return <span className={`aaa-icon-frame ${className}`.trim()} data-variant={variant} aria-hidden="true">{name ? <Icon name={name} /> : <span className="aaa-icon-frame-label">{label}</span>}</span>;
}
