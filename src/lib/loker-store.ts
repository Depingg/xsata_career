export interface Loker {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Magang (PKL)" | "Part-time";
  salary: string;
  match: number;
  posted: string;
  logo: string;
  saved: boolean;
  jurusan: string[];
  bkkVerified: boolean;
}

const seedData: Loker[] = [
  { id: 1, title: "Junior Frontend Developer", company: "PT Teknologi Nusantara", location: "Jakarta", type: "Full-time", salary: "Rp 4–6 jt", match: 92, posted: "2 hari lalu", logo: "TN", saved: false, jurusan: ["RPL", "TKJ"], bkkVerified: true },
  { id: 2, title: "UI/UX Design Intern", company: "Studio Kreatif ID", location: "Surabaya", type: "Magang (PKL)", salary: "Sesuai UMR", match: 88, posted: "Kemarin", logo: "SK", saved: true, jurusan: ["RPL", "Multimedia"], bkkVerified: true },
  { id: 3, title: "IT Support Staff", company: "PT Solusi Digital", location: "Bandung", type: "Full-time", salary: "Rp 3.5–5 jt", match: 74, posted: "5 hari lalu", logo: "SD", saved: false, jurusan: ["TKJ", "RPL"], bkkVerified: true },
  { id: 4, title: "Content & Multimedia Assistant", company: "Media Kreatif Bersama", location: "Jakarta", type: "Magang (PKL)", salary: "Rp 2.5 jt", match: 69, posted: "1 minggu lalu", logo: "MK", saved: false, jurusan: ["Multimedia"], bkkVerified: false },
  { id: 5, title: "Data Entry & Admin", company: "PT Mitra Layanan", location: "Bekasi", type: "Part-time", salary: "Rp 3 jt", match: 81, posted: "3 hari lalu", logo: "ML", saved: true, jurusan: ["AKL", "OTKP"], bkkVerified: true },
  { id: 6, title: "Teknisi AC & Elektronik", company: "PT Bangkit Energi", location: "Tangerang", type: "Full-time", salary: "Rp 3.5–4.5 jt", match: 77, posted: "1 hari lalu", logo: "BE", saved: false, jurusan: ["ELIN", "TITL"], bkkVerified: true },
  { id: 7, title: "Operator Produksi", company: "CV Karya Mesindo", location: "Cikarang", type: "Full-time", salary: "Rp 3–4 jt", match: 71, posted: "4 hari lalu", logo: "KM", saved: false, jurusan: ["TP", "TKRO"], bkkVerified: false },
  { id: 8, title: "Admin Marketing Digital", company: "PT Jual Kilat", location: "Jakarta", type: "Full-time", salary: "Rp 3.5–5 jt", match: 83, posted: "Kemarin", logo: "JK", saved: true, jurusan: ["Pemasaran", "AKL"], bkkVerified: true },
];

const g = globalThis as unknown as Record<string, Loker[] | undefined>;

if (!g.__lokerStore) {
  g.__lokerStore = [...seedData];
}

const store: Loker[] = g.__lokerStore;

let nextId = store.length > 0 ? Math.max(...store.map((l) => l.id)) + 1 : 1;

export const lokerStore = {
  getAll(): Loker[] {
    return store;
  },

  getById(id: number): Loker | undefined {
    return store.find((l) => l.id === id);
  },

  add(data: Omit<Loker, "id" | "saved">): Loker {
    const loker: Loker = {
      ...data,
      jurusan: data.jurusan ?? [],
      bkkVerified: data.bkkVerified ?? false,
      id: nextId++,
      saved: false,
    };
    store.push(loker);
    return loker;
  },

  scan(query: string): Loker[] {
    const q = query.toLowerCase();
    return store.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        (l.jurusan ?? []).some((j) => j.toLowerCase().includes(q))
    );
  },
};
