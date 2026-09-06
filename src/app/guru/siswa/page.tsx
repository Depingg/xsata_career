import type { Metadata } from "next";
import Link from "next/link";
import { Search, Users, Mail, MoreHorizontal, UserPlus } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export const metadata: Metadata = {
  title: "Kelola Siswa",
};

interface Student {
  name: string;
  kelas: string;
  jurusan: string;
  progress: number;
  status: "Aktif" | "Perlu perhatian";
}

const students: Student[] = [
  { name: "Nanda", kelas: "XII", jurusan: "TKJ", progress: 85, status: "Aktif" },
  { name: "Rizky Pratama", kelas: "XII", jurusan: "TKJ", progress: 45, status: "Perlu perhatian" },
  { name: "Siti Rahma", kelas: "XI", jurusan: "MM", progress: 60, status: "Aktif" },
  { name: "Dimas Adit", kelas: "XII", jurusan: "AKL", progress: 90, status: "Aktif" },
  { name: "Nadia Sari", kelas: "XII", jurusan: "AP", progress: 30, status: "Perlu perhatian" },
];

export default function KelolaSiswaPage() {
  return (
    <DashboardShell role="guru" username="Bu Ratna Dewi" userRole="Guru BK • SMK Negeri 1">
      <PageHeader
        title="Kelola Siswa"
        description="Pantau dan kelola bimbingan karier siswa binaan."
        actions={
          <Button variant="primary" size="sm">
            <UserPlus className="h-4 w-4" />
            Tambah Siswa
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border-light p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Cari nama siswa atau kelas..."
                className="h-10 w-full rounded-xl border border-border-light bg-white pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Users className="h-4 w-4" />
              248 siswa
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border-light bg-accent-soft text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                  <th className="px-4 py-3 font-semibold">Kelas</th>
                  <th className="px-4 py-3 font-semibold">Jurusan</th>
                  <th className="px-4 py-3 font-semibold">Progres Asesmen</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.name} className="border-b border-border-light last:border-0 hover:bg-accent-soft/40">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                          {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                        </span>
                        <span className="font-medium text-slate-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{s.kelas}</td>
                    <td className="px-4 py-4 text-slate-600">{s.jurusan}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={s.progress} className="w-24" />
                        <span className="text-xs font-semibold text-slate-700">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone={s.status === "Aktif" ? "success" : "danger"} dot>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href="/guru/pesan"
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-accent hover:text-primary"
                          aria-label="Kirim pesan"
                        >
                          <Mail className="h-4 w-4" />
                        </Link>
                        <button
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-accent hover:text-primary"
                          aria-label="Opsi lainnya"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
