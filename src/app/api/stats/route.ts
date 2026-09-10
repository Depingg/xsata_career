import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [lokerCount, testimonis] = await Promise.all([
    prisma.loker.count(),
    prisma.testimoni.findMany(),
  ]);

  const kepuasan =
    testimonis.length > 0
      ? Math.round(
          (testimonis.reduce((sum, t) => sum + t.rating, 0) /
            testimonis.length) *
            20
        )
      : null;

  return NextResponse.json({
    siswa: 0,
    mitra: 0,
    lowongan: lokerCount,
    kepuasan,
  });
}
