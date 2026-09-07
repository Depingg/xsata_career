import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  message,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-light bg-white p-8 text-center ${className}`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
        {icon ?? <SearchX className="h-7 w-7 text-slate-400" />}
      </span>
      {title && <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>}
      <p className="mt-1 max-w-md text-sm text-muted">{message}</p>
    </div>
  );
}