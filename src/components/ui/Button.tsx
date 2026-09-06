import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent" | "success" | "warning" | "danger";
type Size = "sm" | "md" | "lg";

interface ClassProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-darker shadow-sm",
  secondary: "bg-accent text-primary hover:bg-[#d9e9ff]",
  outline:
    "bg-transparent border border-border-light text-slate-700 hover:border-primary hover:text-primary",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  accent: "bg-primary text-white",
  success: "bg-success text-white hover:bg-emerald-600",
  warning: "bg-warning text-white hover:bg-amber-500",
  danger: "bg-danger text-white hover:bg-red-500",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-xs px-3 py-2 h-9",
  md: "text-sm px-4 py-2.5 h-11",
  lg: "text-base px-6 py-3 h-12",
};

function buttonClass({ variant = "primary", size = "md", className = "" }: ClassProps) {
  return `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
}

type LinkButtonProps = ClassProps & { href: string; children: ReactNode };

export function LinkButton({ href, ...props }: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClass(props)}>
      {props.children}
    </Link>
  );
}

type NativeButtonProps = ClassProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    as?: ElementType;
    children: ReactNode;
  };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: NativeButtonProps) {
  return (
    <button className={buttonClass({ variant, size, className })} {...rest}>
      {children}
    </button>
  );
}
