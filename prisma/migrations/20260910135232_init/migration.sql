-- CreateTable
CREATE TABLE "Siswa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nis" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Loker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "match" INTEGER NOT NULL DEFAULT 0,
    "posted" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "jurusan" TEXT NOT NULL DEFAULT '[]',
    "bkkVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Testimoni" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "detail" TEXT NOT NULL DEFAULT '',
    "rating" INTEGER NOT NULL,
    "pesan" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Siswa_nis_key" ON "Siswa"("nis");
