import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Search,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Materi & Panduan",
};

const categories = ["Semua", "Karier", "Persiapan Kerja", "Kuliah", "Skill Digital"];

const materials = [
  { icon: FileText, title: "Panduan Membuat CV & Portofolio", cat: "Persiapan Kerja", read: "10 menit", type: "PDF" },
  { icon: Video, title: "Tips Sukses Wawancara Kerja", cat: "Persiapan Kerja", read: "15 menit", type: "Video" },
  { icon: BookOpen, title: "Mengenal Jalur Karier di Bidang IT", cat: "Karier", read: "12 menit", type: "Artikel" },
  { icon: BookOpen, title: "Kuliah vs Kerja: Mana yang Tepat untukmu?", cat: "Karier", read: "8 menit", type: "Artikel" },
  { icon: FileText, title: "Dasar-Dasar Figma untuk Desainer Pemula", cat: "Skill Digital", read: "20 menit", type: "PDF" },
  { icon: Video, title: "Persiapan Beasiswa & Perguruan Tinggi", cat: "Kuliah", read: "18 menit", type: "Video" },
];

export default function MateriPage() {
  return (
    <DashboardShell role="siswa" username="Nanda" userRole="Siswa SMK • TKJ">
      <PageHeader
        title="Materi & Panduan"
        description="Pelajari panduan dan materi bimbingan karier sesuai kebutuhanmu."
      />

      <div className="mb-5">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Cari materi atau panduan..."
            className="h-11 w-full rounded-xl border border-border-light bg-white pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((c, i) => (
          <button
            key={c}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              i === 0
                ? "bg-primary text-white"
                : "border border-border-light bg-white text-slate-600 hover:border-primary hover:text-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map(({ icon: Icon, title, cat, read, type }) => (
          <Card key={title} className="transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <Badge tone="neutral">{type}</Badge>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs text-muted">{cat} • {read}</p>
              <Link
                href="/#layanan"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Baca
                <Download className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
