export type StatusTerserap = "Bekerja" | "Melanjutkan" | "Wirausaha";

export interface Alumni {
  id: number;
  nama: string;
  angkatan: string;
  jurusan: string;
  status: StatusTerserap;
  tempat: string;
  tahun: string;
}

const seedData: Alumni[] = [
  { id: 1, nama: "Nanda", angkatan: "2024", jurusan: "TKJ", status: "Bekerja", tempat: "PT Teknologi Nusantara", tahun: "2025" },
  { id: 2, nama: "Rizky Pratama", angkatan: "2024", jurusan: "TKJ", status: "Melanjutkan", tempat: "Politeknik Negeri Bandung", tahun: "2025" },
  { id: 3, nama: "Siti Rahma", angkatan: "2024", jurusan: "Multimedia", status: "Bekerja", tempat: "Studio Kreatif ID", tahun: "2025" },
  { id: 4, nama: "Dimas Adit", angkatan: "2024", jurusan: "AKL", status: "Wirausaha", tempat: "Kedai Kopi Nusantara", tahun: "2025" },
  { id: 5, nama: "Nadia Sari", angkatan: "2023", jurusan: "OTKP", status: "Bekerja", tempat: "PT Mitra Layanan", tahun: "2024" },
  { id: 6, nama: "Budi Setiawan", angkatan: "2023", jurusan: "TKRO", status: "Bekerja", tempat: "Astra Daihatsu Motor", tahun: "2024" },
  { id: 7, nama: "Maya Anggraini", angkatan: "2023", jurusan: "RPL", status: "Melanjutkan", tempat: "Universitas Bina Nusantara", tahun: "2024" },
  { id: 8, nama: "Fajar Nugroho", angkatan: "2022", jurusan: "ELIN", status: "Bekerja", tempat: "PT Bangkit Energi", tahun: "2024" },
  { id: 9, nama: "Rina Wulandari", angkatan: "2022", jurusan: "Pemasaran", status: "Wirausaha", tempat: "Toko Online Rina Shop", tahun: "2024" },
  { id: 10, nama: "Yoga Saputra", angkatan: "2022", jurusan: "TP", status: "Bekerja", tempat: "CV Karya Mesindo", tahun: "2024" },
  { id: 11, nama: "Citra Ayu", angkatan: "2021", jurusan: "AKL", status: "Bekerja", tempat: "Kantor Akuntan Publik", tahun: "2023" },
  { id: 12, nama: "Hendra Gunawan", angkatan: "2021", jurusan: "TKJ", status: "Melanjutkan", tempat: "Universitas Indonesia", tahun: "2023" },
  { id: 13, nama: "Aprilia Dwi", angkatan: "2021", jurusan: "Multimedia", status: "Bekerja", tempat: "Media Kreatif Bersama", tahun: "2023" },
  { id: 14, nama: "Rendy Alamsyah", angkatan: "2020", jurusan: "TBSM", status: "Bekerja", tempat: "AHASS Sepeda Motor", tahun: "2022" },
  { id: 15, nama: "Lestari Putri", angkatan: "2020", jurusan: "Tata Boga", status: "Wirausaha", tempat: "Catering Lestari", tahun: "2022" },
];

const g = globalThis as unknown as Record<string, Alumni[] | undefined>;

if (!g.__tracerStudyStore) {
  g.__tracerStudyStore = [...seedData];
}

const store: Alumni[] = g.__tracerStudyStore;

let nextId = store.length > 0 ? Math.max(...store.map((a) => a.id)) + 1 : 1;

const STATUS_LIST: StatusTerserap[] = ["Bekerja", "Melanjutkan", "Wirausaha"];

export interface TracerStats {
  total: number;
  counts: Record<StatusTerserap, number>;
  percentages: Record<StatusTerserap, number>;
}

export const tracerStudyStore = {
  getAll(): Alumni[] {
    return store;
  },

  getById(id: number): Alumni | undefined {
    return store.find((a) => a.id === id);
  },

  add(data: Omit<Alumni, "id">): Alumni {
    const alumni: Alumni = { ...data, id: nextId++ };
    store.push(alumni);
    return alumni;
  },

  addMany(items: Omit<Alumni, "id">[]): Alumni[] {
    return items.map((item) => this.add(item));
  },

  stats(): TracerStats {
    const counts: Record<StatusTerserap, number> = {
      Bekerja: 0,
      Melanjutkan: 0,
      Wirausaha: 0,
    };

    for (const alumni of store) {
      counts[alumni.status] = (counts[alumni.status] ?? 0) + 1;
    }

    const total = store.length;
    const percentages: Record<StatusTerserap, number> = {
      Bekerja: total ? Math.round((counts.Bekerja / total) * 100) : 0,
      Melanjutkan: total ? Math.round((counts.Melanjutkan / total) * 100) : 0,
      Wirausaha: total ? Math.round((counts.Wirausaha / total) * 100) : 0,
    };

    return { total, counts, percentages };
  },

  statusList(): StatusTerserap[] {
    return STATUS_LIST;
  },
};