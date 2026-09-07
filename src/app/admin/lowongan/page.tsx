"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  Upload,
  Plus,
  Search,
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { MAJOR_CODES } from "@/lib/jurusan";

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
  jurusan: string[];
  bkkVerified: boolean;
}

const typeOptions = ["Full-time", "Magang (PKL)", "Part-time"] as const;

const emptyForm = {
  title: "",
  company: "",
  location: "",
  type: "Full-time" as Job["type"],
  salary: "",
  match: 80,
  posted: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
  logo: "PT",
  jurusan: "TKJ" as string,
  bkkVerified: false,
};

export default function KelolaLowonganPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"Semua" | "Terverifikasi" | "Menunggu">("Semua");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/loker");
      if (!res.ok) throw new Error("Gagal memuat data loker.");
      const data = (await res.json()) as Job[];
      setJobs(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await fetch("/api/loker");
        if (!res.ok) throw new Error("Gagal memuat data loker.");
        const data = (await res.json()) as Job[];
        if (!cancelled) setJobs(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateForm<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/loker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          jurusan: [form.jurusan],
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal mengunggah loker.");
      setMessage(`Lowongan "${payload.title}" berhasil diunggah.`);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  function toggleVerify(id: number) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, bkkVerified: !j.bkkVerified } : j)));
    setMessage("");
  }

  const q = query.trim().toLowerCase();
  const filtered = jobs.filter((j) => {
    const matchQ =
      !q ||
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q);
    const matchFilter =
      filter === "Semua" ||
      (filter === "Terverifikasi" && j.bkkVerified) ||
      (filter === "Menunggu" && !j.bkkVerified);
    return matchQ && matchFilter;
  });

  const total = jobs.length;
  const verified = jobs.filter((j) => j.bkkVerified).length;
  const pending = total - verified;

  return (
    <DashboardShell role="guru">
      <PageHeader
        title="Kelola Lowongan BKK"
        description="Unggah lowongan kerja/magang baru dan verifikasi manual loker BKK."
        actions={
          <Button variant="primary" size="sm">
            <Upload className="h-4 w-4" />
            Unggah Lowongan Baru
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Loker</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{total}</p>
              <p className="mt-1 text-xs text-muted">Semua lowongan</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <Briefcase className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Terverifikasi</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{verified}</p>
              <p className="mt-1 text-xs text-muted">Disetujui BKK</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <ShieldCheck className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Perlu Verifikasi</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{pending}</p>
              <p className="mt-1 text-xs text-muted">Menunggu manual</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <Clock className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      {message && (
        <div className="mt-6 rounded-xl bg-success-soft p-4 text-sm text-emerald-700">{message}</div>
      )}
      {error && <div className="mt-6 rounded-xl bg-danger-soft p-4 text-sm text-danger">{error}</div>}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Unggah Lowongan / Magang</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={onUpload} className="space-y-3.5">
              <Input
                label="Judul Posisi"
                id="title"
                required
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="cth. Teknisi Jaringan"
              />
              <Input
                label="Perusahaan"
                id="company"
                required
                value={form.company}
                onChange={(e) => updateForm("company", e.target.value)}
                placeholder="cth. PT Maju Bersama"
              />
              <Input
                label="Lokasi"
                id="location"
                required
                value={form.location}
                onChange={(e) => updateForm("location", e.target.value)}
                placeholder="cth. Salatiga"
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Tipe"
                  id="type"
                  value={form.type}
                  onChange={(e) => updateForm("type", e.target.value as Job["type"])}
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
                <Select
                  label="Jurusan"
                  id="jurusan"
                  value={form.jurusan}
                  onChange={(e) => updateForm("jurusan", e.target.value)}
                >
                  {MAJOR_CODES.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </Select>
              </div>
              <Input
                label="Gaji / Benefit"
                id="salary"
                value={form.salary}
                onChange={(e) => updateForm("salary", e.target.value)}
                placeholder="cth. Rp 3.500.000"
              />
              <Button type="submit" size="sm" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Unggah Lowongan
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-slate-900">Daftar Loker ({filtered.length})</h3>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari loker..."
                  className="h-10 w-full rounded-xl border border-border-light bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-52"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="h-10 rounded-xl border border-border-light bg-white px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Semua">Semua Status</option>
                <option value="Terverifikasi">Terverifikasi</option>
                <option value="Menunggu">Perlu Verifikasi</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted">Memuat data loker...</p>
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState message="Belum ada lowongan. Gunakan form unggah untuk menambahkan." />
            ) : (
              <div className="space-y-3">
                {filtered.map((j) => (
                  <div key={j.id} className="flex flex-col gap-3 rounded-xl border border-border-light p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-primary">
                        {j.logo}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">{j.title}</p>
                          <Badge tone={j.bkkVerified ? "success" : "warning"} dot>
                            {j.bkkVerified ? "Terverifikasi" : "Perlu Verifikasi"}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                          <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{j.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{j.location}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{j.posted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="accent">{j.type}</Badge>
                      <Button
                        variant={j.bkkVerified ? "outline" : "success"}
                        size="sm"
                        onClick={() => toggleVerify(j.id)}
                      >
                        {j.bkkVerified ? (
                          <><XCircle className="h-4 w-4" />Tarik</>
                        ) : (
                          <><CheckCircle2 className="h-4 w-4" />Verifikasi</>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
