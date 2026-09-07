"use client";

import { useState } from "react";
import { TrendingUp, Target, CheckCircle2, AlertTriangle, Search, Star } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";

interface SkillGap {
  skill: string;
  current: number;
  target: number;
}

interface SiswaKesiapan {
  id: number;
  nama: string;
  kelas: string;
  jurusan: string;
  profesi: string;
  kesiapan: number;
  gaps: SkillGap[];
}

const data: SiswaKesiapan[] = [
  {
    id: 1,
    nama: "Nanda",
    kelas: "XII TKJ 1",
    jurusan: "TKJ",
    profesi: "Teknisi Jaringan",
    kesiapan: 82,
    gaps: [
      { skill: "Konfigurasi Router", current: 85, target: 90 },
      { skill: "Keamanan Jaringan", current: 60, target: 90 },
      { skill: "Komunikasi Profesional", current: 75, target: 80 },
    ],
  },
  {
    id: 2,
    nama: "Rizky Pratama",
    kelas: "XII TKJ 2",
    jurusan: "TKJ",
    profesi: "Web Developer",
    kesiapan: 58,
    gaps: [
      { skill: "JavaScript / Frontend", current: 65, target: 85 },
      { skill: "Database & Backend", current: 40, target: 80 },
      { skill: "Version Control (Git)", current: 30, target: 70 },
    ],
  },
  {
    id: 3,
    nama: "Siti Rahma",
    kelas: "XI RPL 1",
    jurusan: "RPL",
    profesi: "UI/UX Designer",
    kesiapan: 74,
    gaps: [
      { skill: "Figma & Prototyping", current: 80, target: 90 },
      { skill: "Riset Pengguna", current: 55, target: 80 },
    ],
  },
  {
    id: 4,
    nama: "Dimas Adit",
    kelas: "XII Tata Boga 1",
    jurusan: "Tata Boga",
    profesi: "Chef / Food Service",
    kesiapan: 88,
    gaps: [{ skill: "Manajemen Dapur", current: 75, target: 85 }],
  },
];

export default function KesiapanKerjaPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? data.filter(
        (s) =>
          s.nama.toLowerCase().includes(q) ||
          s.kelas.toLowerCase().includes(q) ||
          s.profesi.toLowerCase().includes(q)
      )
    : data;

  const siapKerja = data.filter((s) => s.kesiapan >= 80).length;
  const perluPerhatian = data.filter((s) => s.kesiapan < 70).length;
  const rataRata = Math.round(data.reduce((a, s) => a + s.kesiapan, 0) / Math.max(1, data.length));

  return (
    <DashboardShell role="guru">
      <PageHeader
        title="Kesiapan Kerja & Skill Gap"
        description="Analisis kesenjangan skill dan pantau tingkat kesiapan kerja siswa."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Siswa</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{data.length}</p>
              <p className="mt-1 text-xs text-muted">Teranalisis</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Siap Kerja</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{siapKerja}</p>
              <p className="mt-1 text-xs text-muted">Kesiapan ≥ 80%</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <CheckCircle2 className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Perlu Perhatian</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{perluPerhatian}</p>
              <p className="mt-1 text-xs text-muted">Kesiapan &lt; 70%</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-danger-soft text-danger">
              <AlertTriangle className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Kesiapan Rata-rata</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{rataRata}%</p>
              <p className="mt-1 text-xs text-muted">Semua siswa</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <Target className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-slate-900">Analisis Kesiapan & Skill Gap Siswa</h3>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari siswa atau profesi..."
              className="h-10 w-full rounded-xl border border-border-light bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          {filtered.length === 0 ? (
            <EmptyState message="Tidak ada siswa yang cocok dengan pencarian." />
          ) : (
            filtered.map((s) => {
              const biggestGap = s.gaps.reduce((a, g) => (g.target - g.current > a.target - a.current ? g : a), s.gaps[0]);
              return (
                <div key={s.id} className="rounded-2xl border border-border-light p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {s.nama.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{s.nama}</p>
                        <p className="text-xs text-muted">{s.kelas} • {s.jurusan}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone="accent">
                        <Star className="h-3 w-3 fill-current" />
                        {s.profesi}
                      </Badge>
                      <Badge
                        tone={s.kesiapan >= 80 ? "success" : s.kesiapan >= 70 ? "warning" : "danger"}
                        dot
                      >
                        Kesiapan {s.kesiapan}%
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="space-y-3.5">
                      {s.gaps.map((g) => {
                        const diff = g.target - g.current;
                        return (
                          <div key={g.skill}>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                              <span className="font-medium text-slate-700">{g.skill}</span>
                              <span className="flex items-center gap-2 text-xs text-muted">
                                <span>Saat ini <b className="text-slate-900">{g.current}</b> / Target{" "}
                                  <b className="text-slate-900">{g.target}</b></span>
                                {diff > 0 ? (
                                  <Badge tone="warning">{diff} poin lagi</Badge>
                                ) : (
                                  <Badge tone="success">Tercapai</Badge>
                                )}
                              </span>
                            </div>
                            <div className="relative">
                              <ProgressBar value={g.current} tone={diff > 0 ? "warning" : "success"} />
                              <span
                                className="absolute top-0 h-full w-0.5 rounded-full bg-slate-900"
                                style={{ left: `${Math.min(100, g.target)}%` }}
                                title={`Target ${g.target}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="rounded-xl bg-accent p-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-warning" />
                        <p className="text-sm font-semibold text-primary">Rekomendasi AI</p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">
                        Prioritas perbaikan: <b>{biggestGap.skill}</b> (selisih{" "}
                        {biggestGap.target - biggestGap.current} poin). Sarankan siswa mengikuti{" "}
                        pelatihan tambahan dan bimbingan intensif sebelum penempatan magang.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
