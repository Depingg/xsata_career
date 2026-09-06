"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck,
  SlidersHorizontal,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Magang (PKL)" | "Part-time";
  salary: string;
  match: number;
  posted: string;
  logo: string;
  saved: boolean;
}

const filters = ["Semua", "Full-time", "Magang (PKL)", "Part-time"];

export default function LowonganPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const res = await fetch("/api/loker");
        if (!res.ok) throw new Error("Gagal memuat data loker.");
        const data = (await res.json()) as Job[];
        if (!cancelled) {
          setJobs(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = activeFilter === "Semua" ? jobs : jobs.filter((j) => j.type === activeFilter);

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/loker/scan?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Gagal mencari data loker.");
      const data = (await res.json()) as { results: Job[] };
      setJobs(data.results);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSave(id: number) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, saved: !j.saved } : j)));
  }

  return (
    <DashboardShell role="siswa" username="Andini Putri" userRole="Siswa SMK • RPL">
      <PageHeader
        title="Lowongan Kerja & Magang"
        description="Temukan peluang yang sesuai dengan minat dan kompetensimu."
        actions={
          <Button variant="secondary" size="sm">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
        }
      />

      {/* Search */}
      <form onSubmit={onSearch} className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari lowongan, perusahaan, atau posisi..."
            className="h-11 w-full rounded-xl border border-border-light bg-white pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Cari
        </Button>
      </form>

      {/* Filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === f
                ? "bg-primary text-white"
                : "border border-border-light bg-white text-slate-600 hover:border-primary hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-5 rounded-xl bg-danger-soft p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted">Memuat data loker...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border-light bg-white p-10 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 font-semibold text-slate-900">Tidak ada lowongan ditemukan</h3>
          <p className="mt-1 text-sm text-muted">
            Coba ubah kata kunci pencarian atau filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-lg font-bold text-primary">
                    {job.logo}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{job.title}</h3>
                      <Badge tone="success">
                        <Star className="h-3 w-3 fill-current" />
                        {job.match}% cocok
                      </Badge>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <div className="flex items-center gap-2">
                      <Badge tone="accent">{job.type}</Badge>
                      <button
                        onClick={() => toggleSave(job.id)}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-primary"
                        aria-label="Simpan lowongan"
                      >
                        {job.saved ? (
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                        ) : (
                          <Bookmark className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{job.salary}</p>
                    <Button variant="outline" size="sm">
                      Lihat Detail
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline">
            <Briefcase className="h-4 w-4" />
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </DashboardShell>
  );
}