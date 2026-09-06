"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  BarChart3,
  RotateCcw,
  Lightbulb,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

const questions = [
  {
    prompt: "Saat mengerjakan proyek kelompok, saya paling menikmati...",
    options: ["Merancang tampilan dan desain", "Menganalisis data dan angka", "Mengorganisir anggota tim", "Menulis laporan dan komunikasi"],
  },
  {
    prompt: "Saya paling puas ketika berhasil...",
    options: ["Menciptakan karya yang menarik secara visual", "Memecahkan masalah teknis yang rumit", "Membantu orang lain memahami sesuatu", "Mengelola jadwal dan prioritas"],
  },
  {
    prompt: "Dalam bekerja, saya cenderung lebih suka...",
    options: ["Bekerja dengan ketelitian dan detail", "Bekerja dengan orang banyak", "Bekerja dengan teknologi dan sistem", "Bekerja secara kreatif dan bebas"],
  },
  {
    prompt: "Tugas yang paling saya kuasai di sekolah adalah...",
    options: ["Proyek praktik dan bengkel", "Presentasi di depan kelas", "Pengolahan data dan laporan", "Desain grafis dan media"],
  },
  {
    prompt: "Untuk masa depan, saya lebih tertarik pada bidang...",
    options: ["Teknologi & pemrograman", "Bisnis & administrasi", "Desain & kreatif", "Pelayanan & pendidikan"],
  },
];

export default function AsesmenPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const question = questions[step];
  const selected = answers[step];
  const progress = ((step + (finished ? 1 : 0)) / total) * 100;

  function selectOption(index: number) {
    setAnswers((prev) => ({ ...prev, [step]: index }));
  }

  function next() {
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <DashboardShell role="siswa" username="Andini Putri" userRole="Siswa SMK • RPL">
        <PageHeader
          title="Hasil Asesmen Minat & Bakat"
          description="Berikut hasil analisis minat dan bakat berdasarkan jawabanmu."
        />

        <Card className="mx-auto max-w-3xl overflow-hidden">
          <div className="bg-primary p-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-7 w-7 text-white" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white">
              Profil Karier Utama: UI/UX Designer
            </h2>
            <p className="mt-1 text-accent">Kecocokan Tinggi • 92%</p>
          </div>

          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap justify-center gap-2">
              <Badge tone="primary">Desain</Badge>
              <Badge tone="primary">Teknologi</Badge>
              <Badge tone="success">Kreatif</Badge>
              <Badge tone="warning">Kolaboratif</Badge>
            </div>

            <div className="space-y-4">
              {[
                { label: "Desain & Kreativitas", value: 92 },
                { label: "Teknologi & Logika", value: 87 },
                { label: "Komunikasi & Kerja Tim", value: 82 },
                { label: "Kepemimpinan", value: 68 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="font-semibold text-primary">{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} tone={item.value >= 80 ? "success" : "primary"} />
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-accent p-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                <p className="font-semibold text-primary">Rekomendasi Jurusan & Karier</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  UI/UX Designer, Frontend Developer, Product Designer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  Cocok dengan jurusan RPL dan Multimedia
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  Disarankan memperkuat skill Figma, HTML/CSS, dan usability testing
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4" />
                Ulangi Asesmen
              </Button>
              <Button variant="primary">
                <BarChart3 className="h-4 w-4" />
                Lihat Detail Laporan
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="siswa" username="Andini Putri" userRole="Siswa SMK • RPL">
      <PageHeader
        title="Asesmen Minat & Bakat"
        description="Jawab dengan jujur setiap pertanyaan untuk hasil yang akurat."
      />

      <Card className="mx-auto max-w-2xl">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-semibold text-slate-700">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                Pertanyaan {step + 1} dari {total}
              </span>
              <span className="text-muted">{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} className="mt-2" />
          </div>

          <h2 className="text-lg font-semibold text-slate-900">{question.prompt}</h2>

          <div className="mt-5 space-y-2.5">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              return (
                <button
                  key={option}
                  onClick={() => selectOption(index)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-accent text-primary"
                      : "border-border-light bg-white text-slate-700 hover:border-primary/40 hover:bg-accent-soft"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Kembali
            </Button>
            <Button variant="primary" onClick={next} disabled={selected === undefined}>
              {step === total - 1 ? "Lihat Hasil" : "Lanjut"}
              {step < total - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
