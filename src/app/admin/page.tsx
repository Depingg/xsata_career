import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  BookOpenCheck,
  Store,
  ArrowRight,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { tracerStudyStore } from "@/lib/tracer-study-store";

export const metadata: Metadata = {
  title: "Dasbor Admin",
};

export default function AdminDashboardPage() {
  const stats = tracerStudyStore.stats();

  return (
    <DashboardShell role="admin" username="Pak Admin" userRole="Administrator • XSata Career">
      <PageHeader
        title="Selamat Datang, Admin"
        description="Kelola data tracer study alumni dan pemantauan keterserapan kerja lulusan SMK."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Alumni Terdata" value={stats.total} hint="Semua angkatan" icon={<GraduationCap className="h-5 w-5" />} tone="primary" />
        <StatCard label="Terserap Bekerja" value={`${stats.percentages.Bekerja}%`} hint={`${stats.counts.Bekerja} lulusan`} icon={<Briefcase className="h-5 w-5" />} tone="success" />
        <StatCard label="Melanjutkan Kuliah" value={`${stats.percentages.Melanjutkan}%`} hint={`${stats.counts.Melanjutkan} lulusan`} icon={<BookOpenCheck className="h-5 w-5" />} tone="warning" />
        <StatCard label="Wirausaha" value={`${stats.percentages.Wirausaha}%`} hint={`${stats.counts.Wirausaha} lulusan`} icon={<Store className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Distribusi Keterserapan Alumni (BMW)</h3>
            </div>
            <Link
              href="/admin/tracer-study"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Kelola data alumni
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-5">
            {(
              [
                { label: "Bekerja", value: stats.percentages.Bekerja, tone: "success" as const },
                { label: "Melanjutkan / Kuliah", value: stats.percentages.Melanjutkan, tone: "warning" as const },
                { label: "Wirausaha", value: stats.percentages.Wirausaha, tone: "danger" as const },
              ]
            ).map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}%</span>
                </div>
                <ProgressBar value={item.value} tone={item.tone} />
              </div>
            ))}
            <div className="rounded-xl bg-accent p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="font-semibold text-primary">Catatan Keterserapan</p>
              </div>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                <li>• Mayoritas alumni terserap dunia kerja ({stats.percentages.Bekerja}%).</li>
                <li>• {stats.counts.Melanjutkan} alumni melanjutkan studi ke perguruan tinggi.</li>
                <li>• {stats.counts.Wirausaha} alumni memilih jalur wirausaha (BMW).</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Data Loker Terverifikasi</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">
              Kelola lowongan magang dan kerja dari mitra industri pada halaman lowongan publik.
            </p>
            <LinkButton href="/lowongan" variant="secondary" size="sm" className="w-full">
              Lihat Daftar Loker
              <ArrowRight className="h-3.5 w-3.5" />
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}