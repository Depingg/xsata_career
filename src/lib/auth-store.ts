export type Role = "siswa";

export interface Session {
  role: Role;
  nis: string;
  nisn: string;
  nama: string;
  kelas: string;
  jurusan: string;
  rombel: string;
  jenisKelamin: "L" | "P";
  email: string;
  initials: string;
  userRole: string;
}

export const SESSION_KEY = "xsata-auth";

export interface LoginResult {
  ok: boolean;
  session?: Session;
  error?: string;
}

export async function login(nis: string, password: string): Promise<LoginResult> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nis, password }),
    });

    const data = (await res.json()) as Record<string, unknown>;

    if (!res.ok) {
      return {
        ok: false,
        error: typeof data.error === "string" ? data.error : "Gagal masuk. Silakan coba lagi.",
      };
    }

    const nama = typeof data.namaLengkap === "string" ? data.namaLengkap : "Siswa";
    const jurusan = typeof data.jurusan === "string" ? data.jurusan : "";
    const rombel = typeof data.rombel === "string" ? data.rombel : "";

    const session: Session = {
      role: "siswa",
      nis: String(data.nis ?? ""),
      nisn: String(data.nisn ?? ""),
      nama,
      kelas: String(data.kelas ?? ""),
      jurusan,
      rombel,
      jenisKelamin: data.jenisKelamin === "P" ? "P" : "L",
      email: typeof data.email === "string" ? data.email : "",
      initials: nama
        .split(" ")
        .filter(Boolean)
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
      userRole: `Siswa SMK • ${jurusan}${rombel ? ` • ${rombel}` : ""}`,
    };

    return { ok: true, session };
  } catch {
    return {
      ok: false,
      error: "Terjadi kesalahan koneksi. Periksa koneksimu lalu coba lagi.",
    };
  }
}

export function persistSession(session: Session) {
  const json = JSON.stringify(session);
  try {
    window.localStorage.setItem(SESSION_KEY, json);
  } catch {
    /* abaikan jika storage tidak tersedia */
  }
  try {
    window.document.cookie = `${SESSION_KEY}=${encodeURIComponent(
      json
    )}; path=/; max-age=86400; samesite=lax`;
  } catch {
    /* abaikan error cookie */
  }
}

export function readSession(): Session | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw) as Session;
    }
  } catch {
    /* lanjut cek cookie */
  }
  try {
    const match = window.document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_KEY}=`));
    if (match) {
      return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))) as Session;
    }
  } catch {
    /* abaikan */
  }
  return null;
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* abaikan */
  }
  try {
    window.document.cookie = `${SESSION_KEY}=; path=/; max-age=0; samesite=lax`;
  } catch {
    /* abaikan */
  }
}