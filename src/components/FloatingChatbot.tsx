"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Mic,
  RotateCcw,
} from "lucide-react";
import {
  generateReply,
  QUICK_SUGGESTIONS,
  WELCOME_MESSAGE,
  type ChatMessage,
} from "@/lib/bk-assistant";

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: Array<Array<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [micSupported] = useState(() => Boolean(getSpeechRecognition()));

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const bubbleTimer = setTimeout(() => setShowBubble(true), 2500);
    const hideTimer = setTimeout(() => setShowBubble(false), 15000);
    return () => {
      clearTimeout(bubbleTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  function startListening() {
    const SR = getSpeechRecognition();
    if (!SR) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SR();
    recognition.lang = "id-ID";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setInput((prev) => (prev.trim() ? `${prev.trim()} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  }

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: generateReply(trimmed) }]);
      setTyping(false);
    }, 900);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  function resetChat() {
    setMessages([{ role: "ai", text: WELCOME_MESSAGE }]);
    setInput("");
  }

  function handleOpen() {
    setOpen(true);
    setShowBubble(false);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end sm:bottom-6 sm:right-6">
      {/* Proactive bubble */}
      {!open && showBubble && (
        <div className="relative mb-3 max-w-[280px] rounded-2xl rounded-br-md border border-border-light bg-white p-4 shadow-xl">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-border-light bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-800"
            aria-label="Tutup pesan sambutan"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="flex items-start gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="text-sm leading-relaxed text-slate-700">
              Butuh saran karier atau bingung pilih kerja vs kuliah?{" "}
              <span className="font-semibold text-primary">
                Konsultasikan di sini!
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="mb-3 flex h-[min(560px,calc(100dvh-7.5rem))] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-border-light bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-gradient-to-r from-primary via-purple-600 to-pink-500 px-4 py-3.5 text-white">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 ring-2 ring-white/40">
              <Bot className="h-6 w-6" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success ring-2 ring-white" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">SataBot</p>
              <p className="truncate text-xs text-white/80">
                Asisten Konsultasi Karier • Online
              </p>
            </div>
            <button
              onClick={resetChat}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
              aria-label="Mulai ulang percakapan"
              title="Mulai ulang percakapan"
            >
              <RotateCcw className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
              aria-label="Tutup chat"
              title="Tutup chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-accent-soft/40 p-4">
            {messages.map((msg, index) =>
              msg.role === "ai" ? (
                <div key={index} className="flex items-end gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="max-w-[82%] whitespace-pre-line rounded-2xl rounded-bl-sm border border-border-light bg-white px-4 py-3 text-sm leading-relaxed text-slate-700">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div key={index} className="flex justify-end">
                  <div className="max-w-[82%] whitespace-pre-line rounded-2xl rounded-br-sm bg-primary px-4 py-3 text-sm leading-relaxed text-white">
                    {msg.text}
                  </div>
                </div>
              )
            )}

            {typing && (
              <div className="flex items-end gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border-light bg-white px-4 py-3.5">
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

          {/* Quick suggestions */}
          {messages.length === 1 && !typing && (
            <div className="flex gap-2 overflow-x-auto border-t border-border-light px-3 py-2.5">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="shrink-0 rounded-full border border-border-light bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-primary transition-colors hover:border-primary hover:bg-accent"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-border-light bg-white p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pertanyaanmu di sini..."
              className="h-11 min-w-0 flex-1 rounded-xl border border-border-light bg-accent-soft/50 px-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white"
            />
            {micSupported && (
              <button
                type="button"
                onClick={startListening}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                  listening
                    ? "bg-danger text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
                aria-label={listening ? "Berhenti merekam suara" : "Masukkan suara"}
                title="Input suara"
              >
                <Mic className={`h-5 w-5 ${listening ? "animate-pulse" : ""}`} />
              </button>
            )}
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Kirim pesan"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating action button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white shadow-xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
          aria-label="Buka chat SataBot"
          title="Chat SataBot"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 opacity-40 blur-lg transition-opacity group-hover:opacity-70"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-white/40"
          />
          <Sparkles className="relative h-7 w-7 sm:h-8 sm:w-8" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-pink-500" />
          </span>
        </button>
      )}
    </div>
  );
}