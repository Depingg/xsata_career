import type { Metadata } from "next";
import { Clock, ChevronLeft, ChevronRight, Plus, MapPin } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Jadwal Konseling",
};

const schedule = [
  { time: "08:00", student: "Dimas Adit", topic: "Evaluasi Rencana Karier", room: "R. BK 1", status: "Selesai" },
  { time: "09:30", student: "Andini Putri", topic: "Persiapan Interview Kerja", room: "R. BK 1", status: "Akan datang" },
  { time: "11:00", student: "Rizky Pratama", topic: "Pemetaan Karier", room: "R. BK 2", status: "Akan datang" },
  { time: "13:30", student: "Siti Rahma", topic: "Konsultasi Jurusan", room: "R. BK 1", status: "Akan datang" },
];

export default function JadwalPage() {
  return (
    <DashboardShell role="guru" username="Bu Ratna Dewi" userRole="Guru BK • SMK Negeri 1">
      <PageHeader
        title="Jadwal Konseling"
        description="Kelola jadwal bimbingan konseling siswa."
        actions={
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Jadwalkan Baru
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="flex items-center justify-between p-4">
          <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="Bulan sebelumnya">
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div className="min-w-0 text-center">
            <p className="truncate font-semibold text-slate-900">September 2026</p>
            <p className="truncate text-xs text-muted">Senin, 8 September 2026</p>
          </div>
          <button className="rounded-lg p-2 hover:bg-slate-100" aria-label="Bulan berikutnya">
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {schedule.map((s) => (
          <Card key={s.student} className="transition-all hover:border-primary/40">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 sm:w-36">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold text-slate-900">{s.time}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{s.student}</h3>
                  <Badge tone={s.status === "Selesai" ? "neutral" : "accent"} dot>
                    {s.status}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">{s.topic}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
                <span className="flex items-center gap-1.5 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  {s.room}
                </span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm">Detail</Button>
                  <Button variant="outline" size="sm">Batal</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  );
}
