import type { Metadata } from "next";
import Link from "next/link";
import { Search, MapPin, Building2, Clock, ArrowRight, Briefcase } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Lowongan",
  description: "Info lowongan kerja dan magang (PKL) untuk siswa SMK dari mitra industri terverifikasi.",
};

const jobs = [
  { logo: "TN", title: "Junior Frontend Developer", company: "PT Teknologi Nusantara", location: "Jakarta", type: "Full-time", posted: "2 hari lalu" },
  { logo: "SK", title: "UI/UX Design Intern", company: "Studio Kreatif ID", location: "Surabaya", type: "Magang (PKL)", posted: "Kemarin" },
  { logo: "SD", title: "IT Support Staff", company: "PT Solusi Digital", location: "Bandung", type: "Full-time", posted: "5 hari lalu" },
  { logo: "MK", title: "Content & Multimedia Assistant", company: "Media Kreatif Bersama", location: "Jakarta", type: "Magang (PKL)", posted: "1 minggu lalu" },
  { logo: "ML", title: "Data Entry & Admin", company: "PT Mitra Layanan", location: "Bekasi", type: "Part-time", posted: "3 hari lalu" },
];

export default function PublicLowonganPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-accent-soft">
        <section className="bg-primary py-16 text-center">
          <Container>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-semibold text-accent">
              <Briefcase className="h-4 w-4" />
              Lowongan Terverifikasi
            </span>
            <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
              Temukan Peluang Karier & Magang
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-accent">
              Ribuan peluang kerja dan PKL dari mitra industri terpercaya untuk siswa SMK.
            </p>
            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex gap-2 rounded-2xl border border-white/20 bg-white p-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    placeholder="Cari posisi, perusahaan, atau kota..."
                    className="h-11 w-full rounded-xl pl-10 pr-3 text-sm outline-none"
                  />
                </div>
                <button className="rounded-xl bg-primary px-5 text-sm font-semibold text-white">
                  Cari
                </button>
              </div>
            </div>
          </Container>
        </section>

        <Container className="py-12">
          <div className="mb-6 flex flex-wrap gap-2">
            {["Semua", "Full-time", "Magang (PKL)", "Part-time"].map((f, i) => (
              <button
                key={f}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-primary text-white"
                    : "border border-border-light bg-white text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.title}>
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent text-lg font-bold text-primary">
                    {job.logo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="accent">{job.type}</Badge>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1 rounded-lg border border-border-light px-3.5 py-2 text-sm font-medium text-primary transition-colors hover:border-primary hover:bg-accent"
                    >
                      Detail
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-accent p-6 text-center">
            <p className="font-semibold text-slate-800">Ingin melihat lowongan yang sesuai minat dan mendapat rekomendasi AI?</p>
            <p className="mt-1 text-sm text-slate-600">Masuk menggunakan NIS/NIP untuk akses penuh rekomendasi personal dan proses lamaran.</p>
            <div className="mt-4 flex justify-center">
              <LinkButton href="/login">Daftar Gratis</LinkButton>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
