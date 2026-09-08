export interface Testimoni {
  id: number;
  nama: string;
  role: "Siswa";
  detail: string;
  rating: number;
  pesan: string;
  createdAt: string;
}

const g = globalThis as unknown as Record<string, Testimoni[] | undefined>;

if (!g.__testimoniStore) {
  g.__testimoniStore = [];
}

const store: Testimoni[] = g.__testimoniStore;

let nextId = store.length > 0 ? Math.max(...store.map((t) => t.id)) + 1 : 1;

export const testimoniStore = {
  getAll(): Testimoni[] {
    return store;
  },

  add(data: Omit<Testimoni, "id" | "createdAt">): Testimoni {
    const testimoni: Testimoni = {
      ...data,
      id: nextId++,
      createdAt: new Date().toISOString(),
    };
    store.push(testimoni);
    return testimoni;
  },
};