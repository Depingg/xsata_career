import type { ReactNode } from "react";

type BadgeTone = "primary" | "accent" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

const toneStyles: Record<BadgeTone, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent text-primary",
  success: "bg-success-soft text-emerald-700",
  warning: "bg-warning-soft text-amber-700",
  danger: "bg-danger-soft text-red-700",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({ tone = "primary", dot = false, className = "", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${toneStyles[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
