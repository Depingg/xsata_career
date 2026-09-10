/*
  Warnings:

  - You are about to drop the column `nama` on the `Siswa` table. All the data in the column will be lost.
  - Added the required column `jenisKelamin` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelas` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `namaLengkap` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nisn` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rombel` to the `Siswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Siswa` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Siswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nis" TEXT NOT NULL,
    "nisn" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "rombel" TEXT NOT NULL,
    "jenisKelamin" TEXT NOT NULL,
    "email" TEXT NOT NULL DEFAULT '',
    "statusAktif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Siswa" ("createdAt", "id", "jurusan", "nis") SELECT "createdAt", "id", "jurusan", "nis" FROM "Siswa";
DROP TABLE "Siswa";
ALTER TABLE "new_Siswa" RENAME TO "Siswa";
CREATE UNIQUE INDEX "Siswa_nis_key" ON "Siswa"("nis");
CREATE UNIQUE INDEX "Siswa_nisn_key" ON "Siswa"("nisn");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
