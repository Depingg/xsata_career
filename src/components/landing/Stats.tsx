"use client";

import { useEffect, useState } from "react";
import { Container } from "../ui/Container";

interface StatsData {
  siswa: number;
  mitra: number;
  lowongan: number;
  kepuasan: number | null;
}

export function Stats() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) return;
        const data = (await res.json()) as StatsData;
        if (!cancelled) setStats(data);
      } catch {
        // biarkan tetap menampilkan placeholder
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = [
    { value: stats ? String(stats.siswa) : "…", label: "Siswa Terdaftar" },
    { value: stats ? String(stats.mitra) : "…", label: "Mitra Industri" },
    { value: stats ? String(stats.lowongan) : "…", label: "Lowongan Tersedia" },
    {
      value:
        stats === null
          ? "…"
          : stats.kepuasan === null
            ? "-"
            : `${stats.kepuasan}%`,
      label: "Tingkat Kepuasan",
    },
  ];

  return (
    <section className="bg-primary">
      <Container className="grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        {items.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-extrabold text-white sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-sm text-accent">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}