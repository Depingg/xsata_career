import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = "", children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border-light bg-surface shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div className={`p-5 border-b border-border-light ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardContent({
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div className={`p-5 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div className={`p-5 border-t border-border-light ${className}`} {...rest}>
      {children}
    </div>
  );
}
