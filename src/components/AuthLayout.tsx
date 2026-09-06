import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-accent-soft">
      <header className="border-b border-border-light bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-slate-600">{subtitle}</p>
          </div>

          <div className="rounded-2xl border border-border-light bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Dengan melanjutkan, Anda menyetujui{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Ketentuan Layanan
            </Link>{" "}
            dan{" "}
            <Link href="/" className="font-medium text-primary hover:underline">
              Kebijakan Privasi
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
