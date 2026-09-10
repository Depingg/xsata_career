"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IdCard, KeyRound, LogIn, Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  login,
  persistSession,
  readSession,
} from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const [nis, setNis] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const canSubmit = nis.trim().length >= 6 && password.trim().length > 0 && !submitting;

  function handleNisChange(raw: string) {
    setNis(raw.replace(/\D/g, ""));
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError("");

    const result = await login(nis.trim(), password);

    if (!result.ok || !result.session) {
      setError(result.error ?? "Gagal masuk. Silakan coba lagi.");
      setSubmitting(false);
      return;
    }

    persistSession(result.session);
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
          placeholder="Masukkan NIS kamu (mis. 123456)"
          value={nis}
          onChange={(e) => handleNisChange(e.target.value)}
          icon={<IdCard className="h-4 w-4" />}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Masukkan password kamu"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          icon={<KeyRound className="h-4 w-4" />}
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/20 bg-danger/5 px-3 py-2 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <p className="text-xs text-muted">
          NIS umumnya terdiri dari 6 digit angka.{" "}
          <span className={nis.length >= 6 ? "text-success" : "text-slate-400"}>
            {nis.length}/6 digit minimal.
          </span>
        </p>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          type="submit"
          disabled={!canSubmit}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {submitting ? "Memeriksa..." : "Masuk"}
        </Button>
      </form>
    </AuthLayout>
  );
}