import type { Metadata } from "next";
import Link from "next/link";
import {
  Bot,
  ClipboardCheck,
  Briefcase,
  CalendarCheck,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export const metadata: Metadata = {
  title: "Dasbor Siswa",
};

const recommendedJobs = [
  {
    title: "Junior Frontend Developer",
    company: "PT Teknologi Nusantara",
    location: "Jakarta",
    type: "Full-time",
    match: 92,
  },
  {
    title: "IT Support Staff",
    company: "PT Solusi Digital",
    location: "Bandung",
    type: "Magang (PKL)",
    match: 87,
  },
  {
    title: "Multimedia Designer",
    company: "Studio Kreatif ID",
    location: "Surabaya",
    type: "Full-time",
    match: 84,
  },
];

const consultations = [
  { topic: "Konsultasi Karier: Jurusan UI/UX", date: "Senin, 8 Sep 2026", time: "09:30", guru: "Bu Ratna" },
  { topic: "Persiapan Interview Kerja", date: "Rabu, 10 Sep 2026", time: "13:00", guru: "Pak Budi" },
];

export default function StudentDashboardPage() {
  return (
    <DashboardShell role="siswa" username="Andini Putri" userRole="Siswa SMK • RPL">
      <PageHeader
        title="Halo, Andini 👋"
        description="Selamat datang kembali! Berikut ringkasan perkembangan kariermu."
      />

      {/* Welcome banner */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-primary p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Rekomendasi AI
            </span>
            <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
              Profesi yang paling cocok untukmu: UI/UX Designer
            </h2>
            <p className="mt-2 text-sm text-accent">
              Berdasarkan asesmen minat bakat dan nilai akademikmu, kamu memiliki
              kecocokan tinggi dengan karier UI/UX Designer.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/siswa/konsultasi"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
              >
                <Bot className="h-4 w-4" />
                Tanya AI Lebih Lanjut
              </Link>
              <Link
                href="/siswa/asesmen"
                className="inline-flex items-center gap-2 rounded-lg border border-accent/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/10"
              >
                <ClipboardCheck className="h-4 w-4" />
                Ulangi Asesmen
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Profil Asesmen"
          value="85%"
          hint="Lengkap"
          icon={<ClipboardCheck className="h-5 w-5" />}
          tone="primary"
        />
        <StatCard
          label="Konsultasi AI"
          value="12"
          hint="Sesi aktif"
          icon={<Bot className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Lamaran Terkirim"
          value="4"
          hint="1 diproses"
          icon={<Briefcase className="h-5 w-5" />}
          tone="warning"
        />
        <StatCard
          label="Sesi Bimbingan"
          value="2"
          hint="Bulan ini"
          icon={<CalendarCheck className="h-5 w-5" />}
          tone="danger"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recommended jobs */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Rekomendasi Lowongan</h3>
            </div>
            <Link
              href="/siswa/lowongan"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Lihat semua
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedJobs.map((job) => (
              <div
                key={job.title}
                className="flex flex-col gap-3 rounded-xl border border-border-light p-4 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{job.title}</h4>
                    <Badge tone="success">
                      <Star className="h-3 w-3 fill-current" />
                      {job.match}% cocok
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {job.company} • {job.location} • {job.type}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Lihat Detail
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming consultations */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Bimbingan Mendatang</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {consultations.map((c) => (
              <div key={c.topic} className="rounded-xl border border-border-light p-4">
                <div className="flex items-center justify-between">
                  <Badge tone="accent">{c.date}</Badge>
                  <span className="text-sm font-medium text-primary">{c.time}</span>
                </div>
                <h4 className="mt-2 font-medium text-slate-900">{c.topic}</h4>
                <p className="text-sm text-muted">Dengan {c.guru}</p>
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" size="sm">
                    Konfirmasi
                  </Button>
                  <Button variant="ghost" size="sm">
                    Detail
                  </Button>
                </div>
              </div>
            ))}
            <Link
              href="/guru/jadwal"
              className="mt-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Jadwalkan Konseling
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Skill progress */}
      <Card className="mt-6">
        <CardHeader className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Perkembangan Kompetensi</h3>
          <Badge tone="success">Skor Rata-rata 78</Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { skill: "Desain UI", score: 88 },
            { skill: "Pengembangan Web", score: 74 },
            { skill: "Komunikasi", score: 82 },
          ].map((s) => (
            <div key={s.skill}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{s.skill}</span>
                <span className="font-semibold text-primary">{s.score}%</span>
              </div>
              <ProgressBar value={s.score} tone={s.score >= 80 ? "success" : "primary"} />
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
