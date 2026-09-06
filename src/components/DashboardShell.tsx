"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Bot,
  ClipboardCheck,
  Briefcase,
  BookOpen,
  Users,
  CalendarCheck,
  BarChart3,
  MessageSquare,
  GraduationCap,
  LogOut,
  FileText,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
} from "lucide-react";
import { Logo } from "./Logo";

export type Role = "siswa" | "guru" | "admin";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const siswaNav: NavItem[] = [
  { label: "Dasbor", href: "/siswa", icon: LayoutDashboard },
  { label: "Konsultasi AI Karier", href: "/siswa/konsultasi", icon: Bot },
  { label: "Asesmen Minat", href: "/siswa/asesmen", icon: ClipboardCheck },
  { label: "Rapor Kesiapan", href: "/interview", icon: FileText },
  { label: "Lowongan", href: "/siswa/lowongan", icon: Briefcase },
  { label: "Materi & Panduan", href: "/siswa/materi", icon: BookOpen },
];

const guruNav: NavItem[] = [
  { label: "Dasbor", href: "/guru", icon: LayoutDashboard },
  { label: "Kelola Siswa", href: "/guru/siswa", icon: Users },
  { label: "Jadwal Konseling", href: "/guru/jadwal", icon: CalendarCheck },
  { label: "Laporan & Analitik", href: "/guru/laporan", icon: BarChart3 },
  { label: "Pesan", href: "/guru/pesan", icon: MessageSquare },
];

const adminNav: NavItem[] = [
  { label: "Dasbor", href: "/admin", icon: LayoutDashboard },
  { label: "Tracer Study", href: "/admin/tracer-study", icon: GraduationCap },
];

interface DashboardShellProps {
  role: Role;
  username: string;
  userRole: string;
  children: ReactNode;
}

export function DashboardShell({
  role,
  username,
  userRole,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems =
    role === "siswa" ? siswaNav : role === "guru" ? guruNav : adminNav;

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
            {username
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div className="text-center">
            <p className="font-semibold text-slate-900">{username}</p>
            <p className="text-xs text-muted">{userRole}</p>
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

        <div className="border-t border-border-light p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-accent hover:text-primary"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </Link>
        </div>
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

            <div className="hidden items-center gap-2 rounded-lg border border-border-light px-3 py-1.5 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent">
                <User className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm font-medium text-slate-700">{username}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
