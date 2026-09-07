import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6 text-white"
          aria-hidden="true"
        >
          <path
            d="M13 2 4.5 13.5H11L10 22 19.5 10.5H13L13 2Z"
            fill="currentColor"
          />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent ring-2 ring-white">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        </span>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          XSata<span className="text-primary"> Career</span>
        </span>
      </span>
    </Link>
  );
}
