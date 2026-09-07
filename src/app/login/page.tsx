"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, UserCog, IdCard, LogIn } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  buildSession,
  persistSession,
  readSession,
} from "@/lib/auth-store";

type Role = "siswa" | "guru";

const MIN_NIS = 6;
const MIN_NIP = 8;

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("siswa");
  const [nis, setNis] = useState("");
  const [nip, setNip] = useState("");

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      const existing = readSession();
      if (existing) {
        router.replace("/");
        return;
      }
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get("role");
      if (roleParam === "gurubk" || roleParam === "guru" || roleParam === "guru-bk") {
        setRole("guru");
      } else if (roleParam === "siswa") {
        setRole("siswa");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const isSiswa = role === "siswa";
  const minLength = isSiswa ? MIN_NIS : MIN_NIP;
  const value = isSiswa ? nis : nip;
  const canSubmit = value.trim().length >= minLength;

  function handleChange(raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (isSiswa) setNis(digits);
    else setNip(digits);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const session = buildSession(isSiswa ? "siswa" : "guru", value.trim());

    persistSession(session);
    router.push("/");
  }

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk melanjutkan perjalanan kariermu."
    >
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setRole("siswa")}
          aria-pressed={isSiswa}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            isSiswa
              ? "border-primary bg-primary text-white shadow-sm"
              : "border-border-light bg-white text-slate-700 hover:border-primary hover:bg-accent-soft"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          Siswa
        </button>
        <button
          type="button"
          onClick={() => setRole("guru")}
          aria-pressed={!isSiswa}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            !isSiswa
              ? "border-primary bg-primary text-white shadow-sm"
              : "border-border-light bg-white text-slate-700 hover:border-primary hover:bg-accent-soft"
          }`}
        >
          <UserCog className="h-4 w-4" />
          Guru BK
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {isSiswa ? (
          <Input
            label="Nomor Induk Siswa (NIS)"
            id="nis"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Masukkan NIS kamu (mis. 12345678)"
            value={nis}
            onChange={(e) => handleChange(e.target.value)}
            icon={<IdCard className="h-4 w-4" />}
          />
        ) : (
          <Input
            label="Nomor Induk Pegawai (NIP)"
            id="nip"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Masukkan NIP Anda (mis. 19850101...)"
            value={nip}
            onChange={(e) => handleChange(e.target.value)}
            icon={<IdCard className="h-4 w-4" />}
          />
        )}

        <p className="text-xs text-muted">
          {isSiswa ? (
            <>NIS umumnya terdiri dari 6–10 digit angka.</>
          ) : (
            <>NIP guru dimulai dengan tahun lahir (mis. 19850101...).</>
          )}{" "}
          <span className={value.length >= minLength ? "text-success" : "text-slate-400"}>
            {value.length}/{minLength} digit minimal.
          </span>
        </p>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          type="submit"
          disabled={!canSubmit}
        >
          <LogIn className="h-4 w-4" />
          Masuk
        </Button>
      </form>
    </AuthLayout>
  );
}