"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  Briefcase,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Container } from "../ui/Container";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { LinkButton } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  match: number;
  posted: string;
  logo: string;
  jurusan: string[];
  bkkVerified: boolean;
}

import { MAJOR_CODES } from "@/lib/jurusan";

export const MAJOR_LIST: Readonly<string[]> = MAJOR_CODES;

type VerificationFilter = "semua" | "terverifikasi" | "belum";

export function LokerFilterWidget() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [majors, setMajors] = useState<string[]>([]);
  const [verification, setVerification] = useState<VerificationFilter>("semua");

  useEffect(() => {
    let cancelled = false;

    async function loadJobs() {
      try {
        const res = await fetch("/api/loker");
        if (!res.ok) throw new Error("Gagal memuat lowongan.");
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

  function toggleMajor(major: string) {
    setMajors((prev) =>
      prev.includes(major) ? prev.filter((m) => m !== major) : [...prev, major]
    );
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesQuery =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);

      const matchesMajor =
        majors.length === 0 || (job.jurusan ?? []).some((m) => majors.includes(m));

      const matchesVerification =
        verification === "semua" ||
        (verification === "terverifikasi" && job.bkkVerified) ||
        (verification === "belum" && !job.bkkVerified);

      return matchesQuery && matchesMajor && matchesVerification;
    });
  }, [jobs, query, majors, verification]);

  const hasActiveFilter = query.trim() !== "" || majors.length > 0 || verification !== "semua";

  return (
    <section id="lowongan" className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            <Briefcase className="h-3.5 w-3.5" />
            Cari Lowongan
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Lowongan yang Cocok untuk Jurusanmu
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            Filter berdasarkan jurusan SMK dan status verifikasi BKK untuk menemukan
            lowongan yang paling sesuai.
          </p>
        </div>

        <Card className="mx-auto mt-8 max-w-4xl">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari posisi, perusahaan, atau kota..."
                  className="h-12 w-full rounded-xl border border-border-light bg-white pl-11 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex rounded-xl border border-border-light bg-accent-soft p-1">
                {(
                  [
                    { value: "semua", label: "Semua" },
                    { value: "terverifikasi", label: "Terverifikasi BKK" },
                    { value: "belum", label: "Belum" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setVerification(opt.value)}
                    className={`flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                      verification === opt.value
                        ? "bg-primary text-white shadow-sm"
                        : "text-slate-600 hover:text-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                Jurusan SMK
              </p>
              <div className="flex flex-wrap gap-2">
                {MAJOR_LIST.map((major) => {
                  const active = majors.includes(major);
                  return (
                    <button
                      key={major}
                      onClick={() => toggleMajor(major)}
                      aria-pressed={active}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "bg-primary text-white shadow-sm"
                          : "border border-border-light bg-white text-slate-600 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {major}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mx-auto mt-8 max-w-4xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted">Memuat lowongan...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-border-light bg-white p-8 text-center text-sm text-danger">
              {error}
            </div>
          ) : filtered.length === 0 ? (
            jobs.length === 0 ? (
              <EmptyState
                title="Belum Ada Lowongan Kerja"
                message="Info lowongan kerja & magang dari BKK SMKN 1 Tengaran akan otomatis tampil di sini setelah data resmi diunggah."
              />
            ) : (
              <div className="rounded-2xl border border-border-light bg-white p-10 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-slate-300" />
                <h3 className="mt-3 font-semibold text-slate-900">
                  Tidak ada lowongan yang cocok
                </h3>
                <p className="mt-1 text-sm text-muted">
                  Coba ubah kata kunci atau pilihan filtarnya.
                </p>
                {hasActiveFilter && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setMajors([]);
                      setVerification("semua");
                    }}
                    className="mt-4 text-sm font-semibold text-primary hover:underline"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            )
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filtered.slice(0, 6).map((job) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-primary">
                          {job.logo}
                        </span>
                        {job.bkkVerified ? (
                          <Badge tone="success">
                            <ShieldCheck className="h-3 w-3" />
                            Terverifikasi BKK
                          </Badge>
                        ) : (
                          <Badge tone="neutral">Belum terverifikasi</Badge>
                        )}
                      </div>
                      <h3 className="mt-3 font-semibold text-slate-900">{job.title}</h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge tone="accent">{job.type}</Badge>
                        {(job.jurusan ?? []).slice(0, 3).map((m) => (
                          <span
                            key={m}
                            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border-light pt-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{job.salary}</p>
                          <p className="text-xs text-muted">{job.match}% cocok dengan profilmu</p>
                        </div>
                        <LinkButton href={`/lowongan`} variant="outline" size="sm">
                          Detail
                          <ArrowRight className="h-3.5 w-3.5" />
                        </LinkButton>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <LinkButton href="/lowongan" variant="secondary">
                  Lihat Semua Lowongan
                  <ArrowRight className="h-4 w-4" />
                </LinkButton>
              </div>

              <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                <ShieldCheck className="h-4 w-4 text-success" />
                Menampilkan {Math.min(filtered.length, 6)} dari {filtered.length} lowongan yang sesuai
              </p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}