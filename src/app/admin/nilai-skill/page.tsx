"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, ClipboardCheck, Search, Trash2, GraduationCap, Award } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { MAJOR_CODES } from "@/lib/jurusan";

interface NilaiSkill {
  id: number;
  nama: string;
  kelas: string;
  jurusan: string;
  skill: string;
  nilai: number;
}

const seed: NilaiSkill[] = [
  { id: 1, nama: "Nanda", kelas: "XII TKJ 1", jurusan: "TKJ", skill: "Konfigurasi Jaringan", nilai: 88 },
  { id: 2, nama: "Rizky Pratama", kelas: "XII TKJ 2", jurusan: "TKJ", skill: "Pemrograman Web", nilai: 75 },
  { id: 3, nama: "Siti Rahma", kelas: "XI RPL 1", jurusan: "RPL", skill: "UI/UX Design", nilai: 80 },
  { id: 4, nama: "Dimas Adit", kelas: "XII Tata Boga 1", jurusan: "Tata Boga", skill: "Pengolahan Makanan", nilai: 90 },
  { id: 5, nama: "Nadia Sari", kelas: "XII Tata Busana 1", jurusan: "Tata Busana", skill: "Desain Pola", nilai: 70 },
];

const emptyForm = {
  nama: "",
  kelas: "XII TKJ 1",
  jurusan: "TKJ",
  skill: "",
  nilai: 80,
};

export default function NilaiSkillPage() {
  const [records, setRecords] = useState<NilaiSkill[]>(seed);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");

  function updateForm<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.skill.trim()) return;
    setRecords((prev) => [
      ...prev,
      { ...form, id: prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1 },
    ]);
    setForm(emptyForm);
  }

  function remove(id: number) {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? records.filter(
        (r) =>
          r.nama.toLowerCase().includes(q) ||
          r.kelas.toLowerCase().includes(q) ||
          r.skill.toLowerCase().includes(q)
      )
    : records;

  const rataRata = records.length
    ? Math.round(records.reduce((s, r) => s + r.nilai, 0) / records.length)
    : 0;
  const lulus = records.filter((r) => r.nilai >= 75).length;

  return (
    <DashboardShell role="guru">
      <PageHeader
        title="Input Nilai & Skill Praktikum"
        description="Input dan kelola nilai serta kompetensi skill praktikum siswa."
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Input Nilai Baru
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Penilaian</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{records.length}</p>
              <p className="mt-1 text-xs text-muted">Seluruh siswa</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <ClipboardCheck className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Nilai Rata-rata</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{rataRata}</p>
              <p className="mt-1 text-xs text-muted">Skor praktikum</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <Award className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Lulus (KKM 75)</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{lulus}</p>
              <p className="mt-1 text-xs text-muted">{records.length ? Math.round((lulus / records.length) * 100) : 0}% siswa</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <GraduationCap className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Input Nilai & Skill</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3.5">
              <Input
                label="Nama Siswa"
                id="nama"
                required
                value={form.nama}
                onChange={(e) => updateForm("nama", e.target.value)}
                placeholder="cth. Ahmad Fauzi"
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Kelas"
                  id="kelas"
                  value={form.kelas}
                  onChange={(e) => updateForm("kelas", e.target.value)}
                >
                  {["X TKJ 1", "XI TKJ 1", "XII TKJ 1", "XI RPL 1", "XII RPL 1", "XI Tata Boga 1", "XII Tata Boga 1", "XII Tata Busana 1"].map(
                    (k) => (
                      <option key={k} value={k}>{k}</option>
                    )
                  )}
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
                label="Nama Skill / Kompetensi"
                id="skill"
                required
                value={form.skill}
                onChange={(e) => updateForm("skill", e.target.value)}
                placeholder="cth. Konfigurasi Jaringan"
              />
              <Select
                label="Nilai Praktikum (0–100)"
                id="nilai"
                value={form.nilai}
                onChange={(e) => updateForm("nilai", Number(e.target.value))}
              >
                {Array.from({ length: 21 }, (_, i) => (i * 5)).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </Select>
              <Button type="submit" size="sm" className="w-full">
                <Plus className="h-4 w-4" />
                Simpan Penilaian
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-slate-900">Daftar Penilaian ({filtered.length})</h3>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari siswa, kelas, atau skill..."
                className="h-10 w-full rounded-xl border border-border-light bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState message="Belum ada data penilaian. Gunakan form di samping untuk menambahkan." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border-light text-xs uppercase tracking-wide text-muted">
                      <th className="px-5 py-3 font-semibold">Siswa</th>
                      <th className="px-5 py-3 font-semibold">Skill</th>
                      <th className="px-5 py-3 font-semibold">Jurusan</th>
                      <th className="px-5 py-3 font-semibold">Nilai</th>
                      <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-b border-border-light last:border-0 hover:bg-accent-soft">
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-900">{r.nama}</p>
                          <p className="text-xs text-muted">{r.kelas}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{r.skill}</td>
                        <td className="px-5 py-3 text-slate-600">{r.jurusan}</td>
                        <td className="px-5 py-3">
                          <Badge tone={r.nilai >= 75 ? "success" : "danger"} dot>
                            {r.nilai}
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => remove(r.id)}
                            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                            aria-label="Hapus penilaian"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
