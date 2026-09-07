export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export const WELCOME_MESSAGE =
  "Halo! 👋 Saya Guru BK AI — asisten bimbingan karier digitalmu.\n\nSaya siap bantu kamu memutuskan antara kuliah, bekerja, atau wirausaha, merekomendasikan jurusan kuliah yang linear dengan jurusan SMK-mu, hingga tips menyiapkan berkas lamaran dan wawancara kerja.\n\nMau mulai dari mana? Pilih pertanyaan cepat di bawah atau ketik langsung ya! 😊";

export const QUICK_SUGGESTIONS = [
  "Bingung mau milih kerja atau kuliah?",
  "Rekomendasi jurusan kuliah untuk anak TKJ/RPL",
  "Bagaimana cara menyiapkan mental untuk kerja?",
];

interface JurusanInfo {
  name: string;
  majors: string[];
}

const JURUSAN_MAP: Record<string, JurusanInfo> = {
  rpl: {
    name: "Rekayasa Perangkat Lunak (RPL)",
    majors: [
      "Teknik Informatika / Ilmu Komputer",
      "Rekayasa Perangkat Lunak (RPL/D4)",
      "Sistem Informasi",
      "Teknologi Informasi",
      "Manajemen Informatika (D3)",
    ],
  },
  tkj: {
    name: "Teknik Komputer dan Jaringan (TKJ)",
    majors: [
      "Teknik Informatika / Ilmu Komputer",
      "Sistem Informasi",
      "D4 Teknik Komputer & Jaringan / Jaringan Telekomunikasi",
      "Keamanan Siber (Cybersecurity)",
      "Teknik Telekomunikasi",
    ],
  },
  mm: {
    name: "Multimedia (MM)",
    majors: [
      "Desain Komunikasi Visual (DKV)",
      "Animasi & Film / Televisi",
      "Ilmu Komunikasi",
      "Sistem Informasi (untuk karier desainer UI/UX)",
      "D3 Desain Grafis / Multimedia",
    ],
  },
  akl: {
    name: "Akuntansi & Keuangan Lembaga (AKL)",
    majors: [
      "Akuntansi",
      "Manajemen",
      "Perpajakan (D3/D4)",
      "Administrasi Bisnis",
      "Ekonomi Pembangunan",
    ],
  },
  ap: {
    name: "Manajemen Perkantoran (AP/OTKP)",
    majors: [
      "Administrasi Bisnis / Administrasi Publik",
      "Manajemen",
      "Sekretari (D3)",
      "Ilmu Komunikasi",
      "Manajemen Pajak",
    ],
  },
  tkro: {
    name: "Teknik Kendaraan Ringan Otomotif (TKRO)",
    majors: [
      "D3/D4 Teknik Otomotif & Mesin",
      "Teknik Mesin",
      "Teknologi Otomotif (vokasi)",
      "Teknik Mesin Produksi",
    ],
  },
  tsm: {
    name: "Teknik & Bisnis Sepeda Motor (TBSM)",
    majors: [
      "D3 Teknik Otomotif",
      "Teknik Mesin",
      "Teknologi Otomotif",
      "Manajemen Bisnis Otomotif",
    ],
  },
  elin: {
    name: "Teknik Elektronika Industri (ELIN)",
    majors: [
      "D3 Teknik Elektronika",
      "Teknik Elektro",
      "Teknik Mekatronika",
      "Informatika & Robotika",
    ],
  },
  titl: {
    name: "Teknik Instalasi Tenaga Listrik (TITL)",
    majors: ["Teknik Elektro", "D3 Teknik Listrik", "Teknik Energi Terbarukan", "Teknik Mekatronika"],
  },
  tp: {
    name: "Teknik Pemesinan (TP)",
    majors: ["Teknik Mesin", "D3 Teknik Pemesinan", "Teknik Manufaktur", "Teknik Mekatronika"],
  },
  dpib: {
    name: "Desain Pemodelan & Informasi Bangunan (DPIB)",
    majors: ["Teknik Sipil", "Arsitektur", "Teknik Struktur", "Manajemen Konstruksi"],
  },
  pemasaran: {
    name: "Bisnis Daring & Pemasaran",
    majors: [
      "Manajemen Pemasaran",
      "D3 Manajemen Bisnis",
      "Ilmu Ekonomi / Ekonomi Bisnis",
      "E-commerce & Digital Marketing",
    ],
  },
  tb: {
    name: "Tata Boga (TB)",
    majors: ["D3 Tata Boga / Patiseri", "Teknologi Pangan", "Manajemen Perhotelan", "Kewirausahaan"],
  },
  tc: {
    name: "Tata Busana (TC)",
    majors: ["D3 Desain Mode", "Tata Busana (vokasi)", "Teknologi Fesyen", "Manajemen Industri Fesyen"],
  },
};

function findJurusan(input: string): JurusanInfo | undefined {
  const q = input.toLowerCase();

  const combos: Array<[RegExp, string]> = [
    [/tkj|komputer.*jaringan|teknisi jaringan/, "tkj"],
    [/rpl|rekayasa.*perangkat lunak|software/, "rpl"],
    [/multimedia|mm\b/, "mm"],
    [/akl|akuntansi/, "akl"],
    [/otkp|perkantoran|administrasi perkantoran|\bap\b/, "ap"],
    [/tkro|kendaraan ringan|otomotif/, "tkro"],
    [/tbsm|sepeda motor|\btsm\b/, "tsm"],
    [/elin|elektronika/, "elin"],
    [/titl|instalasi.*listrik|listrik/, "titl"],
    [/pemesinan|teknik mesin/, "tp"],
    [/dpib|pemodelan|bangunan|gambar bangunan/, "dpib"],
    [/pemasaran|marketing|bisnis-daring/, "pemasaran"],
    [/tata boga|boga/, "tb"],
    [/tata busana|busana|fesyen|fashion/, "tc"],
  ];

  for (const [regex, key] of combos) {
    if (regex.test(q)) {
      const info = JURUSAN_MAP[key];
      if (info) return info;
    }
  }

  return undefined;
}

function replyJurusan(info: JurusanInfo): string {
  const list = info.majors.map((m, i) => `${i + 1}. ${m}`).join("\n");
  return `Bagus sekali, kamu dari jurusan ${info.name}! 🎓\n\nJurusan kuliah yang LINEAR dan cocok untukmu:\n\n${list}\n\nKenapa linear? Karena mata kuliah yang kamu pelajari akan mendukung skill yang sudah kamu punya di SMK — kamu tidak mulai dari nol.\n\nSaran saya: pilih jurusan yang paling sesuai dengan (1) skill yang kamu kuasai, (2) peluang kerja di daerahmu, dan (3) biaya & jarak kampus. Kalau mau, kasih tahu aku jurusan yang kamu minati, nanti aku bantu bandingkan! 😊`;
}

function replyKerjaVsKuliah(): string {
  return `Keputusan kerja vs kuliah memang besar, tapi tidak ada yang "paling benar" — yang ada adalah yang paling cocok denganmu. 😊\n\nYuk, analisis 3 hal ini dulu:\n\n1️⃣ Tujuan jangka panjang — pekerjaan atau karier apa yang kamu cita-citakan 5–10 tahun ke depan?\n2️⃣ Kondisi & dukungan — apakah membiayai kuliah sekarang sudah siap?\n3️⃣ Kesiapan mental — apakah kamu siap belajar lebih dalam, atau langsung terjun praktik?\n\nCatatan dari Guru BK:\n• Jika cita-citamu membutuhkan gelar (mis. guru, dokter, insinyur), kuliah adalah jalurnya.\n• Ingin langsung kerja? Pilih kerja yang linear dengan jurusan SMK sambil menabung untuk kuliah (D4/S1 bisa sambil kerja).\n• Wirausaha juga sah! Mulai dari ide & modal kecil.\n\nCoba buat daftar 3 kelebihan + 3 kekurangan tiap pilihan ya. Mau aku bantu evaluasi jawabanmu?`;
}

function replyTipsBerkas(): string {
  return `Menyiapkan berkas lamaran itu kuncinya: rapi, jelas, dan relevan. 📋\n\nUntuk siswa SMK, lengkapi ini:\n\n1️⃣ CV singkat (1 halaman) — data diri, pendidikan, skill, pengalaman PKL, prestasi.\n2️⃣ Portofolio — khusus MM/RPL/TKJ: kumpulkan hasil karya & proyek dalam PDF atau tautan online.\n3️⃣ Surat lamaran — 3 paragraf: pembuka sopan, alasan cocok, dan penutup + kesediaan.\n4️⃣ Scan rapi — ijazah/SKL, KTP, KK, dan sertifikat pelatihan.\n5️⃣ Referensi — guru atau pembimbing PKL.\n\nTips Guru BK: sesuaikan CV dan surat lamaranmu dengan setiap lowongan. Jangan seragam untuk semua tempat, dan pastikan tidak ada typo! 💪`;
}

function replyInterview(): string {
  return `Persiapan interview itu 70% riset, 30% keberanian bicara. 💪\n\nSebelum interview:\n• Pelajari profil perusahaan & posisi yang dilamar.\n• Latih jawaban umum: perkenalan diri (30 detik–1 menit), kelebihan & kekurangan, alasan melamar, pengalaman PKL, dan gaji harapan.\n\nSaat interview:\n• Datang 15 menit lebih awal, berpakaian rapi & profesional.\n• Dengarkan baik-baik, jangan memotong pertanyaan.\n• Jawab jujur, antusias, dengan bahasa tubuh positif (duduk tegak, senyum, kontak mata).\n\nSetelah interview:\n• Ucapkan terima kasih dan tanyakan perkiraan hasil.\n\nIngat: gugup itu wajar! Ambil napas dan anggap interview sebagai percakapan, bukan ujian. 😊`;
}

function replyMental(): string {
  return `Siap mental menghadapi dunia kerja itu penting, dan bisa dilatih! 🌱\n\n1️⃣ Kenali & terima dirimu — tulis 3 kelebihan dan 1 hal yang ingin kamu perbaiki.\n2️⃣ Bangun kebiasaan profesional — disiplin waktu, tanggung jawab, komunikasi sopan.\n3️⃣ Berani bertanya — tidak ada pertanyaan yang bodoh di tempat kerja.\n4️⃣ Kelola ekspektasi — dunia kerja punya tekanan, tapi itu bagian dari proses belajar.\n5️⃣ Jaga kesehatan fisik & mental — cukup tidur, makan teratur, dan miliki dukungan sosial.\n\nKalau kecemasanmu terasa berlebih, jangan sungkan berkonsultasi dengan Guru BK di sekolah — kami siap mendengarkan tanpa menghakimi. 💙`;
}

function replyWirausaha(): string {
  return `Tertarik wirausaha? Bagus — banyak siswa SMK sukses berbisnis sejak sekolah! 🚀\n\nLangkah awal yang bisa kamu lakukan:\n\n1️⃣ Temukan kebutuhan orang di sekitarmu — produk atau jasa apa yang mereka butuhkan?\n2️⃣ Mulai kecil & cepat — tidak perlu modal besar. Mulai dari jualan langsung, jastip, atau jasa sesuai skill SMK-mu.\n3️⃣ Manfaatkan media sosial — promosi gratis lewat TikTok/IG/WhatsApp.\n4️⃣ Pisahkan uang pribadi & usaha — catat pemasukan dan pengeluaran sejak awal.\n5️⃣ Cari mentor — guru kewirausahaan, komunitas, atau wirausahawan lokal.\n\nIngat jalur BMW: Bekerja, Melanjutkan, atau Wirausaha — ketiganya sah dan bisa dikombinasikan bertahap. Yang penting ada rencana! Mau aku bantu evaluasi ide usahamu?`;
}

function replyPotensi(): string {
  return `Menganalisis potensi diri itu langkah awal yang paling penting sebelum memilih arah karier. 🔍\n\nCoba jawab jujur 4 pertanyaan ini:\n\n1️⃣ Apa yang paling kamu nikmati saat melakukannya (belajar/praktik)?\n2️⃣ Skill apa yang paling sering dipuji orang di sekitarmu?\n3️⃣ Aktivitas apa yang membuatmu lupa waktu?\n4️⃣ Mata pelajaran mana yang nilainya paling bagus?\n\nDari jawaban itu biasanya kelihatan pola minat & bakatmu.\n\nTips: kamu juga bisa mengikuti Asesmen Minat & Bakat di menu "Asesmen" aplikasi ini — hasilnya otomatis direkomendasikan ke karier yang cocok! Mau aku bantu baca hasil jawabanmu?`;
}

function replyUmum(): string {
  return `Terima kasih sudah berbagi! 🙏\n\nSebagai Guru BK, aku siap membantumu dalam:\n\n1️⃣ Memilih arah karier: kuliah, kerja, atau wirausaha (jalur BMW)\n2️⃣ Rekomendasi jurusan kuliah linear dengan SMK\n3️⃣ Persiapan berkas lamaran (CV, surat lamaran, portofolio)\n4️⃣ Tips interview & menyiapkan mental kerja\n5️⃣ Analisis minat, bakat, dan potensi diri\n\nCoba tanya dengan lebih spesifik ya, misalnya: "Rekomendasi jurusan kuliah untuk anak TKJ", "Apa bedanya kuliah dan kerja", atau "Bagaimana cara agar tidak gugup saat interview?" 😊`;
}

export function generateReply(input: string): string {
  const q = input.toLowerCase();

  const isGreeting = /(halo|hallo|hello|hai\b|hi\b|assalamu|selamat (pagi|siang|sore|malam)|pagi {0,2}bu|siang {0,2}bu|sore {0,2}bu|malam {0,2}bu)/;
  const isThanks = /(terima kasih|makasih|thank|thanks)/;
  const isCareerDecision = /(kerja.*kuliah|kuliah.*kerja|kerja atau kuliah|kuliah atau kerja|melanjutkan (kuliah|pendidikan)|pilih (kerja|kuliah)|bingung.*(kerja|kuliah)|kerja dulu|langsung kerja|lanjut kuliah|bekerja dulu)/;
  const isMajorRec = /(jurusan kuliah|rekomendasi.*jurusan|kuliah.*jurusan|jurusan.*(rpl|tkj|mm|akl|tkro|akuntansi)|ambil.*jurusan|kuliah.*(rpl|tkj|mm|akl|akuntansi)|pilih.*kuliah)/;
  const isCv = /(\bcv\b|curriculum|lamaran|portofolio|berkas|melamar)/;
  const isInterview = /(interview|wawancara|tes wawancara|hrd)/;
  const isMental = /(mental|gugup|cemas|tegang|stres|stress|percaya diri|minder|takut.*kerja|siap.*kerja|menyiapkan.*(mental|diri))/;
  const isWirausaha = /(wirausaha|berwirausaha|usaha sendiri|bisnis sendiri|berjualan|jualan|buka usaha|startup|bisnis)/;
  const isPotensi = /(potensi|kelebihan|kelemahan|kekurangan|minat|bakat|analisis.*diri|mengenal diri)/;

  if (isGreeting.test(q)) {
    return `Halo! 👋 Ada yang bisa Career Assistant bantu terkait bimbingan karier atau pilihan kuliah/kerja?\n\nKamu bisa bertanya soal pilihan karier (kuliah/kerja/wirausaha), jurusan kuliah yang sesuai dengan SMK-mu, atau tips persiapan kerja & wawancara. Semangat! 😊`;
  }

  if (isThanks.test(q)) {
    return `Sama-sama! Senang bisa membantu. 😊\n\nJangan sungkan kembali bertanya kapan pun kamu butuh — perjalanan karier itu proses, dan kamu tidak sendiri. Tetap semangat ya! 💪`;
  }

  if (isCareerDecision.test(q)) {
    return replyKerjaVsKuliah();
  }

  if (isWirausaha.test(q) && /(kerja|magang)\b/.test(q) === false) {
    return replyWirausaha();
  }

  if (isInterview.test(q)) {
    return replyInterview();
  }

  if (isCv.test(q)) {
    return replyTipsBerkas();
  }

  if (isMajorRec.test(q)) {
    const info = findJurusan(q);
    if (info) return replyJurusan(info);
    return `Seru! 🎓 Aku bisa merekomendasikan jurusan kuliah yang linear dengan jurusan SMK-mu.\n\nSebelum itu, jurusan SMK kamu apa ya? Misalnya: RPL, TKJ, Multimedia (MM), Akuntansi (AKL), Perkantoran (OTKP), Teknik Otomotif (TKRO), atau lainnya. Kasih tahu aku, nanti kubantu pilihkan yang paling cocok!`;
  }

  const jurusan = findJurusan(q);
  if (jurusan && /(kuliah|jurusan|s1|d3|d4|sarjana|pendidikan tinggi)/.test(q)) {
    return replyJurusan(jurusan);
  }

  if (isMental.test(q)) {
    return replyMental();
  }

  if (isPotensi.test(q)) {
    return replyPotensi();
  }

  return replyUmum();
}