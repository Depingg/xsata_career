import { NextResponse } from "next/server";
import { tracerStudyStore } from "@/lib/tracer-study-store";
import type { Alumni, StatusTerserap } from "@/lib/tracer-study-store";

const STATUS_KEYS: StatusTerserap[] = ["Bekerja", "Melanjutkan", "Wirausaha"];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Omit<Alumni, "id">>[];

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json(
        { error: "Body harus berupa array data alumni yang tidak kosong." },
        { status: 400 }
      );
    }

    const errors: string[] = [];
    let added = 0;

    for (const item of body) {
      const { nama, angkatan, jurusan, status, tempat, tahun } = item as Partial<Alumni>;

      if (!nama || !angkatan || !jurusan || !status || !tempat || !tahun) {
        errors.push(nama ? `Data '${nama}' tidak lengkap` : "Ada data dengan nama kosong");
        continue;
      }

      if (!STATUS_KEYS.includes(status as StatusTerserap)) {
        errors.push(`Data '${nama}' memiliki status tidak valid: ${status}`);
        continue;
      }

      tracerStudyStore.add({
        nama,
        angkatan,
        jurusan,
        status: status as StatusTerserap,
        tempat,
        tahun,
      });
      added += 1;
    }

    return NextResponse.json({
      added,
      errors,
      stats: tracerStudyStore.stats(),
    });
  } catch {
    return NextResponse.json(
      { error: "Body request harus berupa JSON array yang valid." },
      { status: 400 }
    );
  }
}