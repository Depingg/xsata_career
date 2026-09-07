export const SMK_MAJORS = [
  { code: "TKJ", label: "Teknik Komputer dan Jaringan" },
  { code: "RPL", label: "Rekayasa Perangkat Lunak" },
  { code: "Tata Busana", label: "Tata Busana (Busana / Busana Digital)" },
  { code: "Tata Boga", label: "Tata Boga (Kuliner)" },
  { code: "TKR", label: "Teknik Kendaraan Ringan" },
  { code: "TSM", label: "Teknik Sepeda Motor" },
] as const;

export type SMKMajorCode = (typeof SMK_MAJORS)[number]["code"];

export const MAJOR_CODES: Readonly<string[]> = SMK_MAJORS.map((m) => m.code);