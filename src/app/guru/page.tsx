import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  FileBarChart,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export const metadata: Metadata = {
  title: "Dasbor Guru BK",
};

const recentStudents = [
  { name: "Andini Putri", kelas: "XII RPL 1", status: "Selesai asesmen", progress: 85, tone: "success" as const, statusTone: "success" as const },
  { name: "Rizky Pratama", kelas: "XII TKJ 2", status: "Butuh bimbingan", progress: 45, tone: "warning" as const, statusTone: "danger" as const },
  { name: "Siti Rahma", kelas: "XI MM 1", status: "Progres berjalan", progress: 60, tone: "primary" as const, statusTone: "accent" as const },
  { name: "Dimas Adit", kelas: "XII AKL 1", status: "Selesai asesmen", progress: 90, tone: "success" as const, statusTone: "success" as const },
];

const schedule = [
  { student: "Andini Putri", topic: "Persiapan Interview", time: "09:30", room: "R. BK 1" },
  { student: "Rizky Pratama", topic: "Pemetaan Karier", time: "11:00", room: "R. BK 2" },
  { student: "Siti Rahma", topic: "Konsultasi Jurusan", time: "13:30", room: "R. BK 1" },
];

export default function GuruDashboardPage() {
  return (
    <DashboardShell role="guru" username="Bu Ratna Dewi" userRole="Guru BK • SMK Negeri 1">
      <PageHeader
        title="Selamat Datang Kembali, Bu Ratna"
        description="Kelola bimbingan karier dan pantau perkembangan siswa."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Siswa Binaan" value="248" hint="12 kelas" icon={<Users className="h-5 w-5" />} tone="primary" />
        <StatCard label="Bimbingan Pekan Ini" value="18" hint="3 menunggu" icon={<CalendarCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Laporan Disusun" value="32" hint="Bulan ini" icon={<FileBarChart className="h-5 w-5" />} tone="warning" />
        <StatCard label="Pesan Masuk" value="7" hint="2 belum dibaca" icon={<MessageSquare className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent students */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Perkembangan Siswa</h3>
            </div>
            <Link
              href="/guru/siswa"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Kelola siswa
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentStudents.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-4 rounded-xl border border-border-light p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                    {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{s.name}</p>
                    <p className="text-xs text-muted">{s.kelas}</p>
                  </div>
                </div>
                <div className="hidden flex-1 max-w-[200px] sm:block">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">Progres</span>
                    <span className="font-semibold">{s.progress}%</span>
                  </div>
                  <ProgressBar value={s.progress} tone={s.tone} />
                </div>
                <Badge tone={s.statusTone} dot>
                  {s.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's schedule */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Jadwal Hari Ini</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {schedule.map((s) => (
              <div key={s.student} className="rounded-xl border border-border-light p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">{s.time}</span>
                  <Badge tone="neutral">{s.room}</Badge>
                </div>
                <h4 className="mt-1.5 font-medium text-slate-900">{s.student}</h4>
                <p className="text-sm text-muted">{s.topic}</p>
              </div>
            ))}
            <Button variant="secondary" size="sm" className="w-full">
              Lihat Jadwal Lengkap
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attention needed */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <h3 className="font-semibold text-slate-900">Perlu Perhatian</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Dimas Adit", note: "Belum mengikuti asesmen minat bakat." },
              { name: "Rizky Pratama", note: "Dua konsultasi terakhir dibatalkan." },
              { name: "Nadia Sari", note: "Skor asesmen menurun drastis." },
            ].map((s) => (
              <div key={s.name} className="flex items-start justify-between gap-3 rounded-xl bg-warning-soft p-4">
                <div>
                  <p className="font-semibold text-slate-900">{s.name}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{s.note}</p>
                </div>
                <Button variant="warning" size="sm">
                  Tindak
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Overall progress */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Capaian Bimbingan</h3>
            </div>
            <Badge tone="success">
              <CheckCircle2 className="h-3 w-3" />
              On track
            </Badge>
          </CardHeader>
          <CardContent className="space-y-5">
            {[
              { label: "Siswa selesai asesmen", value: 72 },
              { label: "Siswa aktif berkonsultasi", value: 64 },
              { label: "Siswa siap magang/kerja", value: 48 },
              { label: "Target kunjungan industri", value: 38 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}%</span>
                </div>
                <ProgressBar value={item.value} tone={item.value >= 60 ? "success" : "primary"} />
              </div>
            ))}
            <div className="rounded-xl bg-accent p-4">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" />
                <p className="font-semibold text-primary">Rekomendasi AI</p>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                Siswa kelas XII perlu difokuskan pada persiapan magang pada kuartal ini agar mencapai target industri.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
