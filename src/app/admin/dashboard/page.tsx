"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Plus,
  Sparkles,
  X,
  Building2,
  MapPin,
  Loader2,
  Home,
  CheckCircle2,
  Menu,
  ChevronRight,
  UserRound,
  Bell,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, LinkButton } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Loker } from "@/lib/loker-store";

const JURUSAN_LIST = ["TKJ", "RPL", "Tata Busana", "Tata Boga", "TKR", "TSM"];

type Tab = "ringkasan" | "lowongan" | "siswa";
type KesiapanStatus = "Siap Kerja" | "Butuh Bimbingan" | "Lanjut Kuliah";

interface DataSiswa {
  nama: string;
  nis: string;
  jurusan: string;
  status: KesiapanStatus;
}

const DATA_SISWA: DataSiswa[] = [
  { nama: "Andini Putri", nis: "2401021", jurusan: "RPL", status: "Siap Kerja" },
  { nama: "Rafa Pratama", nis: "2401034", jurusan: "RPL", status: "Lanjut Kuliah" },
  { nama: "Salsabila Zahra", nis: "2401120", jurusan: "TKJ", status: "Butuh Bimbingan" },
  { nama: "Dimas Saputra", nis: "2401155", jurusan: "TKJ", status: "Siap Kerja" },
  { nama: "Nur Aisyah", nis: "2401212", jurusan: "Tata Busana", status: "Lanjut Kuliah" },
  { nama: "Bagus Aji Permana", nis: "2401307", jurusan: "TKR", status: "Butuh Bimbingan" },
  { nama: "Putri Maharani", nis: "2401402", jurusan: "Tata Boga", status: "Siap Kerja" },
  { nama: "Yoga Firmansyah", nis: "2401509", jurusan: "TSM", status: "Lanjut Kuliah" },
  { nama: "Cahya Ramadhani", nis: "2401030", jurusan: "RPL", status: "Siap Kerja" },
  { nama: "Ahmad Zaki", nis: "2401219", jurusan: "Tata Busana", status: "Butuh Bimbingan" },
];

const TOTAL_SISWA = 328;
const SISWA_TERPETAKAN_AI = 214;

const statusTone: Record<KesiapanStatus, "success" | "warning" | "primary"> = {
  "Siap Kerja": "success",
  "Butuh Bimbingan": "warning",
  "Lanjut Kuliah": "primary",
};

const NAV_ITEMS: Array<{ key: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { key: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { key: "lowongan", label: "Kelola Lowongan", icon: Briefcase },
  { key: "siswa", label: "Data Siswa", icon: Users },
];

interface SyncJobSeed {
  company: string;
  title: string;
  location: string;
  type: Loker["type"];
  salary: string;
  match: number;
  jurusan: string[];
}

const AI_SYNC_JOBS: SyncJobSeed[] = [
  {
    company: "PT Digital Nusantara",
    title: "Staff IT Support",
    location: "Semarang",
    type: "Full-time",
    salary: "Rp 3,2–4 jt/bulan",
    match: 95,
    jurusan: ["TKJ", "RPL"],
  },
  {
    company: "CV Karya Web Studio",
    title: "Junior Web Developer",
    location: "Salatiga",
    type: "Magang (PKL)",
    salary: "Uang saku + sertifikat",
    match: 92,
    jurusan: ["RPL"],
  },
  {
    company: "PT Jaring Nusantara",
    title: "Teknisi Jaringan",
    location: "Ungaran",
    type: "Full-time",
    salary: "Rp 3,5 jt/bulan",
    match: 89,
    jurusan: ["TKJ"],
  },
];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border-light bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ringkasan");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [jobs, setJobs] = useState<Loker[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  const [manualOpen, setManualOpen] = useState(false);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState("");
  const [manualForm, setManualForm] = useState({
    company: "",
    title: "",
    jurusan: "",
    location: "",
  });

  const [syncOpen, setSyncOpen] = useState(false);
  const [syncPhase, setSyncPhase] = useState<"loading" | "done">("loading");
  const [syncedJobs, setSyncedJobs] = useState<Loker[]>([]);
  const [syncError, setSyncError] = useState("");

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
          setJobsError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setJobsLoading(false);
      }
    }

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  async function addJobToStore(payload: Omit<Loker, "id" | "saved">): Promise<Loker> {
    const res = await fetch("/api/loker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(data.error || "Gagal menambahkan lowongan.");
    }
    return (await res.json()) as Loker;
  }

  async function submitManual(e: FormEvent) {
    e.preventDefault();
    if (
      !manualForm.company.trim() ||
      !manualForm.title.trim() ||
      !manualForm.jurusan ||
      !manualForm.location.trim()
    ) {
      return;
    }

    setManualSubmitting(true);
    setManualError("");
    try {
      const created = await addJobToStore({
        title: manualForm.title.trim(),
        company: manualForm.company.trim(),
        location: manualForm.location.trim(),
        type: "Full-time",
        salary: "Disesuaikan perusahaan",
        match: 80 + (jobs.length % 10) * 2,
        posted: "Baru",
        logo: manualForm.company.trim().charAt(0).toUpperCase(),
        jurusan:
          manualForm.jurusan === "Semua Jurusan"
            ? JURUSAN_LIST
            : [manualForm.jurusan],
        bkkVerified: true,
      });
      setJobs((prev) => [created, ...prev]);
      setManualOpen(false);
      setManualForm({ company: "", title: "", jurusan: "", location: "" });
    } catch (err) {
      setManualError(err instanceof Error ? err.message : "Gagal menyimpan lowongan.");
    } finally {
      setManualSubmitting(false);
    }
  }

  function openSync() {
    setSyncOpen(true);
    setSyncPhase("loading");
    setSyncedJobs([]);
    setSyncError("");
    window.setTimeout(() => {
      void runSync();
    }, 2000);
  }

  async function runSync() {
    const added: Loker[] = [];
    try {
      for (const job of AI_SYNC_JOBS) {
        const created = await addJobToStore({
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary,
          match: job.match,
          posted: "Baru",
          logo: job.company.charAt(0).toUpperCase(),
          jurusan: job.jurusan,
          bkkVerified: true,
        });
        added.push(created);
      }
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Sync gagal.");
    }
    setJobs((prev) => [...added, ...prev]);
    setSyncedJobs(added);
    setSyncPhase("done");
  }

  const countByStatus = useMemo(() => {
    const count: Record<KesiapanStatus, number> = {
      "Siap Kerja": 0,
      "Butuh Bimbingan": 0,
      "Lanjut Kuliah": 0,
    };
    for (const s of DATA_SISWA) count[s.status] += 1;
    return count;
  }, []);

  const statusProgress = (status: KesiapanStatus) =>
    Math.round((countByStatus[status] / DATA_SISWA.length) * 100);

  const ringkasan = (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Total Siswa"
          value={TOTAL_SISWA}
          hint="SMKN 1 Tengaran"
          tone="primary"
        />
        <StatCard
          icon={<Briefcase className="h-5 w-5" />}
          label="Lowongan Aktif"
          value={jobs.length}
          hint="Manual & sinkronisasi AI"
          tone="success"
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5" />}
          label="Siswa Terpetakan AI"
          value={SISWA_TERPETAKAN_AI}
          hint="Asesmen & rekomendasi karier"
          tone="warning"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Lowongan Terbaru</h3>
            </div>
            <button
              onClick={() => setActiveTab("lowongan")}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Kelola
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobsLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted">
                <Loader2 className="h-5 w-5 animate-spin" />
                Memuat lowongan...
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                title="Belum Ada Lowongan"
                message="Gunakan menu Kelola Lowongan untuk menambah lowongan manual atau sinkronisasi AI."
              />
            ) : (
              jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-3 rounded-xl border border-border-light p-3.5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-primary">
                    {job.logo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">{job.title}</p>
                    <p className="truncate text-xs text-muted">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <Badge tone="success">{job.type}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center gap-2">
            <UserRound className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">
              Distribusi Kesiapan Siswa
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(countByStatus) as KesiapanStatus[]).map((s) => (
                <div
                  key={s}
                  className="rounded-xl border border-border-light p-3 text-center"
                >
                  <p className="text-lg font-bold text-slate-900">{countByStatus[s]}</p>
                  <p className="text-xs text-muted">{s}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-4">
              {(Object.keys(countByStatus) as KesiapanStatus[]).map((s) => (
                <div key={s}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{s}</span>
                    <span className="text-xs text-muted">{statusProgress(s)}%</span>
                  </div>
                  <ProgressBar value={statusProgress(s)} tone={statusTone[s] === "success" ? "success" : statusTone[s] === "warning" ? "warning" : "primary"} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const kelolaLowongan = (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-slate-900">Daftar Lowongan</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => setManualOpen(true)}>
              <Plus className="h-4 w-4" />
              Tambah Manual
            </Button>
            <Button variant="secondary" size="sm" onClick={openSync}>
              <Sparkles className="h-4 w-4" />
              Sync Lowongan AI
            </Button>
          </div>
        </CardHeader>
        {jobsLoading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-16 text-sm text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            Memuat lowongan...
          </div>
        ) : jobsError ? (
          <div className="p-6 text-sm text-danger">{jobsError}</div>
        ) : jobs.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="Belum Ada Lowongan"
              message="Tambahkan lowongan secara manual atau lakukan sinkronisasi AI untuk mengisi daftar lowongan."
            />
          </div>
        ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border-light bg-accent-soft/50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-semibold">Perusahaan</th>
                    <th className="px-4 py-3 font-semibold">Posisi</th>
                    <th className="px-4 py-3 font-semibold">Target Jurusan</th>
                    <th className="px-4 py-3 font-semibold">Lokasi</th>
                    <th className="px-4 py-3 font-semibold">Tipe</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-border-light last:border-0 hover:bg-accent-soft/40"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-primary">
                            {job.logo}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900">{job.company}</p>
                            {job.bkkVerified && (
                              <p className="text-xs text-primary">Terverifikasi BKK</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-900">{job.title}</p>
                        <p className="text-xs text-muted">{job.posted}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex max-w-[220px] flex-wrap gap-1.5">
                          {job.jurusan && job.jurusan.length > 0 ? (
                            job.jurusan.map((j) => (
                              <Badge key={j} tone="neutral">
                                {j}
                              </Badge>
                            ))
                          ) : (
                            <Badge tone="neutral">Semua</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {job.location}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone="accent">{job.type}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge tone="success" dot>
                          Aktif
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Card>
    </div>
  );

  const dataSiswa = (
    <div>
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900">Daftar Siswa per Jurusan</h3>
          <Badge tone="primary">
            Menampilkan {DATA_SISWA.length} dari {TOTAL_SISWA} siswa
          </Badge>
        </CardHeader>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-light bg-accent-soft/50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">NIS</th>
                  <th className="px-4 py-3 font-semibold">Jurusan</th>
                  <th className="px-4 py-3 font-semibold">Status Kesiapan Karier</th>
                </tr>
              </thead>
              <tbody>
                {DATA_SISWA.map((s) => (
                  <tr
                    key={s.nis}
                    className="border-b border-border-light last:border-0 hover:bg-accent-soft/40"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
                          {s.nama
                            .split(" ")
                            .slice(0, 2)
                            .map((w) => w[0])
                            .join("")}
                        </span>
                        <span className="font-medium text-slate-900">{s.nama}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{s.nis}</td>
                    <td className="px-4 py-3.5">
                      <Badge tone="neutral">{s.jurusan}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge tone={statusTone[s.status]} dot>
                        {s.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Card>
    </div>
  );

  const content =
    activeTab === "ringkasan"
      ? ringkasan
      : activeTab === "lowongan"
      ? kelolaLowongan
      : dataSiswa;

  const sectionTitles: Record<Tab, { title: string; desc: string }> = {
    ringkasan: {
      title: "Ringkasan",
      desc: "Pantau aktivitas karier siswa dan lowongan dalam satu pandangan.",
    },
    lowongan: {
      title: "Kelola Lowongan",
      desc: "Tambahkan lowongan secara manual atau sinkronkan otomatis dari AI.",
    },
    siswa: {
      title: "Data Siswa",
      desc: "Kesiapan karier siswa per jurusan di SMKN 1 Tengaran.",
    },
  };

  return (
    <div className="flex min-h-screen bg-accent-soft">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border-light bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border-light px-5">
          <Logo href="/" />
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 border-b border-border-light px-5 py-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            AD
          </span>
          <div className="text-center">
            <p className="font-semibold text-slate-900">Admin XSata</p>
            <p className="text-xs text-muted">Administrator Platform</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-accent hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-border-light p-3">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-accent hover:text-primary"
          >
            <Home className="h-5 w-5" />
            Halaman Utama
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-light bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden text-sm text-slate-500 lg:block">
              Portal{" "}
              <span className="font-semibold text-primary">XSata Career</span> —{" "}
              <span className="font-medium text-slate-600">Dasbor Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
            </button>
            <LinkButton href="/" variant="outline" size="sm">
              <Home className="h-4 w-4" />
              Beranda
            </LinkButton>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {sectionTitles[activeTab].title}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {sectionTitles[activeTab].desc}
              </p>
            </div>
          </div>

          {content}
        </main>
      </div>

      <Modal
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        title="Tambah Lowongan Manual"
      >
        <form onSubmit={submitManual} className="space-y-4 p-5">
          <Input
            label="Nama Perusahaan"
            id="company"
            placeholder="mis. PT Mitra Digital"
            value={manualForm.company}
            onChange={(e) =>
              setManualForm((prev) => ({ ...prev, company: e.target.value }))
            }
            icon={<Building2 className="h-4 w-4" />}
          />
          <Input
            label="Posisi"
            id="title"
            placeholder="mis. Staff IT Support"
            value={manualForm.title}
            onChange={(e) =>
              setManualForm((prev) => ({ ...prev, title: e.target.value }))
            }
            icon={<Briefcase className="h-4 w-4" />}
          />
          <Select
            label="Target Jurusan SMK"
            id="jurusan"
            value={manualForm.jurusan}
            onChange={(e) =>
              setManualForm((prev) => ({ ...prev, jurusan: e.target.value }))
            }
          >
            <option value="">Pilih jurusan...</option>
            <option value="Semua Jurusan">Semua Jurusan</option>
            {JURUSAN_LIST.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </Select>
          <Input
            label="Lokasi"
            id="location"
            placeholder="mis. Semarang, Jawa Tengah"
            value={manualForm.location}
            onChange={(e) =>
              setManualForm((prev) => ({ ...prev, location: e.target.value }))
            }
            icon={<MapPin className="h-4 w-4" />}
          />

          {manualError && (
            <p className="rounded-xl bg-danger-soft p-3 text-sm text-danger">
              {manualError}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setManualOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={manualSubmitting}
            >
              {manualSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Simpan Lowongan
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={syncOpen}
        onClose={() => setSyncOpen(false)}
        title="Sync Lowongan AI"
      >
        <div className="p-5">
          {syncPhase === "loading" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="relative flex h-16 w-16 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white">
                  <Sparkles className="h-6 w-6" />
                </span>
              </span>
              <p className="max-w-xs text-sm text-muted">
                Mencari lowongan SMK relevan dari internet...
              </p>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {syncError ? (
                <p className="rounded-xl bg-danger-soft p-3 text-sm text-danger">
                  {syncError}
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-xl bg-success-soft p-3 text-sm text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>
                      Berhasil menambahkan {syncedJobs.length} lowongan baru dari
                      sinkronisasi AI.
                    </span>
                  </div>
                  <div className="space-y-2">
                    {syncedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center gap-3 rounded-xl border border-border-light p-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-primary">
                          {job.logo}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-900">
                            {job.title}
                          </p>
                          <p className="truncate text-xs text-muted">
                            {job.company} • {job.location}
                          </p>
                        </div>
                        <Badge tone="success">{job.type}</Badge>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex justify-end">
                <Button variant="primary" onClick={() => setSyncOpen(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}