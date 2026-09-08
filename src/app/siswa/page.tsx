import type { Metadata } from "next";
import Link from "next/link";
import { Bot, ClipboardCheck, Sparkles } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StudentGreeting } from "@/components/StudentGreeting";
import { StatCard } from "@/components/ui/StatCard";
import { JobRecommendations } from "@/components/siswa/JobRecommendations";

export const metadata: Metadata = {
  title: "Dasbor Siswa",
};

function StudentDashboardPage() {
  return (
    <DashboardShell role="siswa">
      <StudentGreeting />

      {/* Rekomendasi AI / Profil Karier */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-primary p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Rekomendasi AI
            </span>
            <h2 className="mt-3 text-xl font-bold text-white sm:text-2xl">
              Belum ada rekomendasi profesi karier
            </h2>
            <p className="mt-2 text-sm text-accent">
              Selesaikan Asesmen Minat & Bakat terlebih dahulu untuk melihat profesi
              yang paling cocok denganmu.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/siswa/konsultasi"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
              >
                <Bot className="h-4 w-4" />
                Tanya AI Lebih Lanjut
              </Link>
              <Link
                href="/siswa/asesmen"
                className="inline-flex items-center gap-2 rounded-lg border border-accent/40 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/10"
              >
                <ClipboardCheck className="h-4 w-4" />
                Ulangi Asesmen
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Progres Asesmen Minat"
          value="0%"
          hint="Lengkapi asesmen minat bakat"
          icon={<ClipboardCheck className="h-5 w-5" />}
          tone="primary"
        />
        <StatCard
          label="Konsultasi AI"
          value="0"
          hint="Total sesi tanya jawab dengan AI Karier"
          icon={<Bot className="h-5 w-5" />}
          tone="success"
        />
      </div>

      {/* Rekomendasi Lowongan */}
      <div className="mt-6">
        <JobRecommendations />
      </div>
    </DashboardShell>
  );
}

export default StudentDashboardPage;