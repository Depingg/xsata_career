import { NextRequest, NextResponse } from "next/server";
import { lokerStore } from "@/lib/loker-store";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json(
      { error: "Parameter 'q' wajib diisi untuk melakukan pencarian." },
      { status: 400 }
    );
  }

  const results = lokerStore.scan(q);

  return NextResponse.json({ query: q, count: results.length, results });
}