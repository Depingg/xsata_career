import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const all = await prisma.loker.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(all);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const { title, company, location, type, salary, match: matchScore, posted, logo, jurusan, bkkVerified } = body;

    if (!title || !company || !location || !type || !salary || !posted || !logo) {
      return NextResponse.json(
        { error: "Data loker tidak lengkap. Field wajib: title, company, location, type, salary, posted, logo." },
        { status: 400 }
      );
    }

    if (typeof matchScore !== "number" || matchScore < 0 || matchScore > 100) {
      return NextResponse.json(
        { error: "Field 'match' harus berupa angka antara 0 dan 100." },
        { status: 400 }
      );
    }

    const loker = await prisma.loker.create({
      data: {
        title: String(title),
        company: String(company),
        location: String(location),
        type: String(type),
        salary: String(salary),
        match: matchScore,
        posted: String(posted),
        logo: String(logo),
        jurusan: JSON.stringify(Array.isArray(jurusan) ? jurusan : []),
        bkkVerified: typeof bkkVerified === "boolean" ? bkkVerified : false,
      },
    });

    return NextResponse.json(loker, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Body request harus berupa JSON yang valid." },
      { status: 400 }
    );
  }
}
