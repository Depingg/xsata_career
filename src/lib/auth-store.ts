export type Role = "siswa";

export interface Session {
  role: Role;
  nis?: string;
  nama: string;
  initials: string;
  jurusan?: string;
  userRole: string;
}

export const SESSION_KEY = "xsata-auth";

const DEFAULT_SISWA: Omit<Session, "nis"> = {
  role: "siswa",
  nama: "Andini Putri",
  initials: "AP",
  jurusan: "RPL",
  userRole: "Siswa SMK • RPL",
};

export const mockUsers: Record<string, Session> = {
  "12345678": {
    role: "siswa",
    nis: "12345678",
    nama: "Nanda",
    initials: "N",
    jurusan: "TKJ",
    userRole: "Siswa SMK • TKJ",
  },
};

export function buildSession(id: string): Session {
  const profile = mockUsers[id];
  if (profile) {
    return {
      role: "siswa",
      nis: id,
      nama: profile.nama,
      initials: profile.initials,
      jurusan: profile.jurusan,
      userRole: profile.userRole,
    };
  }
  return { ...DEFAULT_SISWA, nis: id };
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