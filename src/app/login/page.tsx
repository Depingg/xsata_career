"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IdCard, LogIn } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  buildSession,
  persistSession,
  readSession,
} from "@/lib/auth-store";

const MIN_NIS = 6;

export default function LoginPage() {
  const router = useRouter();
  const [nis, setNis] = useState("");

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      const existing = readSession();
      if (existing) {
        router.replace("/");
        return;
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const canSubmit = nis.trim().length >= MIN_NIS;

  function handleChange(raw: string) {
    setNis(raw.replace(/\D/g, ""));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    const session = buildSession(nis.trim());

    persistSession(session);
    router.push("/");
  }

  return (
    <AuthLayout
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk melanjutkan perjalanan kariermu."
    >
      <form onSubmit={onSubmit} className="space-y-4">
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

        <p className="text-xs text-muted">
          NIS umumnya terdiri dari 6–10 digit angka.{" "}
          <span className={nis.length >= MIN_NIS ? "text-success" : "text-slate-400"}>
            {nis.length}/{MIN_NIS} digit minimal.
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