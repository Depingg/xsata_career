import { NextResponse } from "next/server";
import { lokerStore } from "@/lib/loker-store";
import { testimoniStore } from "@/lib/testimoni-store";

export async function GET() {
  const loker = lokerStore.getAll();
  const testimonials = testimoniStore.getAll();

  const kepuasan =
    testimonials.length > 0
      ? Math.round(
          (testimonials.reduce((sum, t) => sum + t.rating, 0) /
            testimonials.length) *
            20
        )
      : null;

  return NextResponse.json({
    siswa: 0,
    mitra: 0,
    lowongan: loker.length,
    kepuasan,
  });
}