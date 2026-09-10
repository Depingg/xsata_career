import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json(
      { error: "Parameter 'q' wajib diisi untuk melakukan pencarian." },
      { status: 400 }
    );
  }

  const where = {
    OR: [
      { title: { contains: q } },
      { company: { contains: q } },
      { location: { contains: q } },
      { type: { contains: q } },
      { jurusan: { contains: q } },
    ],
  };

  const results = await prisma.loker.findMany({ where, orderBy: { createdAt: "desc" } });

  return NextResponse.json({ query: q, count: results.length, results });
}
