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

const g = globalThis as unknown as Record<string, Loker[] | undefined>;

if (!g.__lokerStore) {
  g.__lokerStore = [];
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
