import Link from "next/link";
import type { Metadata } from "next";
import {
  ClipboardCheck,
  TrendingUp,
  Briefcase,
  Building2,
  ArrowRight,
  Users,
  CheckCircle2,
  Star,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Dasbor Admin / Guru BK",
};

interface UseCaseCard {
  href: string;
  title: string;
  description: string;
  icon: typeof ClipboardCheck;
}

const useCases: UseCaseCard[] = [
  {
    href: "/admin/nilai-skill",
    title: "Input Nilai & Skill",
    description: "Input dan kelola nilai serta kompetensi skill praktikum siswa.",
    icon: ClipboardCheck,
  },
  {
    href: "/admin/kesiapan-kerja",
    title: "Kesiapan Kerja & Skill Gap",
    description: "Lihat analisis skill gap dan tingkat kesiapan kerja siswa.",
    icon: TrendingUp,
  },
  {
    href: "/admin/lowongan",
    title: "Kelola Lowongan BKK",
    description: "Unggah lowongan kerja/magang baru dan verifikasi manual loker BKK.",
    icon: Briefcase,
  },
  {
    href: "/admin/mitra",
    title: "Data Mitra & Rekomendasi",
    description: "Kelola data mitra industri dan rekomendasi magang / kerja.",
    icon: Building2,
  },
];

export default function AdminDashboardPage() {
  return (
    <DashboardShell role="guru">
      <PageHeader
        title="Dasbor Admin / Guru BK"
        description="Kelola bimbingan karier, penilaian skill, kesiapan kerja, loker BKK, dan mitra industri."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Siswa Terdata</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">248</p>
              <p className="mt-1 text-xs text-muted">12 kelas</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <Users className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Siap Magang/Kerja</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">48%</p>
              <p className="mt-1 text-xs text-muted">119 siswa</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Loker Terverifikasi</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">12</p>
              <p className="mt-1 text-xs text-muted">Mitra BKK</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <Briefcase className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Mitra Industri</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">20</p>
              <p className="mt-1 text-xs text-muted">Rekomendasi aktif</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-danger-soft text-danger">
              <Building2 className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {useCases.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-all group-hover:border-primary/40 group-hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900">Ringkasan Kesiapan Kerja Siswa</h3>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-accent p-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-warning" />
              <p className="font-semibold text-primary">Rekomendasi AI</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Sejumlah siswa kelas XII masih memiliki kesenjangan skill pada bidang{" "}
              <b>keamanan jaringan</b> dan <b>pengembangan backend</b>. Fokuskan bimbingan dan
              penempatan magang pada mitra yang sesuai untuk menutup gap tersebut sebelum lulus.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
