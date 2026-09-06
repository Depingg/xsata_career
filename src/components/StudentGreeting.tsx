"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { readSession } from "@/lib/auth-store";

export function StudentGreeting() {
  const [nama, setNama] = useState("Siswa");

  useEffect(() => {
    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      const session = readSession();
      setNama(session?.nama?.trim() || "Siswa");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageHeader
      title={`Halo, ${nama} 👋`}
      description="Selamat datang kembali! Berikut ringkasan perkembangan kariermu."
    />
  );
}