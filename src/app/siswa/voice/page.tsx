"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  AudioLines,
  Headset,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";

type Status = "menunggu" | "mendengar" | "berpikir" | "berbicara";

interface LogEntry {
  id: number;
  time: string;
  text: string;
}

const STATUS_META: Record<
  Status,
  { label: string; tone: "neutral" | "primary" | "warning" | "success"; icon: ReactNode }
> = {
  menunggu: {
    label: "Menunggu Suara...",
    tone: "neutral",
    icon: <Mic className="h-4 w-4" />,
  },
  mendengar: {
    label: "Mendengarkan...",
    tone: "primary",
    icon: <AudioLines className="h-4 w-4" />,
  },
  berpikir: {
    label: "AI Berpikir...",
    tone: "warning",
    icon: <Loader2 className="h-4 w-4 animate-spin" />,
  },
  berbicara: {
    label: "AI Berbicara...",
    tone: "success",
    icon: <Volume2 className="h-4 w-4" />,
  },
};

const CYCLE_STEPS = [
  { status: "mendengar" as Status, ms: 2600, log: "Mendengarkan suara Anda..." },
  { status: "berpikir" as Status, ms: 1700, log: "AI memproses pertanyaan Anda..." },
  { status: "berbicara" as Status, ms: 2500, log: "AI menyampaikan jawaban..." },
];

const BAR_COUNT = 28;

const BAR_HEIGHTS = Array.from(
  { length: BAR_COUNT },
  (_, i) => 14 + ((i * 7) % 30)
);

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

function nowTime(): string {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function VoiceConsultationPage() {
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState<Status>("menunggu");
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logIdRef = useRef(0);

  const displayedStatus: Status = active && muted ? "menunggu" : status;
  const animating = active && !muted && status !== "menunggu";

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  useEffect(() => {
    if (!active) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    function pushLog(text: string) {
      logIdRef.current += 1;
      setLogs((prev) =>
        [...prev, { id: logIdRef.current, time: nowTime(), text }].slice(-8)
      );
    }

    function run(i: number) {
      if (cancelled) return;
      const step = CYCLE_STEPS[i % CYCLE_STEPS.length];
      setStatus(step.status);
      pushLog(step.log);
      timer = setTimeout(() => run(i + 1), step.ms);
    }

    timer = setTimeout(() => run(0), 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [active, muted]);

  function startSession() {
    setActive(true);
    setMuted(false);
    setElapsed(0);
    setLogs([]);
    setStatus("mendengar");
    logIdRef.current = 0;
  }

  function toggleMic() {
    if (!active) {
      startSession();
      return;
    }
    setMuted((m) => !m);
  }

  function endSession() {
    setActive(false);
    setMuted(false);
    setStatus("menunggu");
    setElapsed(0);
    setLogs([]);
  }

  const meta = STATUS_META[displayedStatus];

  return (
    <DashboardShell role="siswa">
      <PageHeader
        title="AI Voice Konsultasi"
        description="Sesi percakapan suara secara langsung dengan AI Karier — ucapkan pertanyaanmu, AI akan merespons lisan."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                  <Headset className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">Sesi Suara</h2>
                  <p className="text-xs text-muted">
                    {active ? `Berlangsung · ${formatTime(elapsed)}` : "Belum dimulai"}
                  </p>
                </div>
              </div>
              <Badge tone={meta.tone} dot>
                {meta.label}
              </Badge>
            </CardHeader>

            <CardContent>
              <div
                className={`flex h-40 items-center justify-center gap-1.5 rounded-xl border border-border-light px-6 transition-colors ${
                  animating ? "bg-accent-soft" : "bg-slate-50"
                }`}
              >
                {BAR_HEIGHTS.map((height, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full ${
                      animating
                        ? "animate-[voice-wave_1.2s_ease-in-out_infinite]"
                        : ""
                    }`}
                    style={{
                      height: `${height}px`,
                      backgroundColor: animating ? "#0052cc" : "#cbd5e1",
                      animationDelay: animating ? `${i * 0.07}s` : undefined,
                      opacity: animating ? 1 : 0.5,
                    }}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-border-light px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {active ? "Volume Mikrofon" : "Status Perangkat"}
                  </p>
                  <p className="text-xs text-muted">
                    {active && muted
                      ? "Mikrofon dibisukan — klik tombol untuk melanjutkan sesi."
                      : active
                        ? "Mikrofon aktif — bicaralah dengan jelas."
                        : "Mulai sesi untuk mengaktifkan mikrofon Anda."}
                  </p>
                </div>
                {active ? (
                  muted ? (
                    <VolumeX className="h-5 w-5 text-danger" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-success" />
                  )
                ) : (
                  <Mic className="h-5 w-5 text-muted" />
                )}
              </div>

              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-700">
                  Rekaman Aktivitas Sesi
                </h3>
                {logs.length === 0 ? (
                  <p className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-muted">
                    Belum ada aktivitas. Mulai sesi suara untuk melihat rekaman percakapan.
                  </p>
                ) : (
                  <ul className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
                    {logs.map((log) => (
                      <li
                        key={log.id}
                        className="flex items-center gap-2.5 rounded-lg bg-accent-soft px-3 py-2 text-sm text-slate-700"
                      >
                        <span className="shrink-0 font-mono text-xs text-muted">
                          {log.time}
                        </span>
                        {log.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                variant={active && muted ? "danger" : active ? "success" : "primary"}
                size="lg"
                onClick={toggleMic}
              >
                {active && muted ? (
                  <MicOff className="h-5 w-5" />
                ) : (
                  <Mic className="h-5 w-5" />
                )}
                {!active
                  ? "Mulai Mikrofon"
                  : muted
                    ? "Nyalakan Mikrofon"
                    : "Bisukan Mikrofon"}
              </Button>
              <Button
                variant="danger"
                size="lg"
                onClick={endSession}
                disabled={!active}
              >
                <PhoneOff className="h-5 w-5" />
                Akhiri Sesi Suara
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Cara Menggunakan</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { step: "1", text: "Klik tombol Mulai Mikrofon untuk mengaktifkan sesi suara." },
                { step: "2", text: "Ucapkan pertanyaan karier, misalnya: 'Jurusan apa yang cocok untuk saya?'" },
                { step: "3", text: "AI akan mendengarkan, berpikir, lalu menjawab secara lisan." },
                { step: "4", text: "Gunakan Bisukan Mikrofon untuk jeda, atau Akhiri Sesi Suara untuk berhenti." },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {item.step}
                  </span>
                  <p className="text-sm text-slate-600">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-success-soft bg-success-soft/50">
            <CardContent className="text-sm text-slate-700">
              <p className="font-semibold text-success">
                Fitur Berbasis Suara
              </p>
              <p className="mt-1 text-slate-600">
                Sesi suara melengkapi konsultasi teks dengan pengalaman percakapan
                yang lebih alami — tersedia tanpa biaya untuk seluruh siswa SMKN 1 Tengaran.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}