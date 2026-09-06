"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreHorizontal, ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

interface Conversation {
  name: string;
  kelas: string;
  message: string;
  time: string;
  unread: boolean;
  active?: boolean;
}

const conversations: Conversation[] = [
  { name: "Nanda", kelas: "XII TKJ 1", message: "Terima kasih Bu atas bimbingannya!", time: "09:15", unread: false, active: true },
  { name: "Rizky Pratama", kelas: "XII TKJ 2", message: "Bu, saya mau konsultasi soal pilihan karier", time: "08:40", unread: true },
  { name: "Siti Rahma", kelas: "XI MM 1", message: "Apakah bisa pindah jadwal konseling?", time: "Kemarin", unread: true },
  { name: "Dimas Adit", kelas: "XII AKL 1", message: "Baik Bu, terima kasih sudah diingatkan.", time: "Kemarin", unread: false },
];

const chatMessages = [
  { from: "them", text: "Selamat pagi Bu, terima kasih banyak atas bimbingannya kemarin!" },
  { from: "me", text: "Selamat pagi Nanda! Sama-sama. Bagaimana sudah mencoba latihan interview-nya?" },
  { from: "them", text: "Sudah Bu, saya latihan dengan teman. Masih gugup tapi sudah lebih baik." },
  { from: "me", text: "Bagus sekali! Terus berlatih ya. Jangan lupa siapkan contoh portofolio. Semangat!" },
  { from: "them", text: "Terima kasih Bu! 🙏" },
];

export default function PesanPage() {
  const [selected, setSelected] = useState<Conversation | null>(null);

  return (
    <DashboardShell role="guru" username="Bu Ratna Dewi" userRole="Guru BK • SMK Negeri 1">
      <PageHeader title="Pesan" description="Komunikasi dengan siswa binaan." />

      <Card className="overflow-hidden min-h-[520px]">
        <div className="grid md:grid-cols-3">
          {/* Conversation list */}
          <div
            className={`flex-col border-b border-border-light md:flex md:border-b-0 md:border-r ${
              selected ? "hidden" : "flex"
            }`}
          >
            <div className="border-b border-border-light p-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Cari percakapan..."
                  className="h-10 w-full rounded-xl border border-border-light pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="divide-y divide-border-light">
              {conversations.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelected(c)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                    c.active ? "bg-accent" : "hover:bg-accent-soft"
                  }`}
                >
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    {c.unread && (
                      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                      <span className="shrink-0 text-xs text-muted">{c.time}</span>
                    </div>
                    <p className="truncate text-xs text-slate-500">{c.message}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div
            className={`flex-col md:col-span-2 md:flex ${
              selected ? "flex" : "hidden"
            }`}
          >
            <div className="flex items-center justify-between border-b border-border-light px-3 py-3.5 sm:px-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
                  aria-label="Kembali ke daftar percakapan"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {selected
                    ? selected.name.split(" ").map((w) => w[0]).slice(0, 2).join("")
                    : "AP"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {selected ? selected.name : "Nanda"}
                  </p>
                  <p className="text-xs text-success">Online</p>
                </div>
              </div>
              <button
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Opsi lainnya"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-accent-soft/40 p-3 sm:p-5">
              {chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[75%] ${
                      m.from === "me"
                        ? "rounded-tr-sm bg-primary text-white"
                        : "rounded-tl-sm border border-border-light bg-white text-slate-700"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-border-light p-3">
              <button
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Lampirkan file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                placeholder="Tulis pesan..."
                className="h-10 flex-1 min-w-0 rounded-xl border border-border-light px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark"
                aria-label="Kirim pesan"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </DashboardShell>
  );
}