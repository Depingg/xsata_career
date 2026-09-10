import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { nis?: string; password?: string };
    const nis = String(body.nis ?? "").trim();
    const password = String(body.password ?? "");

    if (!nis || !password) {
      return NextResponse.json(
        { error: "NIS dan password wajib diisi." },
        { status: 400 }
      );
    }

    const siswa = await prisma.siswa.findUnique({ where: { nis } });

    if (!siswa) {
      return NextResponse.json(
        { error: "NIS tidak terdaftar." },
        { status: 401 }
      );
    }

    if (siswa.password !== password) {
      return NextResponse.json(
        { error: "Password salah." },
        { status: 401 }
      );
    }

    if (!siswa.statusAktif) {
      return NextResponse.json(
        { error: "Akun tidak aktif. Hubungi admin sekolah." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      id: siswa.id,
      nis: siswa.nis,
      nisn: siswa.nisn,
      namaLengkap: siswa.namaLengkap,
      kelas: siswa.kelas,
      jurusan: siswa.jurusan,
      rombel: siswa.rombel,
      jenisKelamin: siswa.jenisKelamin,
      email: siswa.email,
      statusAktif: siswa.statusAktif,
    });
  } catch {
    return NextResponse.json(
      { error: "Body request harus berupa JSON yang valid." },
      { status: 400 }
    );
  }
}