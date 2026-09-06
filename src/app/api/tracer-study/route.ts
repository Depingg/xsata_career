import { NextResponse } from "next/server";
import { tracerStudyStore } from "@/lib/tracer-study-store";
import type { Alumni, StatusTerserap } from "@/lib/tracer-study-store";

const STATUS_KEYS: StatusTerserap[] = ["Bekerja", "Melanjutkan", "Wirausaha"];

export async function GET() {
  const data = tracerStudyStore.getAll();
  const stats = tracerStudyStore.stats();
  return NextResponse.json({ data, stats });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Omit<Alumni, "id">>;

    const { nama, angkatan, jurusan, status, tempat, tahun } = body;

    if (!nama || !angkatan || !jurusan || !status || !tempat || !tahun) {
      return NextResponse.json(
        { error: "Data alumni tidak lengkap. Field wajib: nama, angkatan, jurusan, status, tempat, tahun." },
        { status: 400 }
      );
    }

    if (!STATUS_KEYS.includes(status as StatusTerserap)) {
      return NextResponse.json(
        { error: "Status harus salah satu dari: Bekerja, Melanjutkan, Wirausaha." },
        { status: 400 }
      );
    }

    const alumni = tracerStudyStore.add({
      nama,
      angkatan,
      jurusan,
      status: status as StatusTerserap,
      tempat,
      tahun,
    });

    return NextResponse.json(alumni, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Body request harus berupa JSON yang valid." },
      { status: 400 }
    );
  }
}