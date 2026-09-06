import type { Metadata } from "next";
import { FileBarChart, Download, TrendingUp, Users, BadgeCheck, Briefcase } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export const metadata: Metadata = {
  title: "Laporan & Analitik",
};

export default function LaporanPage() {
  return (
    <DashboardShell role="guru" username="Bu Ratna Dewi" userRole="Guru BK • SMK Negeri 1">
      <PageHeader
        title="Laporan & Analitik"
        description="Ringkasan statistik bimbingan karier siswa."
        actions={
          <Button variant="primary" size="sm">
            <Download className="h-4 w-4" />
            Unduh Laporan
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Bimbingan" value="1.248" hint="Semester ini" icon={<FileBarChart className="h-5 w-5" />} tone="primary" />
        <StatCard label="Siswa Aktif" value="64%" hint="Dari 248 siswa" icon={<Users className="h-5 w-5" />} tone="success" />
        <StatCard label="Selesai Asesmen" value="72%" hint="178 siswa" icon={<BadgeCheck className="h-5 w-5" />} tone="warning" />
        <StatCard label="Siap Magang/Kerja" value="48%" hint="119 siswa" icon={<Briefcase className="h-5 w-5" />} tone="danger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend chart placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-slate-900">Tren Bimbingan (Per Bulan)</h3>
            </div>
            <Badge tone="success">+24%</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="flex h-52 min-w-[440px] items-end gap-3 rounded-xl bg-accent-soft p-4">
                {[40, 55, 45, 70, 60, 85, 75, 95].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[10px] font-semibold text-muted">{h}</span>
                    <div
                      className={`w-full rounded-t-md ${i === 7 ? "bg-primary" : "bg-primary/40"}`}
                      style={{ height: `${h}%` }}
                    />
                    <span className="shrink-0 text-[10px] text-muted">{["Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-slate-900">Distribusi Karier Siswa</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Teknologi & IT", value: 34, tone: "primary" as const },
              { label: "Desain & Kreatif", value: 22, tone: "success" as const },
              { label: "Bisnis & Administrasi", value: 26, tone: "warning" as const },
              { label: "Lainnya", value: 18, tone: "danger" as const },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}%</span>
                </div>
                <ProgressBar value={item.value} tone={item.tone} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
