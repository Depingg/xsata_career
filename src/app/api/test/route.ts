import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const siswa = await prisma.siswa.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nis: true,
      nisn: true,
      namaLengkap: true,
      kelas: true,
      jurusan: true,
      rombel: true,
      jenisKelamin: true,
      email: true,
      statusAktif: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({ count: siswa.length, data: siswa });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const { nis, nisn, password, namaLengkap, kelas, jurusan, rombel, jenisKelamin, email, statusAktif } = body;

    if (!nis || !nisn || !password || !namaLengkap || !kelas || !jurusan || !rombel || !jenisKelamin) {
      return NextResponse.json(
        {
          error:
            "Field wajib: nis, nisn, password, namaLengkap, kelas, jurusan, rombel, jenisKelamin.",
        },
        { status: 400 }
      );
    }

    const siswa = await prisma.siswa.create({
      data: {
        nis: String(nis),
        nisn: String(nisn),
        password: String(password),
        namaLengkap: String(namaLengkap),
        kelas: String(kelas),
        jurusan: String(jurusan),
        rombel: String(rombel),
        jenisKelamin: String(jenisKelamin),
        email: typeof email === "string" ? email : "",
        statusAktif: typeof statusAktif === "boolean" ? statusAktif : true,
      },
    });

    return NextResponse.json(siswa, { status: 201 });
  } catch (e: unknown) {
    const message =
      e instanceof Error && e.message.includes("Unique constraint")
        ? "NIS atau NISN sudah terdaftar."
      : "Body request harus berupa JSON yang valid.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}