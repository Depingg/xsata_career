"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { usePathname } from "next/navigation";
import { readSession } from "@/lib/auth-store";
import {
  Bot,
  Sparkles,
  X,
  Send,
  Mic,
  PhoneOff,
  Volume2,
  VolumeX,
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
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: {
    resultIndex: number;
    results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
  }) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
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

// ============================================================================
// SETTLE / PANDUAN MODE SUARA
// ============================================================================

// Silence debounce sebelum transkrip dianggap selesai (1.5 detik).
const SILENCE_MS = 1500;

// Jeda setelah TTS selesai sebelum mikrofon dinyalakan kembali (500ms).
const MIC_RESTART_DELAY = 500;

// Jumlah KATA minimal agar transkrip dianggap bermakna (bukan gumaman/spasi).
const MIN_WORDS = 3;

// System Prompt Lisan — dijadikan panduan gaya respons suara.
const VOICE_SYSTEM_PROMPT =
  "Kamu adalah 'Career Assistant', konselor BKK & BK SMKN 1 Tengaran.\n" +
  "Bicara dengan gaya santai, empatik, dan lisan (seperti obrolan langsung).\n" +
  "Jawab pertanyaan siswa secara langsung dan padat (MAKSIMAL 2-3 KALIMAT).\n" +
  "Bebas merespons topik apa pun yang ditanyakan siswa tentang karier, kuliah, atau kerja tanpa menggunakan kalimat template formal.\n" +
  "DILARANG menggunakan poin/bullet points, tanda baca aneh, atau teks tebal karena jawaban akan dibacakan oleh mesin suara.";

// Pesan status yang tampil saat mikrofon menunggu suara siswa yang jelas.
const IDLE_HINT = "Silakan bicara...";

export function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "ai", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setSpeaking] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [micSupported] = useState(() => Boolean(getSpeechRecognition()));
  const [isVoiceMode, setVoiceMode] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceActiveRef = useRef(false);
  const speakingRef = useRef(false);
  const processingRef = useRef(false);
  const mutedRef = useRef(false);
  const pauseRecognitionRef = useRef(false);
  const silenceTimerRef = useRef<number | null>(null);
  const restartTimerRef = useRef<number | null>(null);
  const finalTranscriptRef = useRef("");

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
  }, [messages, typing, open, isVoiceMode]);

  useEffect(() => {
    return () => {
      voiceActiveRef.current = false;
      speakingRef.current = false;
      processingRef.current = false;
      pauseRecognitionRef.current = false;
      if (silenceTimerRef.current !== null) clearTimeout(silenceTimerRef.current);
      if (restartTimerRef.current !== null) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          try {
            recognitionRef.current.stop();
          } catch {
            // abaikan
          }
        }
        recognitionRef.current = null;
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  function getSpeechSynthesis(): SpeechSynthesis | undefined {
    if (typeof window === "undefined") return undefined;
    return "speechSynthesis" in window ? window.speechSynthesis : undefined;
  }

  function clearSilenceTimer() {
    if (silenceTimerRef.current !== null) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }

  function stopRecognition() {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        try {
          recognitionRef.current.stop();
        } catch {
          // abaikan
        }
      }
      recognitionRef.current = null;
    }
  }

  function clearRestartTimer() {
    if (restartTimerRef.current !== null) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }

  function resetTranscriptState() {
    finalTranscriptRef.current = "";
    setTranscript("");
  }

  function stopVoiceEngine() {
    voiceActiveRef.current = false;
    speakingRef.current = false;
    processingRef.current = false;
    pauseRecognitionRef.current = false;
    clearSilenceTimer();
    clearRestartTimer();
    stopRecognition();
    window.speechSynthesis?.cancel();
    setListening(false);
    setSpeaking(false);
    setProcessing(false);
    resetTranscriptState();
  }

  // ==========================================================================
  // DUPLEX CONTROL — SIKLUS AUDIO
  // ==========================================================================
  //
  // LISTENING  : mikrofon aktif, AI mendengarkan.
  // PROCESSING : mikrofon mati (recognition.stop), teks dikirim ke AI.
  // SPEAKING   : AI berbicara (TTS), mikrofon WAJIB MATI TOTAL.
  // AUTO-RESUME: setelah TTS.onend, tunggu 500ms lalu kembali ke LISTENING.
  // ==========================================================================

  /** Validasi transkrip: minimal N kata dan bukan gumaman/spasi. */
  function isMeaningfulTranscript(): boolean {
    const words = finalTranscriptRef.current.trim().split(/\s+/).filter(Boolean);
    return words.length >= MIN_WORDS;
  }

  function beginListening() {
    clearSilenceTimer();
    if (!voiceActiveRef.current || processingRef.current || pauseRecognitionRef.current) return;
    if (recognitionRef.current) return;

    const SR = getSpeechRecognition();
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = "id-ID";
    recognition.continuous = true;
    recognition.interimResults = true;
    resetTranscriptState();

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      if (!voiceActiveRef.current || pauseRecognitionRef.current) return;
      let interim = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const t = result?.[0]?.transcript ?? "";
        if (result.isFinal) {
          finalTranscriptRef.current = (finalTranscriptRef.current + " " + t).trim();
        } else {
          interim += t;
        }
      }

      const displayed = (finalTranscriptRef.current + " " + interim).trim();
      setTranscript(displayed);

      // Cegah false trigger: transkrip masih gumaman/spasi → abaikan & tetap dengar.
      if (!isMeaningfulTranscript()) {
        clearSilenceTimer();
        return;
      }

      // Silence debounce: tunggu 1.5s hening baru kirim ke AI.
      clearSilenceTimer();
      silenceTimerRef.current = window.setTimeout(() => {
        silenceTimerRef.current = null;
        const finalText = finalTranscriptRef.current.trim();
        if (
          finalText &&
          isMeaningfulTranscript() &&
          voiceActiveRef.current &&
          !processingRef.current
        ) {
          transitionToProcessing(finalText);
        }
      }, SILENCE_MS);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      if (!voiceActiveRef.current) return;
      if (pauseRecognitionRef.current) return;
      // AUTO-RESUME setelah TTS selesai.
      scheduleRestart();
    };

    recognition.onerror = (event) => {
      setListening(false);
      recognitionRef.current = null;
      const code = event?.error ?? "";
      // 'aborted' → sengaja dihentikan (tidak perlu restart).
      if (code === "aborted" || !voiceActiveRef.current || pauseRecognitionRef.current) return;
      // Kesalahan non-fatal → coba mulai dengarkan lagi (tidak mengirim apa pun ke AI).
      scheduleRestart(700);
    };

    recognitionRef.current = recognition;
    setListening(true);
    setTranscript("");
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
    }
  }

  /** MODE PROCESSING — matikan mikrofon, kirim transkrip ke AI. */
  function transitionToProcessing(text: string) {
    if (!voiceActiveRef.current || processingRef.current) return;

    processingRef.current = true;
    setProcessing(true);
    pauseRecognitionRef.current = true;
    clearSilenceTimer();
    stopRecognition();
    setListening(false);
    resetTranscriptState();

    const userText = text.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setTranscript(`Anda: ${userText}`);
    setTyping(true);

    // Kirim ke API AI (generateReply sebagai mesin pengetahuan lokal).
    window.setTimeout(() => {
      setTyping(false);
      setTranscript("");
      const reply = generateReply(userText);
      generateVoiceReply(reply);
    }, 700);
  }

  /** Mengambil jawaban dari "API AI" lalu masuk MODE SPEAKING. */
  function generateVoiceReply(reply: string) {
    setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    setProcessing(false);
    processingRef.current = false;
    setTyping(false);
    // MODE SPEAKING.
    speakReply(reply);
  }

  function scheduleRestart(delay = 600) {
    clearRestartTimer();
    restartTimerRef.current = window.setTimeout(() => {
      restartTimerRef.current = null;
      if (voiceActiveRef.current && !pauseRecognitionRef.current && !processingRef.current) {
        beginListening();
      }
    }, delay);
  }

  /** MODE SPEAKING — mikrofon MATI TOTAL selama AI berbicara. */
  function speakReply(text: string) {
    const synth = getSpeechSynthesis();
    if (!synth || mutedRef.current) {
      // Tidak dapat bicara → langsung kembali ke LISTENING.
      resumeListening();
      return;
    }

    pauseRecognitionRef.current = true;
    clearSilenceTimer();
    stopRecognition();
    setListening(false);

    synth.cancel();
    speakingRef.current = true;
    setSpeaking(true);

    const plain = text
      .replace(/[*#_`>]/g, "")
      .replace(/[^\w\s.,!?;:'"()-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const utter = new SpeechSynthesisUtterance(plain || "Baik, saya mengerti.");
    utter.lang = "id-ID";
    utter.rate = 1;
    utter.pitch = 1;

    const finish = () => {
      speakingRef.current = false;
      setSpeaking(false);
      if (voiceActiveRef.current) {
        // AUTO-RESUME: 500ms setelah AI selesai bicara, mikrofon dinyalakan lagi.
        pauseRecognitionRef.current = false;
        scheduleRestart(MIC_RESTART_DELAY);
      }
    };

    utter.onend = finish;
    utter.onerror = finish;
    synth.speak(utter);
  }

  /** Kembali ke LISTENING (dipakai bila mikrofon/TTS sedang tidak dibutuhkan). */
  function resumeListening() {
    if (!voiceActiveRef.current) return;
    pauseRecognitionRef.current = false;
    clearSilenceTimer();
    scheduleRestart(150);
  }

  function startVoiceSession() {
    if (isVoiceMode || !micSupported) return;
    void VOICE_SYSTEM_PROMPT; // panduan gaya respons suara (konteks sesi lisan)
    voiceActiveRef.current = true;
    resetTranscriptState();
    setVoiceMode(true);
    requestMicWithNoiseSuppression()
      .catch(() => {
        // izin mic ditolak/tidak tersedia — tetap lanjut via SpeechRecognition
      })
      .finally(() => {
        if (voiceActiveRef.current) beginListening();
      });
  }

  async function requestMicWithNoiseSuppression() {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  }

  function endVoiceSession() {
    stopVoiceEngine();
    setVoiceMode(false);
  }

  function toggleMute() {
    const next = !isMuted;
    setMuted(next);
    mutedRef.current = next;
    if (next) {
      window.speechSynthesis?.cancel();
      speakingRef.current = false;
      setSpeaking(false);
      pauseRecognitionRef.current = false;
      scheduleRestart(150);
    }
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
    endVoiceSession();
    setMessages([{ role: "ai", text: WELCOME_MESSAGE }]);
    setInput("");
  }

  function handleOpen() {
    setOpen(true);
    setShowBubble(false);
  }

  function voiceStatusText(): string {
    if (isSpeaking) return "Career Assistant Sedang Menjawab...";
    if (isProcessing) return "Memproses pertanyaanmu...";
    if (listening) return "Mendengarkan...";
    return IDLE_HINT;
  }

  const pathname = usePathname();

  const hideByPath =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/guru" ||
    pathname.startsWith("/guru/");

  const [sessionRole, setSessionRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setSessionRole(readSession()?.role ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const hideByRole =
    sessionRole === "guru" || sessionRole === "admin";

  if (hideByPath || hideByRole) {
    return null;
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
              <p className="truncate font-bold">Career Assistant</p>
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
              onClick={() => {
                endVoiceSession();
                setOpen(false);
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
              aria-label="Tutup chat"
              title="Tutup chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isVoiceMode ? (
            <div className="flex h-full max-h-[80vh] animate-voice-panel-in flex-col overflow-hidden">
              {/* Bagian tengah: waveform & transkrip real-time — SCROLLABLE */}
              <div className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto p-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  {!isSpeaking && !listening && (
                    <span
                      className="absolute inset-0 animate-ping rounded-full bg-primary/25"
                      style={{ animationDuration: "2.2s" }}
                    />
                  )}
                  <span
                    className={`relative flex h-20 w-20 items-center justify-center text-white shadow-lg ring-4 transition-colors duration-300 ${
                      isSpeaking
                        ? "bg-gradient-to-br from-fuchsia-600 via-pink-500 to-rose-500 ring-pink-200"
                        : "bg-gradient-to-br from-primary via-purple-600 to-pink-500 ring-white"
                    }`}
                  >
                    <Bot className="h-10 w-10" />
                  </span>
                </div>

                <div className="flex h-10 shrink-0 items-center gap-1.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`w-1.5 rounded-full ${
                        isSpeaking
                          ? "bg-gradient-to-t from-fuchsia-600 to-rose-400"
                          : "bg-gradient-to-t from-primary to-purple-500"
                      } ${listening || isSpeaking ? "animate-voice-wave" : ""}`}
                      style={{
                        height: listening || isSpeaking ? "100%" : "30%",
                        animationDelay: `${i * 0.12}s`,
                        transition: "height 0.3s ease",
                      }}
                    />
                  ))}
                </div>

                <div className="shrink-0">
                  <p className="font-bold text-slate-900">Sesi Konsultasi Suara</p>
                  <p className="mt-1.5 text-sm text-slate-500">{voiceStatusText()}</p>
                </div>

                <div className="w-full max-w-[300px] shrink-0">
                  {transcript ? (
                    <p className="text-sm font-medium italic leading-relaxed text-slate-600">
                      &ldquo;{transcript}&rdquo;
                      <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-primary align-middle" />
                    </p>
                  ) : (
                    <p className="text-center text-xs leading-relaxed text-slate-400">
                      Silakan bicara — suaramu akan tampil di layar secara langsung.
                    </p>
                  )}
                </div>
              </div>

              {/* Bagian bawah: kontrol — STICKY/FIXED agar selalu terlihat */}
              <div className="sticky bottom-0 z-10 flex items-center justify-center gap-3 border-t border-border-light bg-white p-3">
                <button
                  onClick={toggleMute}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isMuted
                      ? "border-danger/30 bg-danger-soft text-danger"
                      : "border-border-light bg-accent text-primary hover:border-primary"
                  }`}
                  aria-label={isMuted ? "Aktifkan suara" : "Bisukan suara"}
                  title={isMuted ? "Aktifkan suara" : "Bisukan suara"}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <button
                  onClick={endVoiceSession}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-danger px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-red-500"
                  aria-label="Akhiri sesi suara"
                  title="Akhiri sesi suara"
                >
                  <PhoneOff className="h-5 w-5" />
                  Akhiri Sesi Suara
                </button>
              </div>
            </div>
          ) : (
            <>
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
                    onClick={startVoiceSession}
                    className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-primary hover:text-white"
                    aria-label="Mulai konsultasi suara"
                    title="Mulai Konsultasi Suara"
                  >
                    <Mic className="h-5 w-5" />
                    <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      Mulai Konsultasi Suara
                    </span>
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
            </>
          )}
        </div>
      )}

      {/* Floating action button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-pink-500 text-white shadow-xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95 sm:h-16 sm:w-16"
          aria-label="Buka chat Career Assistant"
          title="Chat Career Assistant"
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
