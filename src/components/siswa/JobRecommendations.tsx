"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ChevronRight,
  Star,
  Building2,
  MapPin,
  Clock,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Loker } from "@/lib/loker-store";

export function JobRecommendations() {
  const [jobs, setJobs] = useState<Loker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const res = await fetch("/api/loker");
        if (!res.ok) throw new Error("Gagal memuat data lowongan.");
        const data = (await res.json()) as Loker[];
        if (!cancelled) setJobs(data);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900">Rekomendasi Lowongan Kerja</h3>
        </div>
        <Link
          href="/siswa/lowongan"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lihat semua
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            Memuat lowongan...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-danger-soft p-4 text-sm text-danger">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="Belum Ada Lowongan Kerja"
            message="Info lowongan kerja & magang dari BKK SMKN 1 Tengaran akan otomatis tampil di sini setelah data resmi diunggah."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-3 rounded-xl border border-border-light p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-primary">
                    {job.logo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold text-slate-900">{job.title}</h4>
                      <Badge tone="success">
                        <Star className="h-3 w-3 fill-current" />
                        {job.match}% cocok
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{job.company}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {job.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {job.posted}
                  </span>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-border-light pt-3">
                  <p className="text-sm font-semibold text-slate-900">{job.salary}</p>
                  <LinkButton
                    href="/siswa/lowongan"
                    variant="outline"
                    size="sm"
                  >
                    Lihat Detail
                    <ArrowRight className="h-3.5 w-3.5" />
                  </LinkButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}