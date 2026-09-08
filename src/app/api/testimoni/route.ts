import { NextResponse } from "next/server";
import { testimoniStore } from "@/lib/testimoni-store";
import type { Testimoni } from "@/lib/testimoni-store";

const ROLES = ["Siswa"];

export async function GET() {
  const data = testimoniStore.getAll();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Omit<Testimoni, "id" | "createdAt">>;

    const { nama, role, detail, rating, pesan } = body;

    if (!nama || !role || !pesan) {
      return NextResponse.json(
        { error: "Data testimoni tidak lengkap. Field wajib: nama, role, pesan." },
        { status: 400 }
      );
    }

    if (!ROLES.includes(role as string)) {
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

    const testimoni = testimoniStore.add({
      nama,
      role: role as Testimoni["role"],
      detail: typeof detail === "string" ? detail : "",
      rating,
      pesan,
    });

    return NextResponse.json(testimoni, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Body request harus berupa JSON yang valid." },
      { status: 400 }
    );
  }
}