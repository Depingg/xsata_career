import { NextResponse } from "next/server";
import { lokerStore } from "@/lib/loker-store";
import type { Loker } from "@/lib/loker-store";

export async function GET() {
  return NextResponse.json(lokerStore.getAll());
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Omit<Loker, "id" | "saved">>;

    const { title, company, location, type, salary, match, posted, logo, jurusan, bkkVerified } = body;

    if (!title || !company || !location || !type || !salary || !posted || !logo) {
      return NextResponse.json(
        { error: "Data loker tidak lengkap. Field wajib: title, company, location, type, salary, posted, logo." },
        { status: 400 }
      );
    }

    if (typeof match !== "number" || match < 0 || match > 100) {
      return NextResponse.json(
        { error: "Field 'match' harus berupa angka antara 0 dan 100." },
        { status: 400 }
      );
    }

    const loker = lokerStore.add({
      title,
      company,
      location,
      type,
      salary,
      match,
      posted,
      logo,
      jurusan: Array.isArray(jurusan) ? jurusan : [],
      bkkVerified: typeof bkkVerified === "boolean" ? bkkVerified : false,
    });

    return NextResponse.json(loker, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Body request harus berupa JSON yang valid." },
      { status: 400 }
    );
  }
}