"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Upload,
  Plus,
  Search,
  PieChart,
  GraduationCap,
  Briefcase,
  BookOpenCheck,
  Store,
  Loader2,
  FileSpreadsheet,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

type StatusTerserap = "Bekerja" | "Melanjutkan" | "Wirausaha";

interface Alumni {
  id: number;
  nama: string;
  angkatan: string;
  jurusan: string;
  status: StatusTerserap;
  tempat: string;
  tahun: string;
}

interface Stats {
  total: number;
  counts: Record<StatusTerserap, number>;
  percentages: Record<StatusTerserap, number>;
}

const STATUS_LIST: StatusTerserap[] = ["Bekerja", "Melanjutkan", "Wirausaha"];

const statusTone: Record<StatusTerserap, "success" | "warning" | "danger"> = {
  Bekerja: "success",
  Melanjutkan: "warning",
  Wirausaha: "danger",
};

const statusColor: Record<StatusTerserap, string> = {
  Bekerja: "#10b981",
  Melanjutkan: "#f59e0b",
  Wirausaha: "#ef4444",
};

const emptyForm = {
  nama: "",
  angkatan: "2025",
  jurusan: "RPL",
  status: "Bekerja" as StatusTerserap,
  tempat: "",
  tahun: "2026",
};

function DonutChart({ stats }: { stats: Stats }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = STATUS_LIST.map((status) => {
    const value = stats.percentages[status] ?? 0;
    const dash = (value / 100) * circumference;
    const segment = {
      status,
      value,
      dash,
      offset,
    };
    offset -= dash;
    return segment;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="h-48 w-48 -rotate-90">
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="26" />
          {stats.total > 0 &&
            segments.map(({ status, dash, offset: segOffset }) => (
              <circle
                key={status}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={statusColor[status]}
                strokeWidth="26"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={segOffset}
                strokeLinecap="butt"
              />
            ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900">{stats.total}</span>
          <span className="text-xs font-medium text-muted">Alumni</span>
        </div>
      </div>

      <ul className="space-y-3">
        {STATUS_LIST.map((status) => (
          <li key={status} className="flex items-center gap-3">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: statusColor[status] }}
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {status === "Melanjutkan" ? "Melanjutkan / Kuliah" : status}
              </p>
              <p className="text-xs text-muted">
                {stats.counts[status]} alumni • {stats.percentages[status]}%
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TracerStudyPage() {
  const [data, setData] = useState<Alumni[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    counts: { Bekerja: 0, Melanjutkan: 0, Wirausaha: 0 },
    percentages: { Bekerja: 0, Melanjutkan: 0, Wirausaha: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusTerserap | "Semua">("Semua");
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");
  const [importResult, setImportResult] = useState("");

  async function refreshData() {
    try {
      const res = await fetch("/api/tracer-study");
      if (!res.ok) throw new Error("Gagal memuat data tracer study.");
      const payload = (await res.json()) as { data: Alumni[]; stats: Stats };
      setData(payload.data);
      setStats(payload.stats);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/tracer-study");
        if (!res.ok) throw new Error("Gagal memuat data tracer study.");
        const payload = (await res.json()) as { data: Alumni[]; stats: Stats };
        if (cancelled) return;
        setData(payload.data);
        setStats(payload.stats);
        setError("");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((item) => {
      const matchesQuery =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.tempat.toLowerCase().includes(q) ||
        item.jurusan.toLowerCase().includes(q) ||
        item.angkatan.includes(q);
      const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [data, query, statusFilter]);

  function updateForm<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/tracer-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal menyimpan data.");
      setMessage(`Data alumni "${payload.nama}" berhasil ditambahkan.`);
      setForm(emptyForm);
      await refreshData();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  async function onImport(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImporting(true);
    setImportResult("");
    try {
      const text = await file.text();
      const rows = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

      // Header baris pertama: nama,angkatan,jurusan,status,tempat,tahun
      const hasHeader = rows[0].toLowerCase().includes("nama");
      const bodyRows = hasHeader ? rows.slice(1) : rows;

      const parsed = bodyRows
        .map((line) => {
          const [nama, angkatan, jurusan, status, tempat, tahun] = line
            .split(/[;,]/)
            .map((cell) => cell.trim());
          return { nama, angkatan, jurusan, status: status as StatusTerserap, tempat, tahun };
        })
        .filter(
          (item) =>
            item.nama && item.angkatan && item.jurusan && item.status && item.tempat && item.tahun
        );

      if (parsed.length === 0) {
        setImportResult("Tidak ada baris valid. Pastikan format CSV: nama,angkatan,jurusan,status,tempat,tahun.");
        return;
      }

      const res = await fetch("/api/tracer-study/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal mengimpor data.");

      setImportResult(
        `Berhasil mengimpor ${payload.added} data alumni.${payload.errors?.length ? ` ${payload.errors.length} baris dilewati (tidak valid).` : ""}`
      );
      await refreshData();
    } catch (err) {
      setImportResult(err instanceof Error ? err.message : "Gagal membaca file.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <DashboardShell role="admin" username="Pak Admin" userRole="Administrator • XSata Career">
      <PageHeader
        title="Tracer Study Alumni"
        description="Distribusi statistik keterserapan lulusan SMK: Bekerja, Melanjutkan, dan Wirausaha (BMW)."
        actions={
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            {importing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Import CSV
            <input type="file" accept=".csv,.txt" className="sr-only" onChange={onImport} />
          </label>
        }
      />

      {error && (
        <div className="mb-5 rounded-xl bg-danger-soft p-4 text-sm text-danger">{error}</div>
      )}

      {importResult && (
        <div
          className={`mb-5 rounded-xl p-4 text-sm ${
            importResult.startsWith("Tidak") || importResult.startsWith("Gagal")
              ? "bg-danger-soft text-danger"
              : "bg-success-soft text-emerald-700"
          }`}
        >
          {importResult}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Statistik Keterserapan Alumni</h3>
          </CardHeader>
          <CardContent>
            <DonutChart stats={stats} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Input Data Alumni</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3.5">
              <Input
                label="Nama Alumni"
                id="nama"
                required
                value={form.nama}
                onChange={(e) => updateForm("nama", e.target.value)}
                placeholder="cth. Ahmad Fauzi"
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Angkatan (Lulus)"
                  id="angkatan"
                  value={form.angkatan}
                  onChange={(e) => updateForm("angkatan", e.target.value)}
                >
                  {["2025", "2024", "2023", "2022", "2021", "2020"].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
                <Select
                  label="Jurusan"
                  id="jurusan"
                  value={form.jurusan}
                  onChange={(e) => updateForm("jurusan", e.target.value)}
                >
                  {["RPL", "TKJ", "Multimedia", "AKL", "OTKP", "Pemasaran", "ELIN", "TITL", "TP", "TKRO", "TBSM"].map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Status Keterserapan"
                  id="status"
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value as StatusTerserap)}
                >
                  {STATUS_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
                <Select
                  label="Tahun Tracer"
                  id="tahun"
                  value={form.tahun}
                  onChange={(e) => updateForm("tahun", e.target.value)}
                >
                  {["2026", "2025", "2024", "2023", "2022"].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </div>
              <Input
                label="Tempat (Perusahaan / Kampus / Usaha)"
                id="tempat"
                required
                value={form.tempat}
                onChange={(e) => updateForm("tempat", e.target.value)}
                placeholder="cth. PT Maju Bersama"
              />
              <Button type="submit" size="sm" className="w-full" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Simpan Data Alumni
              </Button>
              {message && <p className="text-xs text-slate-600">{message}</p>}
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Tabel Data Alumni ({filtered.length})</h3>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama, jurusan, tempat..."
                className="h-10 w-full rounded-xl border border-border-light bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusTerserap | "Semua")}
              className="h-10 rounded-xl border border-border-light bg-white px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="Semua">Semua Status</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted">Memuat data alumni...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <FileSpreadsheet className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 font-semibold text-slate-900">Belum ada data alumni</h3>
              <p className="mt-1 text-sm text-muted">
                Tambahkan data manual atau impor file CSV.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-light text-xs uppercase tracking-wide text-muted">
                    <th className="px-5 py-3 font-semibold">Nama</th>
                    <th className="px-5 py-3 font-semibold">Angkatan</th>
                    <th className="px-5 py-3 font-semibold">Jurusan</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Tempat</th>
                    <th className="px-5 py-3 font-semibold">Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border-light last:border-0 hover:bg-accent-soft"
                    >
                      <td className="px-5 py-3 font-medium text-slate-900">{item.nama}</td>
                      <td className="px-5 py-3 text-muted">{item.angkatan}</td>
                      <td className="px-5 py-3 text-muted">{item.jurusan}</td>
                      <td className="px-5 py-3">
                        <Badge tone={statusTone[item.status]} dot>
                          {item.status === "Melanjutkan" ? "Melanjutkan / Kuliah" : item.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-muted">{item.tempat}</td>
                      <td className="px-5 py-3 text-muted">{item.tahun}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {!loading && data.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATUS_LIST.map((status) => (
            <Card key={status}>
              <CardContent className="flex items-center gap-3 p-5">
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${statusColor[status]}1a`, color: statusColor[status] }}
                >
                  {status === "Bekerja" ? (
                    <Briefcase className="h-5 w-5" />
                  ) : status === "Melanjutkan" ? (
                    <BookOpenCheck className="h-5 w-5" />
                  ) : (
                    <Store className="h-5 w-5" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-muted">
                    {status === "Melanjutkan" ? "Melanjutkan / Kuliah" : status}
                  </p>
                  <p className="text-xl font-bold text-slate-900">{stats.counts[status]}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
