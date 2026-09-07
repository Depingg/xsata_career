"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Star,
  Briefcase,
  Phone,
  Mail,
  Trash2,
  Handshake,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { MAJOR_CODES } from "@/lib/jurusan";

interface Mitra {
  id: number;
  nama: string;
  bidang: string;
  lokasi: string;
  kontak: string;
  email: string;
  jurusan: string;
  jumlahSiswa: number;
  rating: number;
  rekomendasi: boolean;
}

const seed: Mitra[] = [
  { id: 1, nama: "PT Maju Bersama", bidang: "Teknologi Informasi", lokasi: "Semarang", kontak: "0852 0000 1111", email: "hrd@majubersama.co.id", jurusan: "TKJ", jumlahSiswa: 12, rating: 4.5, rekomendasi: true },
  { id: 2, nama: "Studio Kreatif ID", bidang: "Desain & Kreatif", lokasi: "Salatiga", kontak: "0812 3333 4444", email: "career@studiokreatif.id", jurusan: "RPL", jumlahSiswa: 8, rating: 4.0, rekomendasi: true },
  { id: 3, nama: "Astra Daihatsu Motor", bidang: "Otomotif", lokasi: "Surakarta", kontak: "0271 555 6666", email: "recruitment@astra.co.id", jurusan: "TKR", jumlahSiswa: 20, rating: 4.8, rekomendasi: false },
  { id: 4, nama: "Kedai Kopi Nusantara", bidang: "Tata Boga", lokasi: "Tengaran", kontak: "0813 7777 8888", email: "info@kedaikopi.id", jurusan: "Tata Boga", jumlahSiswa: 6, rating: 4.2, rekomendasi: true },
];

const emptyForm = {
  nama: "",
  bidang: "",
  lokasi: "",
  kontak: "",
  email: "",
  jurusan: "TKJ" as string,
  jumlahSiswa: 0,
  rating: 4,
  rekomendasi: true,
};

export default function DataMitraPage() {
  const [mitra, setMitra] = useState<Mitra[]>(seed);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  function updateForm<K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nama.trim() || !form.bidang.trim()) return;
    setMitra((prev) => [
      ...prev,
      { ...form, id: prev.length ? Math.max(...prev.map((m) => m.id)) + 1 : 1 },
    ]);
    setMessage(`Mitra "${form.nama}" berhasil ditambahkan.`);
    setForm(emptyForm);
  }

  function remove(id: number) {
    setMitra((prev) => prev.filter((m) => m.id !== id));
    setMessage("");
  }

  function toggleRekomendasi(id: number) {
    setMitra((prev) =>
      prev.map((m) => (m.id === id ? { ...m, rekomendasi: !m.rekomendasi } : m))
    );
    setMessage("");
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? mitra.filter(
        (m) =>
          m.nama.toLowerCase().includes(q) ||
          m.bidang.toLowerCase().includes(q) ||
          m.lokasi.toLowerCase().includes(q) ||
          m.jurusan.toLowerCase().includes(q)
      )
    : mitra;

  const rekomendasi = mitra.filter((m) => m.rekomendasi).length;
  const totalKuota = mitra.reduce((s, m) => s + m.jumlahSiswa, 0);

  return (
    <DashboardShell role="guru">
      <PageHeader
        title="Data Mitra & Rekomendasi"
        description="Kelola data mitra industri beserta rekomendasi magang / kerja untuk siswa."
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Tambah Mitra
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Total Mitra</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{mitra.length}</p>
              <p className="mt-1 text-xs text-muted">Perusahaan mitra</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
              <Building2 className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Rekomendasi Aktif</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{rekomendasi}</p>
              <p className="mt-1 text-xs text-muted">Direkomendasikan</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-success-soft text-success">
              <Handshake className="h-5 w-5" />
            </span>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted">Kuota Siswa</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{totalKuota}</p>
              <p className="mt-1 text-xs text-muted">Penempatan magang</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-warning-soft text-warning">
              <Briefcase className="h-5 w-5" />
            </span>
          </div>
        </Card>
      </div>

      {message && (
        <div className="mt-6 rounded-xl bg-success-soft p-4 text-sm text-emerald-700">{message}</div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-slate-900">Tambah Mitra Industri</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-3.5">
              <Input
                label="Nama Mitra / Perusahaan"
                id="nama"
                required
                value={form.nama}
                onChange={(e) => updateForm("nama", e.target.value)}
                placeholder="cth. PT Maju Bersama"
              />
              <Input
                label="Bidang Industri"
                id="bidang"
                required
                value={form.bidang}
                onChange={(e) => updateForm("bidang", e.target.value)}
                placeholder="cth. Teknologi Informasi"
              />
              <Input
                label="Lokasi"
                id="lokasi"
                value={form.lokasi}
                onChange={(e) => updateForm("lokasi", e.target.value)}
                placeholder="cth. Semarang"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Kontak"
                  id="kontak"
                  value={form.kontak}
                  onChange={(e) => updateForm("kontak", e.target.value)}
                  placeholder="No. telepon"
                />
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
                label="Email"
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                placeholder="hrd@perusahaan.co.id"
              />
              <Button type="submit" size="sm" className="w-full">
                <Plus className="h-4 w-4" />
                Simpan Mitra
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-semibold text-slate-900">Daftar Mitra ({filtered.length})</h3>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari mitra..."
                className="h-10 w-full rounded-xl border border-border-light bg-white pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
              />
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {filtered.length === 0 ? (
              <EmptyState message="Belum ada data mitra. Gunakan form untuk menambahkan mitra industri." />
            ) : (
              <div className="space-y-3">
                {filtered.map((m) => (
                  <div key={m.id} className="rounded-xl border border-border-light p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-primary">
                          {m.nama.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-900">{m.nama}</p>
                            {m.rekomendasi && (
                              <Badge tone="success">
                                <Star className="h-3 w-3 fill-current" />
                                Rekomendasi
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted">{m.bidang} • {m.jurusan}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone="accent">{m.rating}★</Badge>
                        <Button
                          variant={m.rekomendasi ? "outline" : "secondary"}
                          size="sm"
                          onClick={() => toggleRekomendasi(m.id)}
                        >
                          {m.rekomendasi ? "Hapus Rekomendasi" : "Rekomendasikan"}
                        </Button>
                        <button
                          onClick={() => remove(m.id)}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Hapus mitra"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-3">
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" />{m.lokasi}</span>
                      <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" />{m.kontak}</span>
                      <span className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-slate-400" />{m.email}</span>
                    </div>
                    <div className="mt-2 border-t border-border-light pt-2 text-sm text-slate-600">
                      Kuota rekomendasi magang: <b className="text-primary">{m.jumlahSiswa} siswa</b>
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
