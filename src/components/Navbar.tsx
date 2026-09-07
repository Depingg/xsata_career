"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "./ui/Container";
import { LinkButton } from "./ui/Button";
import { clearSession, readSession } from "@/lib/auth-store";
import type { Session } from "@/lib/auth-store";

const navLinks = [
  { label: "Beranda", href: "/#hero" },
  { label: "Layanan", href: "/#layanan" },
  { label: "Lowongan", href: "/#lowongan" },
  { label: "Tentang", href: "/#tentang" },
];

export function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      setSession(readSession());
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const isSiswa = session?.role === "siswa";
  const nama = session?.nama?.trim() || (isSiswa ? "Siswa" : "Guru BK");
  const roleLabel = isSiswa ? "Siswa" : "Guru BK";
  const noInduk = isSiswa ? session?.nis : session?.nip;
  const initials = nama.charAt(0).toUpperCase();

  function handleDashboard() {
    setMenuOpen(false);
    router.push(isSiswa ? "/siswa" : "/admin");
  }

  function handleLogout() {
    setMenuOpen(false);
    clearSession();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border-light bg-white/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, index) => (
            <Link
              key={`${link.href}-${index}`}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-border-light bg-white py-1.5 pl-1.5 pr-3 transition-colors hover:border-primary hover:bg-accent-soft"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {initials}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{nama}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-60 rounded-xl border border-border-light bg-white shadow-lg">
                      <div className="border-b border-border-light px-4 py-3">
                        <p className="text-sm font-semibold text-slate-900">{nama}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {roleLabel}
                          {noInduk ? ` • ${isSiswa ? "NIS" : "NIP"}: ${noInduk}` : ""}
                        </p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={handleDashboard}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-400" />
                          Dashboard
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Keluar / Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <LinkButton href="/login" variant="primary" size="sm">
              Masuk
            </LinkButton>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-border-light bg-white md:hidden">
          <Container className="flex flex-col gap-2 py-4">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.href}-${index}`}
                href={link.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border-light pt-4">
              {session ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-border-light bg-accent-soft px-3 py-2.5">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {initials}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{nama}</p>
                      <p className="text-xs text-slate-500">
                        {roleLabel}
                        {noInduk ? ` • ${isSiswa ? "NIS" : "NIP"}: ${noInduk}` : ""}
                      </p>
                    </div>
                  </div>
                  <div
                    onClick={() => setOpen(false)}
                    className="w-full"
                  >
                    <LinkButton href={isSiswa ? "/siswa" : "/admin"} variant="primary" className="w-full">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </LinkButton>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar / Logout
                  </button>
                </>
              ) : (
                <div
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  <LinkButton href="/login" variant="primary" className="w-full">
                    Masuk
                  </LinkButton>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}