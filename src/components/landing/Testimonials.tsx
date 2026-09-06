"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Quote,
  MessageSquarePlus,
  PenLine,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input, TextArea } from "../ui/Input";

interface Testimoni {
  id: number;
  nama: string;
  role: "Siswa" | "Guru BK";
  detail: string;
  rating: number;
  pesan: string;
  createdAt: string;
}

interface SessionData {
  role: "siswa" | "guru";
  nis?: string;
  nip?: string;
  nama?: string;
}

const avatarColors = ["bg-primary", "bg-success", "bg-warning"];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function Testimonials() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<Testimoni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [session, setSession] = useState<SessionData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/testimoni");
        if (!res.ok) throw new Error("Gagal memuat testimoni.");
        const payload = (await res.json()) as { data: Testimoni[] };
        if (cancelled) return;
        setTestimonials(payload.data);
        setError("");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    void Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const raw = window.sessionStorage.getItem("xsata-auth");
        if (!raw) return;
        const parsed = JSON.parse(raw) as SessionData;
        if (parsed && (parsed.role === "siswa" || parsed.role === "guru")) {
          setSession(parsed);
        }
      } catch {
        setSession(null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  }

  async function refresh() {
    try {
      const res = await fetch("/api/testimoni");
      if (!res.ok) return;
      const payload = (await res.json()) as { data: Testimoni[] };
      setTestimonials(payload.data);
      setError("");
    } catch {
      return;
    }
  }

  function onCta() {
    if (!session) {
      router.push("/login");
      return;
    }
    setPesan("");
    setRating(5);
    setModalOpen(true);
  }

  const identity = session
    ? session.role === "siswa"
      ? {
          nama: session.nama ?? "Siswa",
          status: `Siswa (NIS: ${session.nis ?? "-"})`,
          role: "Siswa" as const,
          detail: `NIS: ${session.nis ?? "-"}`,
        }
      : {
          nama: session.nama ?? "Guru BK",
          status: `Guru BK (NIP: ${session.nip ?? "-"})`,
          role: "Guru BK" as const,
          detail: `NIP: ${session.nip ?? "-"}`,
        }
    : null;

  const canSubmit = pesan.trim().length > 0 && !submitting;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!identity || !canSubmit) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/testimoni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: identity.nama,
          role: identity.role,
          detail: identity.detail,
          rating,
          pesan: pesan.trim(),
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? "Gagal mengirim testimoni.");

      setModalOpen(false);
      setPesan("");
      setRating(5);
      showToast("Testimoni kamu berhasil dikirim. Terima kasih!");
      await refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="testimoni" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Testimoni"
          title="Cerita Sukses Pengguna"
          description="Dengarkan pengalaman siswa dan Guru BK yang telah menggunakan XSata Career AI Platform."
        />

        <div className="mt-14">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted">Memuat testimoni...</p>
            </div>
          ) : error ? (
            <Card className="mx-auto max-w-xl">
              <CardContent className="p-8 text-center text-sm text-danger">{error}</CardContent>
            </Card>
          ) : testimonials.length === 0 ? (
            <Card className="mx-auto max-w-xl">
              <CardContent className="p-12 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent">
                  <MessageSquarePlus className="h-7 w-7 text-primary" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">
                  Belum ada testimoni. Jadilah yang pertama memberikan ulasan!
                </h3>
                <p className="mt-1.5 text-sm text-muted">
                  Bagikan pengalamanmu menggunakan platform ini kepada siswa dan Guru BK lain.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, index) => (
                <figure
                  key={t.id}
                  className="relative flex flex-col rounded-2xl border border-border-light bg-accent-soft p-6"
                >
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/10" />
                  <div className="flex gap-1 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < t.rating ? "fill-current" : "text-slate-300"}`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                    &ldquo;{t.pesan}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${avatarColors[index % avatarColors.length]} text-sm font-semibold text-white`}
                    >
                      {initialsOf(t.nama)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{t.nama}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <Badge tone={t.role === "Guru BK" ? "warning" : "primary"}>
                          {t.role}
                        </Badge>
                        {t.detail && <span className="text-xs text-slate-500">{t.detail}</span>}
                      </div>
                      {formatDate(t.createdAt) && (
                        <time className="text-xs text-muted">{formatDate(t.createdAt)}</time>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Button size="lg" onClick={onCta}>
            {session ? (
              <>
                <PenLine className="h-4 w-4" />
                Tulis Testimoni Kamu
              </>
            ) : (
              <>
                <MessageSquarePlus className="h-4 w-4" />
                Beri Testimoni
              </>
            )}
          </Button>
          <p className="text-xs text-muted">
            {session
              ? `Masuk sebagai ${identity?.status ?? ""}`
              : "Masuk menggunakan akun Siswa atau Guru BK untuk menulis testimoni."}
          </p>
        </div>
      </Container>

      {modalOpen && identity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tulis Testimoni Kamu"
            className="w-full max-w-md rounded-2xl border border-border-light bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-light px-5 py-4">
              <div className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-slate-900">Tulis Testimoni Kamu</h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 p-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Nama"
                  id="testimoni-nama"
                  readOnly
                  value={identity.nama}
                  className="bg-slate-100 text-slate-500"
                />
                <Input
                  label="Status"
                  id="testimoni-status"
                  readOnly
                  value={identity.status}
                  className="bg-slate-100 text-slate-500"
                />
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-700">Rating</span>
                <div className="mt-2 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={`Berikan rating ${star} bintang`}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-1 text-sm font-semibold text-slate-700">{rating}/5</span>
                </div>
              </div>

              <TextArea
                label="Pesan Testimoni"
                id="testimoni-pesan"
                required
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Ceritakan pengalamanmu menggunakan XSata Career..."
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={!canSubmit}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Kirim Testimoni
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          {toast}
        </div>
      )}
    </section>
  );
}