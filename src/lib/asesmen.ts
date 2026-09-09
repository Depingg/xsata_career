export type DimensionKey =
  | "desain"
  | "teknologi"
  | "bisnis"
  | "komunikasi"
  | "kepemimpinan"
  | "operasional";

export type PathwayKey = "kuliah" | "kerja" | "kerja-kuliah" | "wirausaha";

export type KesiapanKey = "eksplorasi" | "komunikasi" | "ketelitian" | "mobilitas";

export interface AsesmenOption {
  label: string;
  dimension?: DimensionKey;
  pathway?: PathwayKey;
  kesiapan?: Partial<Record<KesiapanKey, number>>;
}

export interface AsesmenQuestion {
  kategori: string;
  prompt: string;
  options: AsesmenOption[];
}

export const questions: AsesmenQuestion[] = [
  {
    kategori: "Minat & Pilihan Proyek",
    prompt: "Saat mengerjakan proyek kelompok, bagian apa yang paling kamu nikmati?",
    options: [
      { label: "Merancang tampilan, antarmuka, atau desain visual", dimension: "desain" },
      {
        label: "Menganalisis data, merancang logika/sistem, dan memecahkan masalah",
        dimension: "teknologi",
      },
      {
        label: "Mengorganisir tim, membagi tugas, dan mengelola alur kerja",
        dimension: "kepemimpinan",
      },
      {
        label: "Menulis laporan, presentasi, dan berkomunikasi dengan orang lain",
        dimension: "komunikasi",
      },
    ],
  },
  {
    kategori: "Lingkungan Kerja Ideal",
    prompt: "Lingkungan kerja seperti apa yang paling kamu inginkan setelah lulus SMK?",
    options: [
      {
        label: "Kantor/Studio modern yang fleksibel dan kreatif",
        dimension: "desain",
      },
      {
        label: "Lapangan/Pabrik/Bengkel/Lab dengan peralatan teknis lengkap",
        dimension: "operasional",
      },
      {
        label: "Perusahaan startup/bisnis independen atau wirausaha",
        dimension: "bisnis",
      },
      {
        label: "Bekerja secara mandiri (remote/freelance) dari rumah",
        dimension: "teknologi",
      },
    ],
  },
  {
    kategori: "Rencana Utama Pasca-Lulus",
    prompt: "Apa prioritas utama rencana kariermu setelah lulus dari SMK?",
    options: [
      { label: "Langsung bekerja sesuai keahlian jurusan SMK", pathway: "kerja" },
      {
        label: "Melanjutkan pendidikan ke Perguruan Tinggi (D3/D4/S1)",
        pathway: "kuliah",
      },
      { label: "Bekerja terlebih dahulu lalu kuliah (kerja sambil kuliah)", pathway: "kerja-kuliah" },
      { label: "Membuka usaha mandiri / berwirausaha", pathway: "wirausaha", dimension: "bisnis" },
    ],
  },
  {
    kategori: "Dukungan & Kesiapan Finansial",
    prompt:
      "Bagaimana bentuk dukungan dan kesiapan finansial orang tua/wali jika kamu ingin melanjutkan ke Perguruan Tinggi?",
    options: [
      {
        label: "Sangat mampu membiayai kuliah secara mandiri hingga lulus",
        pathway: "kuliah",
      },
      {
        label: "Mendukung penuh, namun perlu mengandalkan jalur beasiswa (KIP-Kuliah/Beasiswa Vokasi)",
        pathway: "kuliah",
      },
      {
        label: "Mendukung jika saya bekerja terlebih dahulu untuk membiayai kuliah sendiri",
        pathway: "kerja-kuliah",
      },
      {
        label: "Orang tua menyarankan/mewajibkan untuk langsung bekerja setelah lulus SMK",
        pathway: "kerja",
      },
    ],
  },
  {
    kategori: "Gaya Pemecahan Masalah",
    prompt: "Ketika menghadapi kegagalan fungsi program/alat/sistem saat praktikum, apa langkah pertamamu?",
    options: [
      {
        label: "Menganalisis kesalahan (troubleshooting) secara mandiri melalui internet/dokumentasi",
        dimension: "teknologi",
      },
      {
        label: "Berdiskusi dan meminta bantuan ke teman kelompok",
        dimension: "komunikasi",
      },
      {
        label: "Langsung bertanya dan meminta petunjuk dari guru/instruktur",
        dimension: "komunikasi",
      },
      {
        label: "Mencoba berbagai cara alternatif secara eksperimental",
        dimension: "operasional",
      },
    ],
  },
  {
    kategori: "Keterampilan Interpersonal",
    prompt: "Bagaimana tingkat kenyamananmu saat harus berkomunikasi atau presentasi di depan umum/klien?",
    options: [
      {
        label: "Sangat percaya diri dan menikmati interaksi publik",
        dimension: "komunikasi",
        kesiapan: { komunikasi: 95 },
      },
      {
        label: "Cukup percaya diri jika materi sudah disiapkan dengan matang",
        dimension: "komunikasi",
        kesiapan: { komunikasi: 70 },
      },
      {
        label: "Kurang nyaman, lebih suka bekerja di balik layar",
        dimension: "teknologi",
        kesiapan: { komunikasi: 25 },
      },
      {
        label: "Hanya nyaman berbicara dalam lingkup kelompok kecil",
        dimension: "kepemimpinan",
        kesiapan: { komunikasi: 40 },
      },
    ],
  },
  {
    kategori: "Ketelitian & Proses Kerja",
    prompt: "Bagaimana sikapmu terhadap pekerjaan yang membutuhkan ketelitian tinggi dan proses berulang?",
    options: [
      {
        label: "Sangat betah duduk berjam-jam menyelesaikan detail kecil hingga sempurna",
        dimension: "operasional",
        kesiapan: { ketelitian: 95 },
      },
      {
        label: "Suka jika pekerjaan tersebut bervariasi dan tidak membosankan",
        dimension: "desain",
        kesiapan: { ketelitian: 55 },
      },
      {
        label: "Cepat bosan, lebih menyukai pekerjaan teknis yang aktif bergerak",
        dimension: "operasional",
        kesiapan: { ketelitian: 45 },
      },
      {
        label: "Lebih suka tugas yang berfokus pada konsep dan ide besar",
        dimension: "desain",
        kesiapan: { ketelitian: 55 },
      },
    ],
  },
  {
    kategori: "Eksplorasi Teknologi",
    prompt:
      "Seberapa sering kamu mempelajari alat (tool), perangkat lunak, atau teknologi baru di luar jam sekolah?",
    options: [
      {
        label: "Sangat sering, hampir setiap minggu otodidak melalui internet/YouTube",
        dimension: "teknologi",
        kesiapan: { eksplorasi: 95 },
      },
      {
        label: "Kadang-kadang, jika dibutuhkan untuk tugas/proyek sekolah",
        dimension: "teknologi",
        kesiapan: { eksplorasi: 65 },
      },
      {
        label: "Jarang, hanya fokus pada materi yang diajarkan guru",
        kesiapan: { eksplorasi: 35 },
      },
      {
        label: "Belum pernah melakukan eksplorasi mandiri",
        kesiapan: { eksplorasi: 5 },
      },
    ],
  },
  {
    kategori: "Kesiapan Lokasi Kerja",
    prompt: "Apakah kamu bersedia ditempatkan atau bekerja di luar daerah/luar kota setelah lulus?",
    options: [
      {
        label: "Sangat siap merantau ke mana saja demi peluang karier yang bagus",
        kesiapan: { mobilitas: 95 },
      },
      {
        label: "Bersedia jika daerah tersebut masih dalam satu provinsi/terjangkau",
        kesiapan: { mobilitas: 70 },
      },
      {
        label: "Hanya ingin bekerja di sekitar area domisili/kota saat ini",
        kesiapan: { mobilitas: 35 },
      },
      {
        label: "Belum menentukan pilihan",
        kesiapan: { mobilitas: 10 },
      },
    ],
  },
  {
    kategori: "Orientasi Pengembangan Diri",
    prompt: "Apa pencapaian terpenting yang ingin kamu raih dalam 3 tahun ke depan?",
    options: [
      { label: "Memiliki gaji mandiri dan membantu ekonomi keluarga", pathway: "kerja" },
      {
        label: "Memiliki gelar sarjana/diploma di bidang keahlian impian",
        pathway: "kuliah",
      },
      {
        label: "Memiliki sertifikasi profesi/industri tingkat nasional atau internasional",
        pathway: "kerja",
      },
      {
        label: "Berhasil mendirikan bisnis/usaha mandiri yang stabil",
        pathway: "wirausaha",
        dimension: "bisnis",
      },
    ],
  },
];

export const dimensionMeta: Record<
  DimensionKey,
  { label: string; careers: string[]; jurusan: string[]; skillTip: string }
> = {
  desain: {
    label: "Desain & Kreativitas",
    careers: [
      "UI/UX Designer",
      "Frontend Developer",
      "Desainer Visual / Desain Grafis",
      "Konten Kreator",
    ],
    jurusan: ["RPL", "Tata Busana"],
    skillTip: "Perkuat Figma, HTML/CSS, dan usability testing melalui proyek portofolio.",
  },
  teknologi: {
    label: "Teknologi & Logika",
    careers: [
      "Programmer / Software Developer",
      "Network Engineer (TKJ)",
      "IT Support / Sysadmin",
      "Data Analyst / Database Admin",
    ],
    jurusan: ["TKJ", "RPL"],
    skillTip: "Fokus pada logika pemrograman, administrasi jaringan, dan ambil sertifikasi industri.",
  },
  bisnis: {
    label: "Bisnis & Kewirausahaan",
    careers: [
      "Wirausaha / Owner Usaha",
      "Digital Marketing",
      "Sales & Business Development",
    ],
    jurusan: ["Tata Boga", "Tata Busana"],
    skillTip: "Pelajari pembukuan sederhana, digital marketing, dan teknik negosiasi penjualan.",
  },
  komunikasi: {
    label: "Komunikasi & Presentasi",
    careers: [
      "Public Relations / Humas",
      "Trainer / Fasilitator",
      "Customer Service",
      "Broadcaster / Penyiar",
    ],
    jurusan: ["RPL", "TKJ"],
    skillTip: "Tingkatkan public speaking, copywriting, dan teknik presentasi di depan publik.",
  },
  kepemimpinan: {
    label: "Kepemimpinan & Organisasi",
    careers: [
      "Project Manager",
      "Supervisor Produksi",
      "Ketua Tim / Kepala Divisi",
      "Event Organizer Lead",
    ],
    jurusan: ["TKR", "TSM"],
    skillTip: "Latih delegasi tugas tim, perencanaan proyek, dan komunikasi kelompok yang efektif.",
  },
  operasional: {
    label: "Operasional & Ketelitian",
    careers: [
      "Teknisi Lapangan / Instalasi",
      "Quality Control",
      "Teknisi Bengkel / Lab",
      "Logistik & Perawatan Alat",
    ],
    jurusan: ["TKR", "TSM", "TKJ"],
    skillTip: "Asah ketelitian, perawatan alat, dan kepatuhan SOP keselamatan kerja.",
  },
};

export const pathwayMeta: Record<PathwayKey, { label: string; tagline: string }> = {
  kuliah: {
    label: "Kuliah / Pendidikan Lanjut",
    tagline: "Lanjut kuliah D3/D4/S1 di bidang yang linear dengan jurusan SMK.",
  },
  kerja: {
    label: "Langsung Bekerja",
    tagline: "Fokus membangun karier dan pengalaman kerja nyata di industri.",
  },
  "kerja-kuliah": {
    label: "Kerja sambil Kuliah",
    tagline: "Menyeimbangkan pengalaman kerja dengan jenjang pendidikan.",
  },
  wirausaha: {
    label: "Wirausaha / Bisnis Mandiri",
    tagline: "Membangun usaha sendiri berbasis keahlian dan minat kamu.",
  },
};

const allDimensions: DimensionKey[] = [
  "desain",
  "teknologi",
  "bisnis",
  "komunikasi",
  "kepemimpinan",
  "operasional",
];

const kesiapanKeys: KesiapanKey[] = ["eksplorasi", "komunikasi", "ketelitian", "mobilitas"];

const zeroDimensions = (): Record<DimensionKey, number> =>
  Object.fromEntries(allDimensions.map((d) => [d, 0])) as Record<DimensionKey, number>;

function possiblePerDimension(): Record<DimensionKey, number> {
  const acc = zeroDimensions();
  for (const q of questions) {
    const present = new Set<DimensionKey>();
    for (const opt of q.options) {
      if (opt.dimension) present.add(opt.dimension);
    }
    for (const d of present) acc[d] += 1;
  }
  return acc;
}

function pointsPerDimension(answers: Record<number, number>): Record<DimensionKey, number> {
  const acc = zeroDimensions();
  for (const raw of Object.keys(answers)) {
    const step = Number(raw);
    const opt = questions[step]?.options[answers[step]];
    if (opt?.dimension) acc[opt.dimension] += 1;
  }
  return acc;
}

function votesPerPathway(answers: Record<number, number>): Record<PathwayKey, number> {
  const votes: Record<PathwayKey, number> = { kuliah: 0, kerja: 0, "kerja-kuliah": 0, wirausaha: 0 };
  for (const raw of Object.keys(answers)) {
    const step = Number(raw);
    const opt = questions[step]?.options[answers[step]];
    if (opt?.pathway) votes[opt.pathway] += 1;
  }
  return votes;
}

function resolvePathway(
  votes: Record<PathwayKey, number>,
  finansial?: number
): PathwayKey {
  const order: PathwayKey[] = ["kuliah", "kerja-kuliah", "kerja", "wirausaha"];
  let best: PathwayKey = order[0];
  let bestCount = -1;
  for (const key of order) {
    if (votes[key] > bestCount) {
      best = key;
      bestCount = votes[key];
    }
  }
  if (finansial === undefined) return best;
  if (best === "kuliah" && finansial === 3) return "kerja";
  if (best === "kerja-kuliah" && (finansial === 0 || finansial === 1)) return "kuliah";
  if (
    best === "kerja" &&
    (finansial === 0 || finansial === 1) &&
    votes.kuliah === votes.kerja
  ) {
    return "kuliah";
  }
  return best;
}

function kesiapanFromAnswers(answers: Record<number, number>): Record<KesiapanKey, number> {
  const acc: Record<KesiapanKey, number> = { eksplorasi: 0, komunikasi: 0, ketelitian: 0, mobilitas: 0 };
  for (const raw of Object.keys(answers)) {
    const step = Number(raw);
    const opt = questions[step]?.options[answers[step]];
    if (!opt?.kesiapan) continue;
    for (const key of kesiapanKeys) {
      const value = opt.kesiapan[key];
      if (value !== undefined) acc[key] = value;
    }
  }
  return acc;
}

function buildRecommendations(input: {
  scores: Record<DimensionKey, number>;
  ranking: DimensionKey[];
  top: DimensionKey;
  pathway: PathwayKey;
  kesiapan: Record<KesiapanKey, number>;
  finansial?: number;
  tujuan?: number;
}): string[] {
  const out: string[] = [];
  const topMeta = dimensionMeta[input.top];
  const weak = input.ranking[input.ranking.length - 1];

  out.push(
    `Kekuatan utamamu ada di ${topMeta.label} (${input.scores[input.top]}%). Karier yang paling cocok: ${topMeta.careers.slice(0, 3).join(", ")}.`
  );

  if (input.scores[weak] < 60) {
    out.push(`Area yang perlu digenjot: ${dimensionMeta[weak].label}. ${dimensionMeta[weak].skillTip}`);
  }

  switch (input.pathway) {
    case "kuliah":
      out.push(
        input.finansial === 1
          ? "Rencanakan jalur masuk PTN (SNBP/SNBT) dan siapkan dokumen KIP-Kuliah/Beasiswa Vokasi sejak dini."
          : "Riset kampus dan jurusan yang linear dengan SMK, siapkan portofolio, dan persiapkan diri untuk kuliah."
      );
      break;
    case "kerja":
      out.push(
        "Perkuat berkas lamaran (CV, surat lamaran, portofolio) lalu pantau menu Lowongan dan ajukan lamaran secara terarah."
      );
      break;
    case "kerja-kuliah":
      out.push(
        "Pilih kampus terdekat dengan kelas malam/blended agar tidak bentrok dengan jadwal kerja; mulailah dari kerja magang (PKL) dulu."
      );
      break;
    case "wirausaha":
      out.push(
        "Mulai dari usaha kecil sesuai keahlianmu, uji pasar secara nyata, dan pelajari pembukuan serta aspek legalitas usaha."
      );
      break;
  }

  if (input.kesiapan.eksplorasi <= 45) {
    out.push(
      "Luangkan waktu eksplorasi mandiri lewat tutorial YouTube/artikel untuk menambah skill di luar jam sekolah."
    );
  }
  if (input.kesiapan.komunikasi <= 45) {
    out.push(
      "Latih public speaking secara rutin — mulai dari presentasi di kelas lalu rekam dan evaluasi untuk menaikkan percaya diri."
    );
  }
  if (input.kesiapan.mobilitas <= 35) {
    out.push(
      "Perluas radius lamaran ke area sekitarmu dan pertimbangkan pelatihan daring agar peluang karier makin terbuka."
    );
  }

  return out.slice(0, 5);
}

export interface AsesmenResult {
  scores: Record<DimensionKey, number>;
  ranking: DimensionKey[];
  top: DimensionKey;
  second: DimensionKey;
  match: number;
  pathway: PathwayKey;
  pathwayReason: string;
  kesiapan: Record<KesiapanKey, number>;
  recommendations: string[];
  answerSummary: { kategori: string; prompt: string; selected: string }[];
}

export function buildResult(answers: Record<number, number>): AsesmenResult {
  const possible = possiblePerDimension();
  const points = pointsPerDimension(answers);
  const scores = zeroDimensions();
  for (const key of allDimensions) {
    scores[key] = possible[key] ? Math.round((points[key] / possible[key]) * 100) : 0;
  }

  const ranking = [...allDimensions].sort((a, b) => scores[b] - scores[a]);
  const top = ranking[0];
  const second = ranking[1];

  const votes = votesPerPathway(answers);
  const finansial = answers[3];
  const pathway = resolvePathway(votes, finansial);
  const kesiapan = kesiapanFromAnswers(answers);

  let pathwayReason =
    pathwayMeta[pathway].tagline;
  if (finansial === 0) {
    pathwayReason += " Orang tua/wali siap membiayai kuliah secara mandiri.";
  } else if (finansial === 1) {
    pathwayReason += " Dukungan orang tua tersedia melalui jalur beasiswa (KIP-Kuliah/Beasiswa Vokasi).";
  } else if (finansial === 2) {
    pathwayReason += " Jalur ini sejalan dengan kesiapan: bekerja dulu sambil menyiapkan biaya kuliah.";
  } else if (finansial === 3) {
    pathwayReason += " Mengikuti arahan orang tua untuk langsung bekerja setelah lulus SMK.";
  }

  const recommendations = buildRecommendations({
    scores,
    ranking,
    top,
    pathway,
    kesiapan,
    finansial,
    tujuan: answers[9],
  });

  const answerSummary = questions.map((q, index) => {
    const selected = answers[index] ?? -1;
    return {
      kategori: q.kategori,
      prompt: q.prompt,
      selected:
        selected >= 0
          ? `${String.fromCharCode(65 + selected)}. ${q.options[selected].label}`
          : "(belum dijawab)",
    };
  });

  return {
    scores,
    ranking,
    top,
    second,
    match: scores[top],
    pathway,
    pathwayReason,
    kesiapan,
    recommendations,
    answerSummary,
  };
}

export const ASESMEN_STORAGE_KEY = "xsata-asesmen";

export interface PersistedAsesmen {
  answers: Record<number, number>;
  result: AsesmenResult;
  updatedAt: string;
}

export function saveAsesmen(data: PersistedAsesmen) {
  try {
    window.localStorage.setItem(ASESMEN_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* abaikan jika storage tidak tersedia */
  }
}

export function clearAsesmen() {
  try {
    window.localStorage.removeItem(ASESMEN_STORAGE_KEY);
  } catch {
    /* abaikan */
  }
}

export const kesiapanLabels: Record<KesiapanKey, string> = {
  eksplorasi: "Eksplorasi Teknologi",
  komunikasi: "Komunikasi & Presentasi",
  ketelitian: "Ketelitian & Detail",
  mobilitas: "Kesiapan Mobilitas",
};