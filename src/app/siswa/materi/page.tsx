"use client";

import { useState } from "react";
import {
  Book,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  ListChecks,
  Loader2,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Materi {
  id: number;
  icon: typeof Book;
  category: string;
  title: string;
  description: string;
  topics: string[];
  duration: string;
  updated: string;
  source: "bkk" | "ai";
}

const INITIAL_MODULES: Materi[] = [
  {
    id: 1,
    icon: FileText,
    category: "Dokumen Lamaran",
    title: "Persiapan CV & Surat Lamaran",
    description:
      "Panduan menyusun Curriculum Vitae yang rapi, padat, dan menarik bagi perusahaan — lengkap dengan tips menulis surat lamaran formal.",
    topics: ["Struktur CV", "Kata Kunci", "Surat Lamaran"],
    duration: "± 15 menit",
    updated: "1 minggu lalu",
    source: "bkk",
  },
  {
    id: 2,
    icon: ListChecks,
    category: "Interview",
    title: "Tips Interview BKK",
    description:
      "Siapkan diri menghadapi wawancara kerja maupun wawancara BKK: pertanyaan umum, bahasa tubuh, dan cara menjawab dengan percaya diri.",
    topics: ["Pertanyaan Umum", "Bahasa Tubuh", "Feedback"],
    duration: "± 20 menit",
    updated: "2 minggu lalu",
    source: "bkk",
  },
  {
    id: 3,
    icon: GraduationCap,
    category: "Perencanaan Karier",
    title: "Panduan Kuliah vs Kerja",
    description:
      "Membandingkan dua jalur setelah lulus SMK (melanjutkan kuliah atau langsung bekerja) berdasarkan minat, kondisi, dan prospek masa depan.",
    topics: ["Perbandingan Jalur", "Pertimbangan", "Prospek"],
    duration: "± 12 menit",
    updated: "3 minggu lalu",
    source: "bkk",
  },
];

const AI_RESULT_MODULES: Omit<Materi, "id">[] = [
  {
    icon: TrendingUp,
    category: "Wawasan Industri",
    title: "Tren Karier Digital 2026 untuk Lulusan SMK",
    description:
      "Artikel ringkasan tentang profesi digital yang paling dicari perusahaan saat ini dan skill yang wajib dikuasai oleh lulusan SMK.",
    topics: ["Data & AI", "E-Commerce", "Industri Kreatif"],
    duration: "± 8 menit",
    updated: "Baru saja",
    source: "ai",
  },
  {
    icon: Book,
    category: "Pengembangan Diri",
    title: "Cara Membuat Portofolio Kreatif",
    description:
      "Panduan menyusun portofolio berbasis proyek yang menunjukkan kemampuan nyata kamu, dari memilih karya terbaik hingga menyajikannya online.",
    topics: ["Pilih Karya", "Format", "Publikasi"],
    duration: "± 10 menit",
    updated: "Baru saja",
    source: "ai",
  },
  {
    icon: CheckCircle2,
    category: "Skill Kerja",
    title: "5 Skill Wajib Sebelum Melamar Kerja",
    description:
      "Rangkuman lima keterampilan inti (komunikasi, digital, kolaborasi, problem solving, manajemen waktu) yang sering dievaluasi saat rekrutmen.",
    topics: ["Komunikasi", "Digital", "Kolaborasi"],
    duration: "± 7 menit",
    updated: "Baru saja",
    source: "ai",
  },
];

export default function MateriPage() {
  const [modules, setModules] = useState<Materi[]>(INITIAL_MODULES);
  const [searching, setSearching] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [addedCount, setAddedCount] = useState(0);

  function handleAiSearch() {
    if (searching) return;
    setSearching(true);
    setLastSync(null);
    setAddedCount(0);

    setTimeout(() => {
      setModules((prev) => {
        const maxId = prev.reduce((acc, m) => Math.max(acc, m.id), 0);
        const existingIds = new Set(prev.map((m) => m.id));
        const fresh = AI_RESULT_MODULES.map((m, i) => ({ ...m, id: maxId + i + 1 })).filter(
          (m) => !existingIds.has(m.id)
        );
        setAddedCount(fresh.length);
        return [...prev, ...fresh];
      });
      setLastSync(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setSearching(false);
    }, 2000);
  }

  return (
    <DashboardShell role="siswa">
      <PageHeader
        title="Materi & Panduan"
        description="Modul belajar karier untuk siswa SMK — diperbarui otomatis dengan pencarian materi & artikel dari internet."
        actions={
          <Button
            variant="primary"
            onClick={handleAiSearch}
            disabled={searching}
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {searching ? "Mencari & menyinkronkan materi..." : "Cari & Perbarui Materi (AI Search)"}
          </Button>
        }
      />

      {searching && (
        <Card className="mb-6 border-primary/30 bg-accent-soft">
          <CardContent className="flex items-center gap-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-primary-dark" />
              </span>
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                AI sedang menelusuri materi & artikel karier SMK terbaru dari internet...
              </p>
              <p className="text-xs text-muted">
                Biasanya membutuhkan waktu beberapa detik.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {addedCount > 0 && !searching && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-success-soft bg-success-soft/50 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-success">
              Sinkronisasi selesai.
            </span>{" "}
            {addedCount} materi & artikel baru ditemukan dan ditambahkan
            {lastSync && ` · diperbarui pukul ${lastSync}`}.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((modul) => {
          const Icon = modul.icon;
          const isAi = modul.source === "ai";
          return (
            <Card
              key={modul.id}
              className={`flex flex-col ${isAi ? "border-primary/30 ring-1 ring-primary/10" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  {isAi ? (
                    <Badge tone="primary" dot>
                      <Sparkles className="h-3 w-3" />
                      AI Search
                    </Badge>
                  ) : (
                    <Badge tone="neutral">BKK</Badge>
                  )}
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary">
                  {modul.category}
                </p>
                <h3 className="mt-1 font-semibold leading-snug text-slate-900">
                  {modul.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{modul.description}</p>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-1.5">
                {modul.topics.map((topic) => (
                  <Badge key={topic} tone="accent">
                    {topic}
                  </Badge>
                ))}
              </CardContent>

              <CardFooter className="mt-auto flex items-center justify-between border-t border-border-light pt-4">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {modul.duration}
                  </span>
                  <span>{modul.updated}</span>
                </div>
                <Badge tone={isAi ? "primary" : "neutral"}>
                  {isAi ? "Artikel Internet" : "Modul Resmi BKK"}
                </Badge>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </DashboardShell>
  );
}