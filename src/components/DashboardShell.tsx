"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { clearSession, readSession } from "@/lib/auth-store";
import type { Session } from "@/lib/auth-store";
import {
  LayoutDashboard,
  Bot,
  ClipboardCheck,
  Briefcase,
  LogOut,
  FileText,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  Home,
  Mic,
  Book,
} from "lucide-react";
import { Logo } from "./Logo";

export type Role = "siswa";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const siswaNav: NavItem[] = [
  { label: "Dasbor", href: "/siswa", icon: LayoutDashboard },
  { label: "Konsultasi AI Karier", href: "/siswa/konsultasi", icon: Bot },
  { label: "AI Voice Konsultasi", href: "/siswa/voice", icon: Mic },
  { label: "Asesmen Minat", href: "/siswa/asesmen", icon: ClipboardCheck },
  { label: "Rapor Kesiapan", href: "/siswa/rapor", icon: FileText },
  { label: "Materi & Panduan", href: "/siswa/materi", icon: Book },
  { label: "Lowongan", href: "/siswa/lowongan", icon: Briefcase },
];

interface DashboardShellProps {
  role: Role;
  children: ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

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

  const navItems = siswaNav;

  const displayName = session?.nama?.trim() || "Siswa";
  const displayUserRole = session?.userRole?.trim() || "Siswa SMK";

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  function handleDashboard() {
    setProfileOpen(false);
    router.push("/siswa");
  }

  function handleHome() {
    setProfileOpen(false);
    router.push("/");
  }

  return (
    <div className="flex min-h-screen bg-accent-soft">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border-light bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border-light px-5">
          <Logo />
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 border-b border-border-light px-5 py-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            {displayName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div className="text-center">
            <p className="font-semibold text-slate-900">{displayName}</p>
            <p className="text-xs text-muted">{displayUserRole}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-accent hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>

      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-light bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-2 hidden text-sm text-slate-500 lg:block">
            Portal <span className="font-semibold text-primary">XSata Career</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="hidden items-center gap-2 rounded-lg border border-border-light px-3 py-1.5 transition-colors hover:border-primary hover:bg-accent-soft sm:flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent">
                  <User className="h-4 w-4 text-primary" />
                </span>
                <span className="text-sm font-medium text-slate-700">{displayName}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border-light bg-white shadow-lg">
                    <div className="border-b border-border-light px-4 py-3">
                      <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{displayUserRole}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={handleDashboard}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        <LayoutDashboard className="h-4 w-4 text-slate-400" />
                        Dasbor
                      </button>
                      <button
                        onClick={handleHome}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        <Home className="h-4 w-4 text-slate-400" />
                        Halaman Utama
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Keluar / Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
