"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  BarChart3,
  RotateCcw,
  Lightbulb,
  GraduationCap,
  Briefcase,
  Layers,
  TrendingUp,
  ListChecks,
  Cpu,
  MessageSquare,
  Target,
  MapPin,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import {
  questions,
  dimensionMeta,
  pathwayMeta,
  kesiapanLabels,
  buildResult,
  saveAsesmen,
  clearAsesmen,
  type DimensionKey,
  type PathwayKey,
  type KesiapanKey,
  type AsesmenResult,
} from "@/lib/asesmen";

const pathwayIcons: Record<PathwayKey, typeof GraduationCap> = {
  kuliah: GraduationCap,
  kerja: Briefcase,
  "kerja-kuliah": Layers,
  wirausaha: TrendingUp,
};

const kesiapanIcons: Record<KesiapanKey, typeof Cpu> = {
  eksplorasi: Cpu,
  komunikasi: MessageSquare,
  ketelitian: Target,
  mobilitas: MapPin,
};

export default function AsesmenPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AsesmenResult | null>(null);

  const total = questions.length;
  const question = questions[step];
  const selected = answers[step];
  const progress = (step / total) * 100;

  function selectOption(index: number) {
    setAnswers((prev) => ({ ...prev, [step]: index }));
  }

  function next() {
    if (step < total - 1) {
      setStep((s) => s + 1);
      return;
    }
    const finalResult = buildResult(answers);
    setResult(finalResult);
    saveAsesmen({ answers, result: finalResult, updatedAt: new Date().toISOString() });
  }

  function restart() {
    clearAsesmen();
    setAnswers({});
    setStep(0);
    setResult(null);
  }

  if (result) {
    const PathwayIcon = pathwayIcons[result.pathway];
    return (
      <DashboardShell role="siswa">
        <PageHeader
          title="Hasil Asesmen Minat & Bakat"
          description="Ringkasan analisis minat, bakat, jalur pasca-lulus, dan rekomendasi karier berdasarkan 10 jawabanmu."
        />

        <Card className="mx-auto max-w-3xl overflow-hidden">
          <div className="bg-primary p-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-7 w-7 text-white" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-white">
              Profil Karier Utama: {dimensionMeta[result.top].label}
            </h2>
            <p className="mt-1 text-accent">
              Kecocokan Tinggi • {result.match}%
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge tone="primary">{dimensionMeta[result.top].label}</Badge>
              <Badge tone="success">{dimensionMeta[result.second].label}</Badge>
              <Badge tone="warning">{pathwayMeta[result.pathway].label}</Badge>
            </div>
          </div>

          <CardContent className="space-y-6 p-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-slate-900">Skor Minat & Bakat</h3>
              </div>
              <div className="mt-4 space-y-4">
                {result.ranking.map((key: DimensionKey) => (
                  <div key={key}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{dimensionMeta[key].label}</span>
                      <span className="font-semibold text-primary">{result.scores[key]}%</span>
                    </div>
                    <ProgressBar
                      value={result.scores[key]}
                      tone={result.scores[key] >= 80 ? "success" : "primary"}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { key: "eksplorasi" as KesiapanKey },
                { key: "komunikasi" as KesiapanKey },
                { key: "ketelitian" as KesiapanKey },
                { key: "mobilitas" as KesiapanKey },
              ].map(({ key }) => {
                const Icon = kesiapanIcons[key];
                return (
                  <div key={key} className="rounded-xl rounded-t-2xl border border-border-light p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                        <Icon className="h-4 w-4 text-primary" />
                      </span>
                      <p className="text-sm font-semibold text-slate-700">{kesiapanLabels[key]}</p>
                    </div>
                    <ProgressBar
                      value={result.kesiapan[key]}
                      tone={result.kesiapan[key] >= 80 ? "success" : "primary"}
                    />
                    <p className="mt-1.5 text-right text-xs font-semibold text-primary">
                      {result.kesiapan[key]}%
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl bg-accent p-5">
              <div className="flex items-center gap-2">
                <PathwayIcon className="h-5 w-5 text-warning" />
                <p className="font-semibold text-primary">
                  Jalur Pasca-Lulus: {pathwayMeta[result.pathway].label}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{result.pathwayReason}</p>
            </div>

            <div className="rounded-xl bg-accent p-5">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                <p className="font-semibold text-primary">
                  Rekomendasi Karier & Jurusan {dimensionMeta[result.top].label}
                </p>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  {dimensionMeta[result.top].careers.slice(0, 3).join(", ")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  Cocok dengan jurusan SMK: {dimensionMeta[result.top].jurusan.join(", ")}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  {dimensionMeta[result.top].skillTip}
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-border-light bg-white p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="font-semibold text-slate-900">Rekomendasi AI Berdasarkan Jawabanmu</p>
              </div>
              <ul className="mt-3 space-y-2.5">
                {result.recommendations.map((rec) => (
                  <li key={rec} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border-light bg-white p-5">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                <p className="font-semibold text-slate-900">Analisis Jawaban ({total} Soal)</p>
              </div>
              <div className="mt-3 space-y-2">
                {result.answerSummary.map((item, index) => (
                  <div key={item.prompt} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-primary">
                      Soal {index + 1} • {item.kategori}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">{item.prompt}</p>
                    <p className="mt-1 text-sm text-slate-600">→ {item.selected}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={restart}>
                <RotateCcw className="h-4 w-4" />
                Ulangi Asesmen
              </Button>
              <Link href="/interview">
                <Button variant="primary" className="w-full sm:w-auto">
                  <BarChart3 className="h-4 w-4" />
                  Lihat Rapor Kesiapan Karier
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="siswa">
      <PageHeader
        title="Asesmen Minat & Bakat"
        description="Jawab dengan jujur 10 pertanyaan untuk hasil yang akurat."
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

          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {question.kategori}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{question.prompt}</h2>

          <div className="mt-5 space-y-2.5">
            {question.options.map((option, index) => {
              const isSelected = selected === index;
              return (
                <button
                  key={option.label}
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
                  {option.label}
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