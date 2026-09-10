import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SeedSiswa {
  nis: string;
  nisn: string;
  password: string;
  namaLengkap: string;
  kelas: string;
  jurusan: string;
  rombel: string;
  jenisKelamin: "L" | "P";
  email: string;
  statusAktif?: boolean;
}

const dataSiswa: SeedSiswa[] = [
  {
    nis: "123456",
    nisn: "0123456789",
    password: "password123",
    namaLengkap: "Nanda Pratama",
    kelas: "XII",
    jurusan: "RPL",
    rombel: "XII RPL 1",
    jenisKelamin: "L",
    email: "nanda.pratama@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123457",
    nisn: "0123456790",
    password: "siswa2024",
    namaLengkap: "Siti Rahmawati",
    kelas: "XII",
    jurusan: "RPL",
    rombel: "XII RPL 1",
    jenisKelamin: "P",
    email: "siti.rahmawati@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123458",
    nisn: "0123456791",
    password: "siswa2024",
    namaLengkap: "Budi Santoso",
    kelas: "XII",
    jurusan: "TKJ",
    rombel: "XII TKJ 1",
    jenisKelamin: "L",
    email: "budi.santoso@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123459",
    nisn: "0123456792",
    password: "siswa2024",
    namaLengkap: "Aisyah Putri",
    kelas: "XII",
    jurusan: "TKJ",
    rombel: "XII TKJ 1",
    jenisKelamin: "P",
    email: "aisyah.putri@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123460",
    nisn: "0123456793",
    password: "siswa2024",
    namaLengkap: "Rizky Ramadhan",
    kelas: "XI",
    jurusan: "TKR",
    rombel: "XI TKR 1",
    jenisKelamin: "L",
    email: "rizky.ramadhan@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123461",
    nisn: "0123456794",
    password: "siswa2024",
    namaLengkap: "Dewi Lestari",
    kelas: "XI",
    jurusan: "TKR",
    rombel: "XI TKR 1",
    jenisKelamin: "P",
    email: "dewi.lestari@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123462",
    nisn: "0123456795",
    password: "siswa2024",
    namaLengkap: "Fajar Nugroho",
    kelas: "XI",
    jurusan: "AKL",
    rombel: "XI AKL 1",
    jenisKelamin: "L",
    email: "fajar.nugroho@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123463",
    nisn: "0123456796",
    password: "siswa2024",
    namaLengkap: "Putri Maharani",
    kelas: "XI",
    jurusan: "AKL",
    rombel: "XI AKL 1",
    jenisKelamin: "P",
    email: "putri.maharani@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123464",
    nisn: "0123456797",
    password: "siswa2024",
    namaLengkap: "Andika Wijaya",
    kelas: "X",
    jurusan: "OTKP",
    rombel: "X OTKP 1",
    jenisKelamin: "L",
    email: "andika.wijaya@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123465",
    nisn: "0123456798",
    password: "siswa2024",
    namaLengkap: "Melati Sari",
    kelas: "X",
    jurusan: "OTKP",
    rombel: "X OTKP 1",
    jenisKelamin: "P",
    email: "melati.sari@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123466",
    nisn: "0123456799",
    password: "siswa2024",
    namaLengkap: "Yoga Pratama",
    kelas: "X",
    jurusan: "RPL",
    rombel: "X RPL 1",
    jenisKelamin: "L",
    email: "yoga.pratama@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123467",
    nisn: "0123456800",
    password: "siswa2024",
    namaLengkap: "Intan Permata",
    kelas: "X",
    jurusan: "TKJ",
    rombel: "X TKJ 1",
    jenisKelamin: "P",
    email: "intan.permata@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123468",
    nisn: "0123456801",
    password: "siswa2024",
    namaLengkap: "Galih Prakoso",
    kelas: "XII",
    jurusan: "AKL",
    rombel: "XII AKL 1",
    jenisKelamin: "L",
    email: "galih.prakoso@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123469",
    nisn: "0123456802",
    password: "siswa2024",
    namaLengkap: "Rina Amelia",
    kelas: "XII",
    jurusan: "OTKP",
    rombel: "XII OTKP 1",
    jenisKelamin: "P",
    email: "rina.amelia@student.smkn1tengaran.sch.id",
  },
  {
    nis: "123470",
    nisn: "0123456803",
    password: "siswa2024",
    namaLengkap: "Dimas Anggara",
    kelas: "XI",
    jurusan: "RPL",
    rombel: "XI RPL 1",
    jenisKelamin: "L",
    email: "dimas.anggara@student.smkn1tengaran.sch.id",
  },
];

async function main() {
  console.log("Menjalankan seed data siswa...");

  let created = 0;
  let skipped = 0;

  for (const siswa of dataSiswa) {
    const existing = await prisma.siswa.findUnique({ where: { nis: siswa.nis } });
    if (existing) {
      console.log(`  [SKIP] NIS ${siswa.nis} sudah ada.`);
      skipped++;
      continue;
    }

    await prisma.siswa.create({
      data: {
        ...siswa,
        statusAktif: siswa.statusAktif ?? true,
      },
    });
    created++;
  }

  console.log(`\nSelesai. ${created} data baru dibuat, ${skipped} dilewati (sudah ada).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });