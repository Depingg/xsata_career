import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const data = await prisma.testimoni.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const { nama, role, detail, rating, pesan } = body;

    if (!nama || !role || !pesan) {
      return NextResponse.json(
        { error: "Data testimoni tidak lengkap. Field wajib: nama, role, pesan." },
        { status: 400 }
      );
    }

    if (role !== "Siswa") {
      return NextResponse.json(
        { error: "Role harus salah satu dari: Siswa." },
        { status: 400 }
      );
    }

    if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating harus berupa angka bulat antara 1 sampai 5." },
        { status: 400 }
      );
    }

    const testimoni = await prisma.testimoni.create({
      data: {
        nama: String(nama),
        role: String(role),
        detail: typeof detail === "string" ? detail : "",
        rating,
        pesan: String(pesan),
      },
    });

    return NextResponse.json(testimoni, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Body request harus berupa JSON yang valid." },
      { status: 400 }
    );
  }
}
