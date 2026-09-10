"use client";

import { useRef, useState, useEffect } from "react";
import type { FormEvent } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  Paperclip,
  Mic,
  ThumbsUp,
  ThumbsDown,
  Clock,
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { readSession } from "@/lib/auth-store";

interface Message {
  role: "user" | "ai";
  text: string;
}

const suggestions = [
  "Karier apa yang cocok untuk jurusan TKJ?",
  "Bagaimana persiapan interview kerja yang baik?",
  "Apakah saya harus lanjut kuliah atau bekerja?",
  "Rekomendasikan skill yang perlu saya pelajari",
];

const exampleReply =
  "Berdasarkan profil dan minatmu dalam desain antarmuka, berikut rekomendasi karier yang bisa kamu pertimbangkan:\n\n1. **UI/UX Designer** — kecocokan 92%, gaji menengah ke atas, banyak dibutuhkan industri digital.\n2. **Frontend Developer** — kecocokan 87%, cocok dengan kemampuan web programming-mu.\n3. **Product Designer** — kecocokan 84%, kombinasi desain dan riset pengguna.\n\nUntuk mempersiapkan karier tersebut, fokuslah menguasai Figma, pengujian kegunaan (usability testing), dan dasar-dasar HTML/CSS/JavaScript. Mau aku bantu buatkan rencana belajarnya? 😊";

export default function KonsultasiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      const session = readSession();
      const namaDepan = (session?.nama ?? "Siswa").split(" ")[0].trim() || "Siswa";
      setMessages([
        {
          role: "ai",
          text: `Halo ${namaDepan}! 👋 Saya XSata AI, asisten karier pribadimu. Berdasarkan hasil asesmen dan profilmu, saya bisa membantu memetakan karier, menjawab pertanyaan seputar jurusan, hingga mempersiapkan wawancara kerja. Apa yang ingin kamu tanyakan hari ini?`,
        },
      ]);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: exampleReply }]);
      setTyping(false);
    }, 1200);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <DashboardShell role="siswa">
      <PageHeader
        title="Konsultasi Karier AI"
        description="Tanyakan apa saja tentang karier, jurusan, dan masa depanmu kepada asisten AI."
        actions={
          <Button variant="secondary" size="sm">
            <Plus className="h-4 w-4" />
            Konsultasi Baru
          </Button>
        }
      />

      <div className="flex h-[calc(100dvh-14rem)] min-h-[440px] flex-col overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm sm:h-[calc(100vh-13rem)] sm:min-h-[480px]">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border-light px-5 py-4">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary">
            <Bot className="h-6 w-6 text-white" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900">XSata AI Karier</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Online
              </span>
            </div>
            <p className="text-xs text-muted">Asisten karier cerdas</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto bg-accent-soft/40 p-3 sm:p-5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "ai" && (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-white" />
                </span>
              )}
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[80%] ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-primary text-white"
                    : "rounded-tl-sm border border-border-light bg-white text-slate-700"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-white" />
              </span>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border-light bg-white px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 overflow-x-auto border-t border-border-light px-5 py-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="shrink-0 rounded-full border border-border-light px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-primary hover:bg-accent hover:text-primary"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={onSubmit}
          className="flex items-center gap-2 border-t border-border-light bg-white p-3"
        >
          <button
            type="button"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 sm:flex"
            aria-label="Lampirkan file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pertanyaan tentang kariermu..."
            className="h-11 flex-1 rounded-xl border border-border-light bg-accent-soft/50 px-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
          />
          <button
            type="button"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 sm:flex"
            aria-label="Masukkan suara"
          >
            <Mic className="h-5 w-5" />
          </button>
          <Button type="submit" size="sm" className="h-11 w-11 shrink-0 rounded-xl p-0">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-light bg-white p-4 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            Hasil konsultasi AI bersifat referensi. Gunakan sebagai bahan
            pertimbangan untuk keputusan kariermu.
          </span>
        </div>
        <div className="flex items-center gap-3 text-muted">
          <span className="flex items-center gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" /> Sesi 3 dari 10 hari ini
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Suka">
              <ThumbsUp className="h-4 w-4 text-slate-500" />
            </button>
            <button className="rounded-lg p-1.5 hover:bg-slate-100" aria-label="Tidak suka">
              <ThumbsDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
